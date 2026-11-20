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
    "require_pin_for_loans": "false",
    # Días que se presta una herramienta (el admin lo cambia; cada persona puede tener el suyo)
    "loan_days_default": "1",
    # Máximo de herramientas por pedido
    "max_tools_per_request": "2",
    # Puntos que se restan según el estado en que regresa la herramienta
    "damage_penalty_minor": "10",
    "damage_penalty_major": "30"
}

# Estados válidos al devolver una herramienta
CONDICIONES = ("bien", "con_detalles", "danada")

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

def _checkout_one(cur, user_dict, tool_id, tiempo_horas):
    """Registra la salida de UNA herramienta dentro de una transacción ya abierta."""
    cur.execute("SELECT id, nombre, estado, tiempo_prestamo_horas FROM tools WHERE id = ?", (tool_id,))
    tool = cur.fetchone()
    if not tool:
        raise ValueError(f"Herramienta con ID {tool_id} no encontrada.")

    tool_dict = dict(tool)
    if tool_dict["estado"] != "disponible":
        raise ValueError(f"La herramienta '{tool_dict['nombre']}' no está disponible (Estado actual: {tool_dict['estado']}).")

    ahora = datetime.now()
    ahora_str = format_datetime(ahora)
    limite_str = format_datetime(ahora + timedelta(hours=int(tiempo_horas)))

    cur.execute("""
        INSERT INTO loans (user_id, tool_id, fecha_prestamo, fecha_limite, estado)
        VALUES (?, ?, ?, ?, 'activo')
    """, (user_dict["id"], tool_id, ahora_str, limite_str))
    loan_id = cur.lastrowid

    cur.execute("UPDATE tools SET estado = 'prestada' WHERE id = ?", (tool_id,))

    return {
        "success": True,
        "loan_id": loan_id,
        "user": user_dict,
        "tool": tool_dict,
        "fecha_prestamo": ahora_str,
        "fecha_limite": limite_str,
        "tiempo_horas": int(tiempo_horas)
    }

def _validate_user_can_borrow(cur, user_id, settings, nuevas=1):
    """Devuelve el usuario si puede pedir herramientas; si no, lanza ValueError."""
    min_threshold = int(settings.get("min_points_threshold", 20))
    max_tools = int(settings.get("max_tools_per_request", 2))
    cur.execute("SELECT id, nombre, puntos, estado, dias_prestamo FROM users WHERE id = ?", (user_id,))
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
    # El límite cuenta también lo que ya tiene prestado y no ha devuelto
    cur.execute("SELECT COUNT(*) AS n FROM loans WHERE user_id = ? AND estado = 'activo'", (user_id,))
    row = cur.fetchone()
    activos = (row[0] if isinstance(row, (tuple, list)) else row["n"]) or 0
    if activos + nuevas > max_tools:
        raise ValueError(
            f"{user_dict['nombre']} tiene {activos} herramienta(s) sin devolver. "
            f"El máximo permitido a la vez es {max_tools}."
        )
    return user_dict

def resolve_loan_hours(user_dict, settings, custom_hours=None):
    """
    Horas de préstamo. Prioridad:
    1) horas indicadas explícitamente, 2) días propios de la persona, 3) días generales del sistema.
    """
    if custom_hours is not None:
        return int(custom_hours)
    if user_dict.get("dias_prestamo"):
        return int(user_dict["dias_prestamo"]) * 24
    return int(settings.get("loan_days_default", 1)) * 24

def process_loan_checkout(user_id, tool_id, custom_hours=None):
    """
    Registra la salida de una herramienta.
    Verifica que el usuario no esté bloqueado o con puntaje bajo, y que la herramienta esté disponible.
    """
    settings = get_settings()
    conn = get_connection()
    try:
        conn.execute("BEGIN IMMEDIATE;")
        cur = conn.cursor()
        user_dict = _validate_user_can_borrow(cur, user_id, settings)
        horas = resolve_loan_hours(user_dict, settings, custom_hours)
        result = _checkout_one(cur, user_dict, tool_id, horas)
        conn.commit()
        return result
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()

def process_multi_checkout(user_id, tool_ids, custom_hours=None):
    """
    Registra el pedido de varias herramientas a la vez (por defecto máximo 2).
    Es todo o nada: si una no está disponible, no se presta ninguna.
    """
    settings = get_settings()
    max_tools = int(settings.get("max_tools_per_request", 2))

    # Quitar repetidos conservando el orden
    ids = []
    for t in tool_ids or []:
        if t not in ids:
            ids.append(t)
    if not ids:
        raise ValueError("Selecciona al menos una herramienta.")
    if len(ids) > max_tools:
        raise ValueError(f"Solo puedes pedir hasta {max_tools} herramientas por pedido.")

    conn = get_connection()
    try:
        conn.execute("BEGIN IMMEDIATE;")
        cur = conn.cursor()
        user_dict = _validate_user_can_borrow(cur, user_id, settings, nuevas=len(ids))
        horas = resolve_loan_hours(user_dict, settings, custom_hours)
        loans = [_checkout_one(cur, user_dict, tid, horas) for tid in ids]
        conn.commit()
        return {"success": True, "user": user_dict, "loans": loans, "fecha_limite": loans[0]["fecha_limite"]}
    except Exception as e:
        conn.rollback()
        raise e
    finally:
        conn.close()

def process_loan_checkin(loan_id, return_dt=None, condicion="bien", notas=None):
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

        if condicion not in CONDICIONES:
            raise ValueError(f"Estado de la herramienta no válido. Usa: {', '.join(CONDICIONES)}.")
        if condicion == "danada":
            penalty_damage = int(settings.get("damage_penalty_major", 30))
        elif condicion == "con_detalles":
            penalty_damage = int(settings.get("damage_penalty_minor", 10))
        else:
            penalty_damage = 0

        if diff_seconds <= 0:
            # A TIEMPO O ANTICIPADA (el bono solo se da si regresó en buen estado)
            estado_final = "devuelto_a_tiempo"
            bono = bonus_on_time if condicion == "bien" else 0
            puntos_delta = bono
            motivo = (f"Devolución puntual de herramienta '{loan_dict['tool_nombre']}' (+{bono} pts)"
                      if bono else f"Devolución puntual de herramienta '{loan_dict['tool_nombre']}' (sin bono por estado)")
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

        if penalty_damage:
            puntos_delta -= penalty_damage
            etiqueta = "dañada" if condicion == "danada" else "con detalles"
            motivo += f" | Regresó {etiqueta} (-{penalty_damage} pts)"
        if notas:
            motivo += f" | Nota: {notas}"

        # Actualizar Puntos del Usuario
        nuevo_saldo = max(0, loan_dict["user_puntos"] + puntos_delta)
        cur.execute("UPDATE users SET puntos = ? WHERE id = ?", (nuevo_saldo, loan_dict["user_id"]))

        # Actualizar Préstamo
        cur.execute("""
            UPDATE loans
            SET fecha_devolucion = ?, estado = ?, condicion = ?, notas_devolucion = ?
            WHERE id = ?
        """, (return_str, estado_final, condicion, notas or None, loan_id))

        # Registrar en Ledger de Transacciones de Puntos
        cur.execute("""
            INSERT INTO point_transactions (user_id, loan_id, cantidad, motivo, saldo_resultante, fecha)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (loan_dict["user_id"], loan_id, puntos_delta, motivo, nuevo_saldo, return_str))
        trans_id = cur.lastrowid

        # Liberar la herramienta; si regresó dañada pasa a mantenimiento
        nuevo_estado_tool = "mantenimiento" if condicion == "danada" else "disponible"
        cur.execute("UPDATE tools SET estado = ? WHERE id = ?", (nuevo_estado_tool, loan_dict["tool_id"]))

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
            "condicion": condicion,
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
                nivel = {"nombre": "Diamante", "color": "text-blue-700", "badge": "💎", "bg": "bg-blue-50 border-blue-200"}
            elif pts >= 110:
                nivel = {"nombre": "Oro", "color": "text-amber-700", "badge": "🥇", "bg": "bg-amber-50 border-amber-200"}
            elif pts >= 90:
                nivel = {"nombre": "Plata", "color": "text-slate-700", "badge": "🥈", "bg": "bg-slate-100 border-slate-300"}
            elif pts >= 50:
                nivel = {"nombre": "Bronce", "color": "text-amber-700", "badge": "🥉", "bg": "bg-amber-50 border-amber-200"}
            else:
                nivel = {"nombre": "En Riesgo", "color": "text-rose-700", "badge": "⚠️", "bg": "bg-rose-50 border-rose-200"}

            ranked.append({
                **r,
                "ranking": index,
                "tasa_puntualidad": tasa_puntualidad,
                "nivel": nivel
            })

        return ranked
    finally:
        conn.close()
