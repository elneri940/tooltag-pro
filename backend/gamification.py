import math
import hashlib
from datetime import datetime, timedelta
from .database import get_connection, query_db

DEFAULT_SETTINGS = {
    "initial_points": "100",
    "on_time_bonus": "10",
    "late_penalty_base": "15",
    "late_penalty_hourly": "5",
    "min_points_threshold": "20",
    "kiosk_timeout_seconds": "30",
    "require_pin_for_loans": "false"
}

def hash_pin(pin):
    """Genera hash SHA-256 de un PIN."""
    if not pin:
        return None
    return hashlib.sha256(str(pin).strip().encode('utf-8')).hexdigest()

def verify_pin(user_id, pin):
    """Verifica el PIN de un usuario. Retorna True si coincide o si el usuario no tiene PIN."""
    user = query_db("SELECT pin_hash FROM users WHERE id = ?", (user_id,), one=True)
    if not user:
        raise ValueError("Usuario no encontrado.")
    stored_hash = user.get("pin_hash")
    if not stored_hash:
        return True  # Si no tiene PIN asignado, permite el paso
    return stored_hash == hash_pin(pin)

def set_user_pin(user_id, new_pin):
    """Establece o actualiza el PIN de un usuario."""
    conn = get_connection()
    try:
        pin_h = hash_pin(new_pin) if new_pin else None
        cur = conn.cursor()
        cur.execute("UPDATE users SET pin_hash = ? WHERE id = ?", (pin_h, user_id))
        conn.commit()
        return cur.rowcount > 0
    finally:
        conn.close()

def update_user_profile(user_id, data):
    """Actualiza el perfil de un usuario (nombre, email, avatar, tag). Retorna los datos actualizados."""
    conn = get_connection()
    try:
        cur = conn.cursor()
        fields = []
        values = []
        for key in ("nombre", "email", "avatar_url", "tag_uid"):
            if key in data and data[key] is not None:
                fields.append(f"{key} = ?")
                values.append(data[key].strip() if isinstance(data[key], str) else data[key])
        if not fields:
            raise ValueError("No se proporcionaron campos para actualizar.")
        values.append(user_id)
        sql = f"UPDATE users SET {', '.join(fields)} WHERE id = ?"
        cur.execute(sql, values)
        conn.commit()
        return query_db("SELECT * FROM users WHERE id = ?", (user_id,), one=True)
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()

def get_settings():
    """Obtiene la configuración actual del sistema desde la base de datos."""
    rows = query_db("SELECT key, value, descripcion FROM system_settings")
    settings = dict(DEFAULT_SETTINGS)
    for r in rows:
        settings[r["key"]] = r["value"]
    return settings

def update_setting(key, value, descripcion=None):
    """Actualiza o inserta un parámetro de configuración."""
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute("""
            INSERT INTO system_settings (key, value, descripcion)
            VALUES (?, ?, ?)
            ON CONFLICT(key) DO UPDATE SET value=excluded.value, descripcion=COALESCE(excluded.descripcion, system_settings.descripcion)
        """, (key, str(value), descripcion))
        conn.commit()
    finally:
        conn.close()

def parse_iso_datetime(dt_str):
    """Parsea una cadena de fecha/hora en formato ISO a objeto datetime."""
    if not dt_str:
        return None
    # Remueve 'Z' o reemplaza 'T' con espacio si es necesario
    clean_str = dt_str.replace("Z", "").replace("T", " ")
    for fmt in ("%Y-%m-%d %H:%M:%S", "%Y-%m-%d %H:%M:%S.%f", "%Y-%m-%d %H:%M"):
        try:
            return datetime.strptime(clean_str, fmt)
        except ValueError:
            continue
    # Intento con fromisoformat
    try:
        return datetime.fromisoformat(dt_str)
    except Exception:
        return datetime.now()

def format_datetime(dt):
    """Formatea datetime a cadena ISO limpia."""
    return dt.strftime("%Y-%m-%d %H:%M:%S")

def calculate_deadline(tiempo_horas, start_dt=None):
    """Calcula la fecha límite de devolución a partir de ahora o fecha dada."""
    if start_dt is None:
        start_dt = datetime.now()
    deadline = start_dt + timedelta(hours=int(tiempo_horas))
    return format_datetime(deadline)

def process_loan_checkout(user_id, tool_id, custom_hours=None):
    """
    Registra la salida de una herramienta.
    Verifica que el usuario no esté bloqueado o con puntaje bajo, y que la herramienta esté disponible.
    """
    settings = get_settings()
    min_threshold = int(settings.get("min_points_threshold", 20))

    conn = get_connection()
    try:
        conn.execute("BEGIN IMMEDIATE;")
        cur = conn.cursor()

        # Verificar Usuario
        cur.execute("SELECT id, nombre, puntos, estado FROM users WHERE id = ?", (user_id,))
        user = cur.fetchone()
        if not user:
            raise ValueError(f"Usuario con ID {user_id} no encontrado.")
        
        user_dict = dict(user)
        if user_dict["estado"] == "bloqueado":
            raise ValueError(f"El usuario {user_dict['nombre']} se encuentra BLOQUEADO administrativamente.")
        
        if user_dict["puntos"] < min_threshold:
            raise ValueError(
                f"Préstamo no permitido: {user_dict['nombre']} tiene {user_dict['puntos']} puntos "
                f"(mínimo requerido: {min_threshold} puntos). Debe devolver herramientas pendientes o solicitar revisión."
            )

        # Verificar Herramienta
        cur.execute("SELECT id, nombre, estado, tiempo_prestamo_horas FROM tools WHERE id = ?", (tool_id,))
        tool = cur.fetchone()
        if not tool:
            raise ValueError(f"Herramienta con ID {tool_id} no encontrada.")
        
        tool_dict = dict(tool)
        if tool_dict["estado"] != "disponible":
            raise ValueError(f"La herramienta '{tool_dict['nombre']}' no está disponible (Estado actual: {tool_dict['estado']}).")

        # Calcular Fechas
        ahora = datetime.now()
        tiempo_horas = custom_hours if custom_hours is not None else tool_dict["tiempo_prestamo_horas"]
        fecha_limite = ahora + timedelta(hours=int(tiempo_horas))

        ahora_str = format_datetime(ahora)
        limite_str = format_datetime(fecha_limite)

        # Crear Préstamo
        cur.execute("""
            INSERT INTO loans (user_id, tool_id, fecha_prestamo, fecha_limite, estado)
            VALUES (?, ?, ?, ?, 'activo')
        """, (user_id, tool_id, ahora_str, limite_str))
        loan_id = cur.lastrowid

        # Marcar herramienta como prestada
        cur.execute("UPDATE tools SET estado = 'prestada' WHERE id = ?", (tool_id,))

        conn.commit()

        return {
            "success": True,
            "loan_id": loan_id,
            "user": user_dict,
            "tool": tool_dict,
            "fecha_prestamo": ahora_str,
            "fecha_limite": limite_str,
            "tiempo_horas": tiempo_horas
        }
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()

def process_loan_checkin(loan_id, return_dt=None):
    """
    Procesa la devolución de una herramienta.
    Aplica las reglas de gamificación:
    - A tiempo: +Bono (por defecto +10)
    - Tarde: -Penalización base (-15) - (Horas retraso * Penalización horaria [-5])
    Actualiza el saldo de puntos, genera registro en el Ledger y libera la herramienta.
    """
    settings = get_settings()
    bonus_on_time = int(settings.get("on_time_bonus", 10))
    penalty_base = int(settings.get("late_penalty_base", 15))
    penalty_hourly = int(settings.get("late_penalty_hourly", 5))

    if return_dt is None:
        return_dt = datetime.now()

    conn = get_connection()
    try:
        conn.execute("BEGIN IMMEDIATE;")
        cur = conn.cursor()

        # Obtener datos del préstamo
        cur.execute("""
            SELECT l.id, l.user_id, l.tool_id, l.fecha_prestamo, l.fecha_limite, l.estado,
                   u.nombre as user_nombre, u.puntos as user_puntos,
                   t.nombre as tool_nombre
            FROM loans l
            JOIN users u ON l.user_id = u.id
            JOIN tools t ON l.tool_id = t.id
            WHERE l.id = ?
        """, (loan_id,))
        loan = cur.fetchone()
        if not loan:
            raise ValueError(f"Préstamo con ID {loan_id} no encontrado.")
        
        loan_dict = dict(loan)
        if loan_dict["estado"] != "activo":
            raise ValueError(f"Este préstamo ya fue finalizado previamente (Estado: {loan_dict['estado']}).")

        limite_dt = parse_iso_datetime(loan_dict["fecha_limite"])
        return_str = format_datetime(return_dt)

        # Cálculo de tiempo y penalización
        diff_seconds = (return_dt - limite_dt).total_seconds()

        if diff_seconds <= 0:
            # A TIEMPO O ANTICIPADA
            estado_final = "devuelto_a_tiempo"
            puntos_delta = bonus_on_time
            motivo = f"Devolución puntual de herramienta '{loan_dict['tool_nombre']}' (+{bonus_on_time} pts)"
            horas_retraso = 0
        else:
            # RETRASO
            estado_final = "devuelto_tarde"
            horas_retraso = math.ceil(diff_seconds / 3600.0)
            if horas_retraso < 1:
                horas_retraso = 1
            total_penalty = penalty_base + (horas_retraso * penalty_hourly)
            puntos_delta = -total_penalty
            motivo = f"Devolución tardía ({horas_retraso}h retraso) de '{loan_dict['tool_nombre']}' (-{total_penalty} pts)"

        # Actualizar Puntos del Usuario
        nuevo_saldo = max(0, loan_dict["user_puntos"] + puntos_delta)
        cur.execute("UPDATE users SET puntos = ? WHERE id = ?", (nuevo_saldo, loan_dict["user_id"]))

        # Actualizar Préstamo
        cur.execute("""
            UPDATE loans
            SET fecha_devolucion = ?, estado = ?
            WHERE id = ?
        """, (return_str, estado_final, loan_id))

        # Registrar en Ledger de Transacciones de Puntos
        cur.execute("""
            INSERT INTO point_transactions (user_id, loan_id, cantidad, motivo, saldo_resultante, fecha)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (loan_dict["user_id"], loan_id, puntos_delta, motivo, nuevo_saldo, return_str))
        trans_id = cur.lastrowid

        # Liberar Herramienta
        cur.execute("UPDATE tools SET estado = 'disponible' WHERE id = ?", (loan_dict["tool_id"],))

        conn.commit()

        return {
            "success": True,
            "loan_id": loan_id,
            "user_id": loan_dict["user_id"],
            "user_nombre": loan_dict["user_nombre"],
            "tool_nombre": loan_dict["tool_nombre"],
            "estado": estado_final,
            "puntos_delta": puntos_delta,
            "puntos_anteriores": loan_dict["user_puntos"],
            "nuevo_saldo": nuevo_saldo,
            "horas_retraso": horas_retraso,
            "motivo": motivo,
            "fecha_devolucion": return_str,
            "transaction_id": trans_id
        }
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()

def adjust_user_points(user_id, delta, motivo):
    """Permite a un Administrador ajustar manualmente los puntos de un usuario con justificación."""
    conn = get_connection()
    try:
        conn.execute("BEGIN IMMEDIATE;")
        cur = conn.cursor()

        cur.execute("SELECT id, nombre, puntos FROM users WHERE id = ?", (user_id,))
        user = cur.fetchone()
        if not user:
            raise ValueError("Usuario no encontrado.")

        actual = user["puntos"]
        nuevo_saldo = max(0, actual + delta)

        cur.execute("UPDATE users SET puntos = ? WHERE id = ?", (nuevo_saldo, user_id))

        ahora_str = format_datetime(datetime.now())
        cur.execute("""
            INSERT INTO point_transactions (user_id, loan_id, cantidad, motivo, saldo_resultante, fecha)
            VALUES (?, NULL, ?, ?, ?, ?)
        """, (user_id, delta, f"[Ajuste Admin] {motivo}", nuevo_saldo, ahora_str))

        conn.commit()
        return {
            "user_id": user_id,
            "puntos_anteriores": actual,
            "nuevo_saldo": nuevo_saldo,
            "delta": delta,
            "motivo": motivo
        }
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()

def get_leaderboard():
    """Calcula y retorna la tabla de clasificación de operarios con métricas de puntualidad y nivel."""
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute("""
            SELECT 
                u.id, u.nombre, u.email, u.tag_uid, u.puntos, u.estado, u.rol,
                COUNT(l.id) as total_prestamos,
                SUM(CASE WHEN l.estado = 'devuelto_a_tiempo' THEN 1 ELSE 0 END) as entregas_a_tiempo,
                SUM(CASE WHEN l.estado = 'devuelto_tarde' THEN 1 ELSE 0 END) as entregas_tarde,
                SUM(CASE WHEN l.estado = 'activo' THEN 1 ELSE 0 END) as prestamos_activos
            FROM users u
            LEFT JOIN loans l ON u.id = l.user_id
            WHERE u.rol = 'user'
            GROUP BY u.id
            ORDER BY u.puntos DESC, entregas_a_tiempo DESC, u.nombre ASC
        """)
        rows = [dict(r) for r in cur.fetchall()]

        ranked = []
        for index, r in enumerate(rows, 1):
            total_devueltos = (r["entregas_a_tiempo"] or 0) + (r["entregas_tarde"] or 0)
            if total_devueltos > 0:
                tasa_puntualidad = round(((r["entregas_a_tiempo"] or 0) / total_devueltos) * 100, 1)
            else:
                tasa_puntualidad = 100.0

            # Asignación de Nivel Gamificado
            pts = r["puntos"]
            if pts >= 130:
                nivel = {"nombre": "Diamante", "color": "text-cyan-400", "badge": "💎", "bg": "bg-cyan-500/10 border-cyan-500/30"}
            elif pts >= 110:
                nivel = {"nombre": "Oro", "color": "text-amber-400", "badge": "🥇", "bg": "bg-amber-500/10 border-amber-500/30"}
            elif pts >= 90:
                nivel = {"nombre": "Plata", "color": "text-slate-300", "badge": "🥈", "bg": "bg-slate-400/10 border-slate-400/30"}
            elif pts >= 50:
                nivel = {"nombre": "Bronce", "color": "text-orange-400", "badge": "🥉", "bg": "bg-orange-500/10 border-orange-500/30"}
            else:
                nivel = {"nombre": "En Riesgo", "color": "text-rose-400", "badge": "⚠️", "bg": "bg-rose-500/10 border-rose-500/30"}

            ranked.append({
                **r,
                "ranking": index,
                "tasa_puntualidad": tasa_puntualidad,
                "nivel": nivel
            })

        return ranked
    finally:
        conn.close()
