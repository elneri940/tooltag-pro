import json
import asyncio
from pathlib import Path
from datetime import datetime

from starlette.applications import Starlette
from starlette.responses import JSONResponse, HTMLResponse, FileResponse
from starlette.routing import Route, Mount
from starlette.staticfiles import StaticFiles
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from sse_starlette.sse import EventSourceResponse

from .database import query_db, execute_db, get_connection, DB_PATH, init_db
from .gamification import (
    get_settings, update_setting, calculate_deadline,
    process_loan_checkout, process_loan_checkin, adjust_user_points,
    get_leaderboard, parse_iso_datetime, format_datetime,
    verify_pin, set_user_pin, update_user_profile, hash_pin
)
from .seed import seed_database

# Inicializar base de datos (PostgreSQL en Supabase o SQLite local)
try:
    if os.environ.get("DATABASE_URL") or not DB_PATH.exists():
        init_db()
        users_count = query_db("SELECT count(*) as c FROM users", one=True)
        if not users_count or users_count.get("c", 0) == 0:
            seed_database(force=True)
except Exception as e:
    print(f"Error inicializando DB: {e}")

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"

# Cola para Server-Sent Events (SSE) para actualizaciones en tiempo real
sse_subscribers = set()

async def broadcast_event(event_type: str, data: dict):
    """Transmite eventos en tiempo real a todos los clientes conectados por SSE."""
    payload = json.dumps({"type": event_type, "data": data, "timestamp": datetime.now().isoformat()})
    for queue in list(sse_subscribers):
        try:
            await queue.put(payload)
        except Exception:
            sse_subscribers.discard(queue)

# ==========================================
# RUTAS DE API
# ==========================================

async def api_health(request):
    return JSONResponse({"status": "ok", "app": "RFID Tool Manager", "version": "1.0.0"})

async def api_stats(request):
    """Estadísticas globales de supervisión para el Dashboard."""
    total_tools = query_db("SELECT COUNT(*) as count FROM tools", one=True)["count"]
    available_tools = query_db("SELECT COUNT(*) as count FROM tools WHERE estado = 'disponible'", one=True)["count"]
    loaned_tools = query_db("SELECT COUNT(*) as count FROM tools WHERE estado = 'prestada'", one=True)["count"]
    maint_tools = query_db("SELECT COUNT(*) as count FROM tools WHERE estado = 'mantenimiento'", one=True)["count"]

    active_loans = query_db("SELECT COUNT(*) as count FROM loans WHERE estado = 'activo'", one=True)["count"]
    
    # Préstamos vencidos (activos y fecha_limite < ahora)
    ahora_str = format_datetime(datetime.now())
    overdue_loans = query_db("""
        SELECT COUNT(*) as count FROM loans 
        WHERE estado = 'activo' AND fecha_limite < ?
    """, (ahora_str,), one=True)["count"]

    total_users = query_db("SELECT COUNT(*) as count FROM users WHERE rol = 'user'", one=True)["count"]
    avg_points = query_db("SELECT COALESCE(AVG(puntos), 100) as avg FROM users WHERE rol = 'user'", one=True)["avg"]
    pending_requests = query_db("SELECT COUNT(*) as count FROM loan_requests WHERE estado = 'pendiente'", one=True)["count"]

    return JSONResponse({
        "tools": {
            "total": total_tools,
            "disponibles": available_tools,
            "prestadas": loaned_tools,
            "mantenimiento": maint_tools
        },
        "loans": {
            "activos": active_loans,
            "vencidos": overdue_loans
        },
        "users": {
            "total": total_users,
            "promedio_puntos": round(avg_points, 1)
        },
        "requests": {
            "pendientes": pending_requests
        }
    })

# --- USUARIOS ---
async def api_get_users(request):
    users = query_db("""
        SELECT u.*,
               COUNT(CASE WHEN l.estado = 'activo' THEN 1 END) as prestamos_activos,
               COUNT(CASE WHEN l.estado = 'activo' AND l.fecha_limite < datetime('now', 'localtime') THEN 1 END) as prestamos_vencidos
        FROM users u
        LEFT JOIN loans l ON u.id = l.user_id
        GROUP BY u.id
        ORDER BY u.rol ASC, u.nombre ASC
    """)
    # Agregar has_pin y filtrar pin_hash
    safe_users = []
    for u in users:
        u_copy = {k: v for k, v in u.items() if k != "pin_hash"}
        u_copy["has_pin"] = bool(u.get("pin_hash"))
        safe_users.append(u_copy)
    return JSONResponse(safe_users)

async def api_get_user(request):
    user_id = request.path_params["id"]
    user = query_db("SELECT * FROM users WHERE id = ?", (user_id,), one=True)
    if not user:
        return JSONResponse({"error": "Usuario no encontrado"}, status_code=404)
    
    # Préstamos activos
    active_loans = query_db("""
        SELECT l.*, t.nombre as tool_nombre, t.codigo_inventario, t.categoria, t.tag_uid as tool_tag, t.imagen_url
        FROM loans l
        JOIN tools t ON l.tool_id = t.id
        WHERE l.user_id = ? AND l.estado = 'activo'
        ORDER BY l.fecha_limite ASC
    """, (user_id,))

    # Historial de Ledger reciente
    ledger = query_db("""
        SELECT * FROM point_transactions
        WHERE user_id = ?
        ORDER BY fecha DESC LIMIT 20
    """, (user_id,))

    return JSONResponse({
        "user": user,
        "active_loans": active_loans,
        "ledger": ledger
    })

async def api_get_user_by_tag(request):
    tag_uid = request.path_params["tag_uid"].strip()
    user = query_db("SELECT * FROM users WHERE UPPER(tag_uid) = UPPER(?)", (tag_uid,), one=True)
    if not user:
        return JSONResponse({"error": "No se encontró ningún usuario con este Tag RFID"}, status_code=404)
    
    # Obtenemos sus préstamos activos para el Kiosco
    loans = query_db("""
        SELECT l.*, t.nombre as tool_nombre, t.codigo_inventario, t.tag_uid as tool_tag, t.categoria, t.imagen_url,
               CASE WHEN l.fecha_limite < datetime('now', 'localtime') THEN 1 ELSE 0 END as vencido
        FROM loans l
        JOIN tools t ON l.tool_id = t.id
        WHERE l.user_id = ? AND l.estado = 'activo'
        ORDER BY l.fecha_limite ASC
    """, (user["id"],))

    settings = get_settings()
    min_threshold = int(settings.get("min_points_threshold", 20))
    bloqueado_por_puntos = user["puntos"] < min_threshold

    return JSONResponse({
        "user": user,
        "active_loans": loans,
        "bloqueado_por_puntos": bloqueado_por_puntos,
        "umbral_minimo": min_threshold
    })

async def api_create_user(request):
    data = await request.json()
    nombre = data.get("nombre", "").strip()
    email = data.get("email", "").strip()
    rol = data.get("rol", "user")
    tag_uid = data.get("tag_uid", "").strip() or None
    puntos = int(data.get("puntos", 100))
    estado = data.get("estado", "activo")
    pin = data.get("pin", "").strip()
    pin_h = hash_pin(pin) if pin else None

    if not nombre or not email:
        return JSONResponse({"error": "Nombre y correo son requeridos"}, status_code=400)

    try:
        user_id, _ = execute_db("""
            INSERT INTO users (nombre, email, rol, tag_uid, puntos, estado, pin_hash)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (nombre, email, rol, tag_uid, puntos, estado, pin_h))

        # Registrar saldo inicial en Ledger
        execute_db("""
            INSERT INTO point_transactions (user_id, cantidad, motivo, saldo_resultante)
            VALUES (?, ?, 'Saldo inicial asignado en registro', ?)
        """, (user_id, puntos, puntos))

        await broadcast_event("user_created", {"id": user_id, "nombre": nombre})
        return JSONResponse({"success": True, "id": user_id})
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=400)

async def api_update_user(request):
    user_id = request.path_params["id"]
    data = await request.json()
    nombre = data.get("nombre", "").strip()
    email = data.get("email", "").strip()
    rol = data.get("rol", "user")
    tag_uid = data.get("tag_uid", "").strip() or None
    estado = data.get("estado", "activo")

    try:
        execute_db("""
            UPDATE users
            SET nombre = ?, email = ?, rol = ?, tag_uid = ?, estado = ?
            WHERE id = ?
        """, (nombre, email, rol, tag_uid, estado, user_id))

        if "pin" in data:
            pin_val = data.get("pin", "").strip()
            pin_h = hash_pin(pin_val) if pin_val else None
            execute_db("UPDATE users SET pin_hash = ? WHERE id = ?", (pin_h, user_id))

        await broadcast_event("user_updated", {"id": user_id, "nombre": nombre})
        return JSONResponse({"success": True})
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=400)

async def api_delete_user(request):
    user_id = request.path_params["id"]
    try:
        execute_db("DELETE FROM users WHERE id = ?", (user_id,))
        await broadcast_event("user_deleted", {"id": user_id})
        return JSONResponse({"success": True})
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=400)

# --- HERRAMIENTAS (TOOLS) ---
async def api_get_tools(request):
    categoria = request.query_params.get("categoria")
    estado = request.query_params.get("estado")
    search = request.query_params.get("search")

    query = """
        SELECT t.*, 
               u.nombre as prestada_a_nombre,
               l.fecha_limite as prestada_hasta,
               l.id as active_loan_id
        FROM tools t
        LEFT JOIN loans l ON t.id = l.tool_id AND l.estado = 'activo'
        LEFT JOIN users u ON l.user_id = u.id
        WHERE 1=1
    """
    params = []

    if categoria:
        query += " AND t.categoria = ?"
        params.append(categoria)
    if estado:
        query += " AND t.estado = ?"
        params.append(estado)
    if search:
        query += " AND (t.nombre LIKE ? OR t.codigo_inventario LIKE ? OR t.tag_uid LIKE ?)"
        s = f"%{search}%"
        params.extend([s, s, s])

    query += " ORDER BY t.categoria ASC, t.nombre ASC"
    tools = query_db(query, tuple(params))
    return JSONResponse(tools)

async def api_get_tool_by_tag(request):
    tag_uid = request.path_params["tag_uid"].strip()
    tool = query_db("""
        SELECT t.*, 
               u.id as prestada_a_id,
               u.nombre as prestada_a_nombre,
               l.id as active_loan_id,
               l.fecha_limite as prestada_hasta
        FROM tools t
        LEFT JOIN loans l ON t.id = l.tool_id AND l.estado = 'activo'
        LEFT JOIN users u ON l.user_id = u.id
        WHERE UPPER(t.tag_uid) = UPPER(?)
    """, (tag_uid,), one=True)
    if not tool:
        return JSONResponse({"error": "No se encontró ninguna herramienta vinculada a este Tag RFID"}, status_code=404)
    return JSONResponse(tool)

async def api_create_tool(request):
    data = await request.json()
    nombre = data.get("nombre", "").strip()
    codigo = data.get("codigo_inventario", "").strip()
    tag_uid = data.get("tag_uid", "").strip() or None
    categoria = data.get("categoria", "General")
    tiempo_horas = int(data.get("tiempo_prestamo_horas", 8))
    ubicacion = data.get("ubicacion", "Taller Central")
    img = data.get("imagen_url", "").strip() or None
    desc = data.get("descripcion", "").strip() or None

    if not nombre or not codigo:
        return JSONResponse({"error": "Nombre y Código de Inventario son obligatorios"}, status_code=400)

    try:
        tool_id, _ = execute_db("""
            INSERT INTO tools (nombre, codigo_inventario, tag_uid, categoria, tiempo_prestamo_horas, ubicacion, imagen_url, descripcion, estado)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'disponible')
        """, (nombre, codigo, tag_uid, categoria, tiempo_horas, ubicacion, img, desc))

        await broadcast_event("tool_created", {"id": tool_id, "nombre": nombre})
        return JSONResponse({"success": True, "id": tool_id})
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=400)

async def api_update_tool(request):
    tool_id = request.path_params["id"]
    data = await request.json()
    nombre = data.get("nombre", "").strip()
    codigo = data.get("codigo_inventario", "").strip()
    tag_uid = data.get("tag_uid", "").strip() or None
    categoria = data.get("categoria", "General")
    estado = data.get("estado", "disponible")
    tiempo_horas = int(data.get("tiempo_prestamo_horas", 8))
    ubicacion = data.get("ubicacion", "Taller Central")
    img = data.get("imagen_url", "").strip() or None
    desc = data.get("descripcion", "").strip() or None

    try:
        execute_db("""
            UPDATE tools
            SET nombre = ?, codigo_inventario = ?, tag_uid = ?, categoria = ?, estado = ?,
                tiempo_prestamo_horas = ?, ubicacion = ?, imagen_url = ?, descripcion = ?
            WHERE id = ?
        """, (nombre, codigo, tag_uid, categoria, estado, tiempo_horas, ubicacion, img, desc, tool_id))

        await broadcast_event("tool_updated", {"id": tool_id, "nombre": nombre})
        return JSONResponse({"success": True})
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=400)

async def api_delete_tool(request):
    tool_id = request.path_params["id"]
    try:
        execute_db("DELETE FROM tools WHERE id = ?", (tool_id,))
        await broadcast_event("tool_deleted", {"id": tool_id})
        return JSONResponse({"success": True})
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=400)

# --- PRÉSTAMOS (LOANS) Y GAMIFICACIÓN ---
async def api_get_loans(request):
    filter_type = request.query_params.get("filter", "all")
    user_id = request.query_params.get("user_id")

    query = """
        SELECT l.*, 
               u.nombre as user_nombre, u.email as user_email, u.tag_uid as user_tag, u.puntos as user_puntos,
               t.nombre as tool_nombre, t.codigo_inventario, t.categoria, t.tag_uid as tool_tag, t.imagen_url,
               CASE WHEN l.estado = 'activo' AND l.fecha_limite < datetime('now', 'localtime') THEN 1 ELSE 0 END as vencido
        FROM loans l
        JOIN users u ON l.user_id = u.id
        JOIN tools t ON l.tool_id = t.id
        WHERE 1=1
    """
    params = []

    if user_id:
        query += " AND l.user_id = ?"
        params.append(user_id)

    if filter_type == "active":
        query += " AND l.estado = 'activo'"
    elif filter_type == "overdue":
        query += " AND l.estado = 'activo' AND l.fecha_limite < datetime('now', 'localtime')"
    elif filter_type == "history":
        query += " AND l.estado IN ('devuelto_a_tiempo', 'devuelto_tarde')"

    query += " ORDER BY l.fecha_prestamo DESC LIMIT 100"
    loans = query_db(query, tuple(params))
    return JSONResponse(loans)

async def api_checkout(request):
    """Procesa el check-out de una herramienta mediante ID o Tag."""
    data = await request.json()
    user_id = data.get("user_id")
    tool_id = data.get("tool_id")
    user_tag = data.get("user_tag")
    tool_tag = data.get("tool_tag")
    custom_hours = data.get("custom_hours")

    # Si se pasan tags en lugar de IDs, resolverlos
    if not user_id and user_tag:
        u = query_db("SELECT id FROM users WHERE UPPER(tag_uid) = UPPER(?)", (user_tag.strip(),), one=True)
        if not u:
            return JSONResponse({"error": f"Tag de usuario no reconocido: {user_tag}"}, status_code=404)
        user_id = u["id"]

    if not tool_id and tool_tag:
        t = query_db("SELECT id FROM tools WHERE UPPER(tag_uid) = UPPER(?)", (tool_tag.strip(),), one=True)
        if not t:
            return JSONResponse({"error": f"Tag de herramienta no reconocido: {tool_tag}"}, status_code=404)
        tool_id = t["id"]

    if not user_id or not tool_id:
        return JSONResponse({"error": "Se requiere identificar tanto al usuario como a la herramienta"}, status_code=400)

    try:
        result = process_loan_checkout(user_id, tool_id, custom_hours)
        await broadcast_event("loan_checkout", result)
        return JSONResponse(result)
    except ValueError as ve:
        return JSONResponse({"error": str(ve)}, status_code=400)
    except Exception as e:
        return JSONResponse({"error": f"Error interno: {str(e)}"}, status_code=500)

async def api_checkin(request):
    """Procesa la devolución y calcula los puntos automáticos de gamificación."""
    data = await request.json()
    loan_id = data.get("loan_id")
    tool_id = data.get("tool_id")
    tool_tag = data.get("tool_tag")
    force_simulated_late_hours = data.get("simulate_late_hours")

    # Si se proporciona tag o tool_id, buscar el préstamo activo
    if not loan_id:
        if tool_tag:
            loan = query_db("""
                SELECT l.id FROM loans l
                JOIN tools t ON l.tool_id = t.id
                WHERE UPPER(t.tag_uid) = UPPER(?) AND l.estado = 'activo'
            """, (tool_tag.strip(),), one=True)
            if not loan:
                return JSONResponse({"error": f"No hay ningún préstamo activo para la herramienta con Tag {tool_tag}"}, status_code=404)
            loan_id = loan["id"]
        elif tool_id:
            loan = query_db("SELECT id FROM loans WHERE tool_id = ? AND estado = 'activo'", (tool_id,), one=True)
            if not loan:
                return JSONResponse({"error": "No hay ningún préstamo activo para esta herramienta"}, status_code=404)
            loan_id = loan["id"]

    if not loan_id:
        return JSONResponse({"error": "Debe especificar el préstamo o la herramienta a devolver"}, status_code=400)

    try:
        return_time = datetime.now()
        if force_simulated_late_hours:
            # Simular que se devolvió con X horas adicionales de retraso para propósitos de prueba
            loan_info = query_db("SELECT fecha_limite FROM loans WHERE id = ?", (loan_id,), one=True)
            if loan_info:
                limite = parse_iso_datetime(loan_info["fecha_limite"])
                from datetime import timedelta
                return_time = limite + timedelta(hours=float(force_simulated_late_hours))

        result = process_loan_checkin(loan_id, return_time)
        await broadcast_event("loan_checkin", result)
        return JSONResponse(result)
    except ValueError as ve:
        return JSONResponse({"error": str(ve)}, status_code=400)
    except Exception as e:
        return JSONResponse({"error": f"Error interno: {str(e)}"}, status_code=500)

# --- PUNTOS Y GAMIFICACIÓN ---
async def api_adjust_points(request):
    data = await request.json()
    user_id = data.get("user_id")
    delta = int(data.get("delta", 0))
    motivo = data.get("motivo", "").strip()

    if not user_id or delta == 0 or not motivo:
        return JSONResponse({"error": "user_id, delta (distinto de 0) y motivo son obligatorios"}, status_code=400)

    try:
        result = adjust_user_points(user_id, delta, motivo)
        await broadcast_event("points_adjusted", result)
        return JSONResponse({"success": True, **result})
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=400)

# --- PERFIL DE USUARIO Y PIN ---
async def api_update_profile(request):
    """Permite a cualquier usuario editar su propio perfil (nombre, email, avatar, tag)."""
    user_id = request.path_params["id"]
    data = await request.json()
    try:
        updated = update_user_profile(user_id, data)
        await broadcast_event("user_updated", {"id": user_id})
        return JSONResponse({"success": True, "user": updated})
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=400)

async def api_set_pin(request):
    """Establece o cambia el PIN de seguridad de un usuario."""
    user_id = request.path_params["id"]
    data = await request.json()
    new_pin = data.get("pin", "").strip()
    current_pin = data.get("current_pin", "").strip()

    # Si el usuario ya tiene PIN, verificar el actual antes de cambiarlo
    user = query_db("SELECT pin_hash FROM users WHERE id = ?", (user_id,), one=True)
    if not user:
        return JSONResponse({"error": "Usuario no encontrado"}, status_code=404)

    if user["pin_hash"] and current_pin:
        if not verify_pin(user_id, current_pin):
            return JSONResponse({"error": "El PIN actual es incorrecto"}, status_code=403)

    if not new_pin:
        # Eliminar PIN
        set_user_pin(user_id, None)
        return JSONResponse({"success": True, "has_pin": False, "message": "PIN eliminado. Los préstamos no requerirán PIN para este usuario."})

    if len(new_pin) < 4:
        return JSONResponse({"error": "El PIN debe tener al menos 4 dígitos"}, status_code=400)

    set_user_pin(user_id, new_pin)
    return JSONResponse({"success": True, "has_pin": True, "message": "PIN actualizado correctamente."})

async def api_verify_pin(request):
    """Verifica el PIN de un usuario antes de autorizar un préstamo."""
    data = await request.json()
    user_id = data.get("user_id")
    pin = data.get("pin", "").strip()

    if not user_id:
        return JSONResponse({"error": "user_id requerido"}, status_code=400)

    # Verificar si el sistema requiere PIN
    settings = get_settings()
    require_pin = settings.get("require_pin_for_loans", "false").lower() == "true"

    # Verificar si este usuario tiene PIN
    user = query_db("SELECT id, nombre, pin_hash FROM users WHERE id = ?", (user_id,), one=True)
    if not user:
        return JSONResponse({"error": "Usuario no encontrado"}, status_code=404)

    has_pin = bool(user["pin_hash"])

    if not require_pin and not has_pin:
        return JSONResponse({"success": True, "verified": True, "message": "PIN no requerido."})

    if has_pin and not pin:
        return JSONResponse({"success": True, "verified": False, "requires_pin": True, "message": "Este usuario tiene PIN configurado. Ingrese el PIN para continuar."})

    if require_pin and not has_pin and not pin:
        return JSONResponse({"success": True, "verified": True, "message": "PIN global requerido pero usuario sin PIN. Se permite el paso."})

    if has_pin:
        is_valid = verify_pin(user_id, pin)
        if is_valid:
            return JSONResponse({"success": True, "verified": True, "message": "PIN correcto."})
        else:
            return JSONResponse({"success": True, "verified": False, "requires_pin": True, "message": "PIN incorrecto. Intente de nuevo."}, status_code=403)

async def api_login(request):
    """
    Permite a un operario o administrador autenticarse con Usuario/Correo y Contraseña/PIN
    para operar en el Kiosco o en el sistema sin necesidad de tag RFID físico.
    """
    data = await request.json()
    identifier = data.get("identifier", "").strip()
    password = data.get("password", "").strip()

    if not identifier:
        return JSONResponse({"error": "Ingresa tu usuario o correo"}, status_code=400)

    # Buscar usuario por email, nombre o tag
    user = query_db("""
        SELECT * FROM users 
        WHERE LOWER(email) = LOWER(?) 
           OR LOWER(nombre) = LOWER(?)
           OR LOWER(tag_uid) = LOWER(?)
           OR LOWER(SUBSTR(email, 1, INSTR(email, '@') - 1)) = LOWER(?)
    """, (identifier, identifier, identifier, identifier), one=True)

    if not user:
        user = query_db("SELECT * FROM users WHERE LOWER(nombre) LIKE LOWER(?)", (f"%{identifier}%",), one=True)

    if not user:
        return JSONResponse({"error": "No se encontró ningún usuario con esas credenciales"}, status_code=404)

    # Verificar contraseña / PIN si está configurado
    if user["pin_hash"]:
        if not password:
            return JSONResponse({"error": "Contraseña o PIN requerido para esta cuenta"}, status_code=401)
        if not verify_pin(user["id"], password):
            return JSONResponse({"error": "Contraseña o PIN incorrecto"}, status_code=401)

    # Préstamos activos
    loans = query_db("""
        SELECT l.*, t.nombre as tool_nombre, t.codigo_inventario, t.categoria, t.imagen_url,
               CASE WHEN l.fecha_limite < datetime('now', 'localtime') THEN 1 ELSE 0 END as vencido
        FROM loans l
        JOIN tools t ON l.tool_id = t.id
        WHERE l.user_id = ? AND l.estado = 'activo'
        ORDER BY l.fecha_limite ASC
    """, (user["id"],))

    settings = get_settings()
    min_threshold = int(settings.get("min_points_threshold", 20))
    bloqueado = user["puntos"] < min_threshold or user["estado"] == "bloqueado"
    user_safe = {k: v for k, v in user.items() if k != "pin_hash"}

    return JSONResponse({
        "success": True,
        "user": user_safe,
        "active_loans": loans,
        "bloqueado_por_puntos": bloqueado,
        "umbral_minimo": min_threshold,
        "authenticated_via_password": True
    })

async def api_register(request):
    """
    Registro de nuevas cuentas de Usuario u Operario, y Administrador.
    Requiere: nombres, apellido_paterno, apellido_materno, email, password, rol.
    Si rol == 'admin', requiere obligatoriamente master_admin_password
    (la contraseña del primer administrador registrado).
    """
    import random
    data = await request.json()
    nombres = data.get("nombres", "").strip()
    apellido_paterno = data.get("apellido_paterno", "").strip()
    apellido_materno = data.get("apellido_materno", "").strip()
    email = data.get("email", "").strip().lower()
    password = data.get("password", "").strip()
    rol = data.get("rol", "user").strip().lower()

    if not nombres or not apellido_paterno or not email or not password:
        return JSONResponse({"error": "Nombres, Apellido Paterno, Correo y Contraseña son obligatorios"}, status_code=400)

    if len(password) < 4:
        return JSONResponse({"error": "La contraseña debe tener al menos 4 caracteres o dígitos"}, status_code=400)

    if rol not in ("admin", "user"):
        rol = "user"

    # Si es Administrador: verificar autorización del primer admin
    if rol == "admin":
        master_password = data.get("master_admin_password", "").strip()
        if not master_password:
            return JSONResponse({"error": "Para crear una cuenta de Administrador debes ingresar la contraseña del primer Administrador para autorizar el registro."}, status_code=403)
        
        first_admin = query_db("SELECT id, nombre, pin_hash FROM users WHERE rol = 'admin' ORDER BY id ASC LIMIT 1", one=True)
        if not first_admin:
            return JSONResponse({"error": "No hay ningún administrador maestro registrado en el sistema."}, status_code=500)

        if not verify_pin(first_admin["id"], master_password):
            return JSONResponse({"error": "Contraseña de autorización del primer Administrador incorrecta. Registro de admin denegado."}, status_code=403)

    # Verificar si el correo ya existe
    existing = query_db("SELECT id FROM users WHERE LOWER(email) = LOWER(?)", (email,), one=True)
    if existing:
        return JSONResponse({"error": f"Ya existe una cuenta registrada con el correo {email}"}, status_code=400)

    nombre_completo = f"{nombres} {apellido_paterno} {apellido_materno}".strip()
    initial_puntos = 250 if rol == "admin" else 100
    
    # Generar Tag UID único aleatorio
    prefix = "AD" if rol == "admin" else "USR"
    tag_uid = f"{prefix}-{random.randint(1000, 9999)}-{chr(random.randint(65, 90))}"

    try:
        user_id, _ = execute_db("""
            INSERT INTO users (nombre, nombres, apellido_paterno, apellido_materno, email, rol, tag_uid, puntos, estado, pin_hash)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'activo', ?)
        """, (nombre_completo, nombres, apellido_paterno, apellido_materno, email, rol, tag_uid, initial_puntos, hash_pin(password)))

        # Registrar saldo inicial en Ledger
        execute_db("""
            INSERT INTO point_transactions (user_id, cantidad, motivo, saldo_resultante)
            VALUES (?, ?, 'Saldo inicial asignado en registro de cuenta', ?)
        """, (user_id, initial_puntos, initial_puntos))

        await broadcast_event("user_created", {"id": user_id, "nombre": nombre_completo, "rol": rol})

        user_safe = {
            "id": user_id,
            "nombre": nombre_completo,
            "nombres": nombres,
            "apellido_paterno": apellido_paterno,
            "apellido_materno": apellido_materno,
            "email": email,
            "rol": rol,
            "tag_uid": tag_uid,
            "puntos": initial_puntos,
            "estado": "activo"
        }

        return JSONResponse({
            "success": True,
            "user": user_safe,
            "message": f"Cuenta de {rol.capitalize()} creada exitosamente."
        })
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=400)

# --- SOLICITUDES DE PRÉSTAMO (WORKFLOW) ---
async def api_get_requests(request):
    estado = request.query_params.get("estado")
    user_id = request.query_params.get("user_id")

    query = """
        SELECT r.*,
               u.nombre as user_nombre, u.email as user_email, u.puntos as user_puntos, u.estado as user_estado, u.avatar_url as user_avatar,
               t.nombre as tool_nombre, t.codigo_inventario, t.categoria, t.imagen_url as tool_imagen, t.estado as tool_estado, t.tiempo_prestamo_horas
        FROM loan_requests r
        JOIN users u ON r.user_id = u.id
        JOIN tools t ON r.tool_id = t.id
        WHERE 1=1
    """
    params = []
    if estado:
        query += " AND r.estado = ?"
        params.append(estado)
    if user_id:
        query += " AND r.user_id = ?"
        params.append(user_id)

    query += " ORDER BY r.fecha_solicitud DESC LIMIT 100"
    requests_list = query_db(query, tuple(params))
    return JSONResponse(requests_list)

async def api_create_request(request):
    data = await request.json()
    user_id = data.get("user_id")
    tool_id = data.get("tool_id")
    tiempo_horas = int(data.get("tiempo_horas", 8))
    motivo = data.get("motivo", "").strip() or "Préstamo operativo de rutina"

    if not user_id or not tool_id:
        return JSONResponse({"error": "Usuario y herramienta son requeridos"}, status_code=400)

    settings = get_settings()
    min_threshold = int(settings.get("min_points_threshold", 20))
    user = query_db("SELECT id, nombre, puntos, estado FROM users WHERE id = ?", (user_id,), one=True)
    if not user:
        return JSONResponse({"error": "Usuario no encontrado"}, status_code=404)
    if user["estado"] == "bloqueado":
        return JSONResponse({"error": "Tu cuenta se encuentra bloqueada administrativamente"}, status_code=403)
    if user["puntos"] < min_threshold:
        return JSONResponse({"error": f"Puntos insuficientes ({user['puntos']} pts). El umbral mínimo requerido es de {min_threshold} puntos."}, status_code=403)

    tool = query_db("SELECT id, nombre, estado, tiempo_prestamo_horas FROM tools WHERE id = ?", (tool_id,), one=True)
    if not tool:
        return JSONResponse({"error": "Herramienta no encontrada"}, status_code=404)
    if tool["estado"] != "disponible":
        return JSONResponse({"error": f"La herramienta '{tool['nombre']}' no está disponible (Estado: {tool['estado']})"}, status_code=400)

    existing = query_db("SELECT id FROM loan_requests WHERE user_id = ? AND tool_id = ? AND estado = 'pendiente'", (user_id, tool_id), one=True)
    if existing:
        return JSONResponse({"error": "Ya tienes una solicitud pendiente para esta herramienta. Espera la aprobación del administrador."}, status_code=400)

    req_id, _ = execute_db("""
        INSERT INTO loan_requests (user_id, tool_id, tiempo_horas, motivo, estado)
        VALUES (?, ?, ?, ?, 'pendiente')
    """, (user_id, tool_id, tiempo_horas, motivo))

    await broadcast_event("request_created", {"id": req_id, "user": user["nombre"], "tool": tool["nombre"]})
    return JSONResponse({"success": True, "id": req_id, "message": "Solicitud enviada al Administrador con éxito."})

async def api_approve_request(request):
    req_id = request.path_params["id"]
    req = query_db("SELECT * FROM loan_requests WHERE id = ?", (req_id,), one=True)
    if not req:
        return JSONResponse({"error": "Solicitud no encontrada"}, status_code=404)
    if req["estado"] != "pendiente":
        return JSONResponse({"error": f"Esta solicitud ya fue resuelta previamente ({req['estado']})"}, status_code=400)

    try:
        checkout_res = process_loan_checkout(req["user_id"], req["tool_id"], custom_hours=req["tiempo_horas"])
        ahora_str = format_datetime(datetime.now())

        execute_db("""
            UPDATE loan_requests
            SET estado = 'aprobada', loan_id = ?, fecha_resolucion = ?
            WHERE id = ?
        """, (checkout_res["loan_id"], ahora_str, req_id))

        await broadcast_event("request_approved", {"id": req_id, "loan_id": checkout_res["loan_id"]})
        return JSONResponse({"success": True, "checkout": checkout_res, "message": "Solicitud aprobada y préstamo registrado."})
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=400)

async def api_reject_request(request):
    req_id = request.path_params["id"]
    data = await request.json()
    motivo_rechazo = data.get("motivo", "").strip() or "Rechazada por el Administrador"

    req = query_db("SELECT * FROM loan_requests WHERE id = ?", (req_id,), one=True)
    if not req:
        return JSONResponse({"error": "Solicitud no encontrada"}, status_code=404)
    if req["estado"] != "pendiente":
        return JSONResponse({"error": f"Esta solicitud ya fue resuelta previamente ({req['estado']})"}, status_code=400)

    ahora_str = format_datetime(datetime.now())
    execute_db("""
        UPDATE loan_requests
        SET estado = 'rechazada', respuesta_admin = ?, fecha_resolucion = ?
        WHERE id = ?
    """, (motivo_rechazo, ahora_str, req_id))

    await broadcast_event("request_rejected", {"id": req_id, "motivo": motivo_rechazo})
    return JSONResponse({"success": True, "message": "Solicitud rechazada."})

async def api_get_leaderboard(request):
    ranking = get_leaderboard()
    return JSONResponse(ranking)

async def api_get_transactions(request):
    user_id = request.query_params.get("user_id")
    query = """
        SELECT pt.*, u.nombre as user_nombre, u.email as user_email, u.tag_uid as user_tag
        FROM point_transactions pt
        JOIN users u ON pt.user_id = u.id
        WHERE 1=1
    """
    params = []
    if user_id:
        query += " AND pt.user_id = ?"
        params.append(user_id)
    
    query += " ORDER BY pt.fecha DESC LIMIT 100"
    txs = query_db(query, tuple(params))
    return JSONResponse(txs)

# --- AJUSTES Y CONFIGURACIÓN ---
async def api_get_settings(request):
    return JSONResponse(get_settings())

async def api_update_settings(request):
    data = await request.json()
    for k, v in data.items():
        update_setting(k, v)
    await broadcast_event("settings_updated", data)
    return JSONResponse({"success": True, "settings": get_settings()})

async def api_reset_seed(request):
    """Permite reiniciar los datos de prueba a su estado original."""
    seed_database(force=True)
    await broadcast_event("database_reset", {})
    return JSONResponse({"success": True, "message": "Datos de prueba reiniciados correctamente"})

# --- RFID SCANNER INTELISENSE ---
async def api_rfid_scan(request):
    """
    Endpoint inteligente para lectores RFID / Barcode HID o simulación.
    Identifica si el UID pertenece a un Usuario o a una Herramienta.
    """
    data = await request.json()
    tag_uid = data.get("tag_uid", "").strip()
    if not tag_uid:
        return JSONResponse({"error": "Tag UID vacío"}, status_code=400)

    # 1. Buscar Usuario
    user = query_db("SELECT * FROM users WHERE UPPER(tag_uid) = UPPER(?)", (tag_uid,), one=True)
    if user:
        loans = query_db("""
            SELECT l.*, t.nombre as tool_nombre, t.codigo_inventario, t.categoria, t.imagen_url,
                   CASE WHEN l.fecha_limite < datetime('now', 'localtime') THEN 1 ELSE 0 END as vencido
            FROM loans l
            JOIN tools t ON l.tool_id = t.id
            WHERE l.user_id = ? AND l.estado = 'activo'
        """, (user["id"],))

        settings = get_settings()
        min_threshold = int(settings.get("min_points_threshold", 20))
        bloqueado = user["puntos"] < min_threshold or user["estado"] == "bloqueado"
        require_pin_global = settings.get("require_pin_for_loans", "false").lower() == "true"
        has_pin = bool(user.get("pin_hash"))

        # No enviar pin_hash al frontend
        user_safe = {k: v for k, v in user.items() if k != "pin_hash"}

        return JSONResponse({
            "target": "user",
            "tag_uid": tag_uid,
            "data": user_safe,
            "active_loans": loans,
            "bloqueado": bloqueado,
            "min_threshold": min_threshold,
            "has_pin": has_pin,
            "require_pin": require_pin_global or has_pin
        })

    # 2. Buscar Herramienta
    tool = query_db("""
        SELECT t.*, u.id as user_id, u.nombre as user_nombre, l.id as active_loan_id, l.fecha_limite
        FROM tools t
        LEFT JOIN loans l ON t.id = l.tool_id AND l.estado = 'activo'
        LEFT JOIN users u ON l.user_id = u.id
        WHERE UPPER(t.tag_uid) = UPPER(?)
    """, (tag_uid,), one=True)
    if tool:
        return JSONResponse({
            "target": "tool",
            "tag_uid": tag_uid,
            "data": tool
        })

    # 3. No registrado
    return JSONResponse({
        "target": "unknown",
        "tag_uid": tag_uid,
        "message": f"Tag '{tag_uid}' no asignado a ningún usuario ni herramienta."
    }, status_code=404)

# --- SSE (Server-Sent Events) ---
async def api_sse(request):
    """Canal de suscripción en tiempo real."""
    queue = asyncio.Queue()
    sse_subscribers.add(queue)

    async def event_generator():
        try:
            # Mensaje inicial de bienvenida
            yield {"event": "connected", "data": json.dumps({"connected": True})}
            while True:
                msg = await queue.get()
                yield {"event": "message", "data": msg}
        except asyncio.CancelledError:
            sse_subscribers.discard(queue)
        finally:
            sse_subscribers.discard(queue)

    return EventSourceResponse(event_generator())

# --- SERVIR FRONTEND ---
async def serve_index(request):
    index_file = FRONTEND_DIR / "index.html"
    return FileResponse(index_file)

# ==========================================
# DEFINICIÓN DE APLICACIÓN STARLETTE
# ==========================================

routes = [
    Route("/", serve_index),
    Route("/api/health", api_health, methods=["GET"]),
    Route("/api/stats", api_stats, methods=["GET"]),
    Route("/api/users", api_get_users, methods=["GET"]),
    Route("/api/users", api_create_user, methods=["POST"]),
    Route("/api/users/{id:int}", api_get_user, methods=["GET"]),
    Route("/api/users/{id:int}", api_update_user, methods=["PUT"]),
    Route("/api/users/{id:int}", api_delete_user, methods=["DELETE"]),
    Route("/api/users/by-tag/{tag_uid:str}", api_get_user_by_tag, methods=["GET"]),
    Route("/api/tools", api_get_tools, methods=["GET"]),
    Route("/api/tools", api_create_tool, methods=["POST"]),
    Route("/api/tools/{id:int}", api_update_tool, methods=["PUT"]),
    Route("/api/tools/{id:int}", api_delete_tool, methods=["DELETE"]),
    Route("/api/tools/by-tag/{tag_uid:str}", api_get_tool_by_tag, methods=["GET"]),
    Route("/api/loans", api_get_loans, methods=["GET"]),
    Route("/api/loans/checkout", api_checkout, methods=["POST"]),
    Route("/api/loans/checkin", api_checkin, methods=["POST"]),
    Route("/api/points/adjust", api_adjust_points, methods=["POST"]),
    Route("/api/users/{id:int}/profile", api_update_profile, methods=["PUT"]),
    Route("/api/users/{id:int}/pin", api_set_pin, methods=["PUT"]),
    Route("/api/verify-pin", api_verify_pin, methods=["POST"]),
    Route("/api/auth/login", api_login, methods=["POST"]),
    Route("/api/auth/register", api_register, methods=["POST"]),
    Route("/api/requests", api_get_requests, methods=["GET"]),
    Route("/api/requests", api_create_request, methods=["POST"]),
    Route("/api/requests/{id:int}/approve", api_approve_request, methods=["POST"]),
    Route("/api/requests/{id:int}/reject", api_reject_request, methods=["POST"]),
    Route("/api/leaderboard", api_get_leaderboard, methods=["GET"]),
    Route("/api/transactions", api_get_transactions, methods=["GET"]),
    Route("/api/settings", api_get_settings, methods=["GET"]),
    Route("/api/settings", api_update_settings, methods=["PUT"]),
    Route("/api/seed/reset", api_reset_seed, methods=["POST"]),
    Route("/api/rfid/scan", api_rfid_scan, methods=["POST"]),
    Route("/api/events", api_sse, methods=["GET"]),
    Mount("/static", StaticFiles(directory=str(FRONTEND_DIR)), name="static"),
]

middleware = [
    Middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
        allow_credentials=True
    )
]

app = Starlette(debug=True, routes=routes, middleware=middleware)
