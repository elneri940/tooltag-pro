import os
import uuid
import random
import json
import asyncio
from pathlib import Path
from datetime import datetime, timedelta

from starlette.applications import Starlette
from starlette.responses import JSONResponse, HTMLResponse, FileResponse
from starlette.routing import Route, Mount
from starlette.staticfiles import StaticFiles
from starlette.middleware import Middleware
from starlette.middleware.cors import CORSMiddleware
from starlette.middleware.gzip import GZipMiddleware
from starlette.concurrency import run_in_threadpool
from sse_starlette.sse import EventSourceResponse

from .database import query_db, execute_db, get_connection, DB_PATH, init_db
from .gamification import (
    get_settings, update_setting, calculate_deadline,
    process_loan_checkout, process_multi_checkout, process_loan_checkin, resolve_loan_hours, adjust_user_points,
    get_leaderboard, parse_iso_datetime, format_datetime,
    verify_pin, set_user_pin, update_user_profile, hash_pin
)
from .seed import ensure_defaults
from .auth import (
    create_access_token, verify_access_token, get_current_user_from_request,
    require_auth, is_rate_limited, record_login_failure, clear_login_failures
)

# Inicializar base de datos (PostgreSQL en Supabase o SQLite local) y asegurar Admin Maestro
try:
    init_db()
    ensure_defaults()
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
    return JSONResponse({"status": "ok", "app": "ToolTag Pro", "version": "2.0.0"})

def get_all_sync_data():
    """Recopila todo el estado del sistema en un único paso de alta velocidad."""
    # 1. Usuarios con conteo de préstamos
    users = query_db("""
        SELECT u.*,
               COUNT(CASE WHEN l.estado = 'activo' THEN 1 END) as prestamos_activos,
               COUNT(CASE WHEN l.estado = 'activo' AND l.fecha_limite < datetime('now', 'localtime') THEN 1 END) as prestamos_vencidos
        FROM users u
        LEFT JOIN loans l ON u.id = l.user_id
        GROUP BY u.id
        ORDER BY u.puntos DESC, u.nombre ASC
    """)
    for u in users:
        u.pop("pin_hash", None)

    # 2. Herramientas con préstamo actual si existe
    tools = query_db("""
        SELECT t.*,
               l.id as current_loan_id,
               l.user_id as current_borrower_id,
               u.nombre as current_borrower_name,
               l.fecha_prestamo as current_loan_start,
               l.fecha_limite as current_loan_due
        FROM tools t
        LEFT JOIN loans l ON t.id = l.tool_id AND l.estado = 'activo'
        LEFT JOIN users u ON l.user_id = u.id
        ORDER BY t.nombre ASC
    """)

    # 3. Préstamos
    loans = query_db("""
        SELECT l.*,
               u.nombre as user_nombre,
               u.email as user_email,
               u.matricula as matricula,
               u.puntos as user_puntos,
               t.nombre as tool_nombre,
               t.codigo_inventario as tool_codigo,
               t.codigo_inventario as codigo_inventario,
               CASE WHEN l.estado = 'activo' AND l.fecha_limite < datetime('now', 'localtime') THEN 1 ELSE 0 END as vencido
        FROM loans l
        JOIN users u ON l.user_id = u.id
        JOIN tools t ON l.tool_id = t.id
        ORDER BY l.fecha_prestamo DESC
    """)

    # 4. Solicitudes
    requests = query_db("""
        SELECT lr.*,
               u.nombre as user_nombre,
               u.email as user_email,
               u.puntos as user_puntos,
               t.nombre as tool_nombre,
               t.codigo_inventario as tool_codigo,
               t.imagen_url as tool_imagen
        FROM loan_requests lr
        JOIN users u ON lr.user_id = u.id
        JOIN tools t ON lr.tool_id = t.id
        ORDER BY lr.fecha_solicitud DESC
    """)

    # 5. Leaderboard
    leaderboard = query_db("""
        SELECT id, nombre, email, puntos, rol, avatar_url,
               (SELECT COUNT(*) FROM loans WHERE user_id = users.id AND estado = 'devuelto_a_tiempo') as entregas_a_tiempo,
               (SELECT COUNT(*) FROM loans WHERE user_id = users.id AND estado = 'devuelto_tarde') as entregas_tarde
        FROM users
        WHERE rol = 'user' AND estado = 'activo'
        ORDER BY puntos DESC
        LIMIT 10
    """)

    # 6. Transacciones
    transactions = query_db("""
        SELECT pt.*, u.nombre as user_nombre, t.nombre as tool_nombre
        FROM point_transactions pt
        JOIN users u ON pt.user_id = u.id
        LEFT JOIN loans l ON pt.loan_id = l.id
        LEFT JOIN tools t ON l.tool_id = t.id
        ORDER BY pt.fecha DESC
        LIMIT 50
    """)

    # 7. Configuración
    settings = get_settings()

    # 8. Estadísticas calculadas instantáneamente en memoria
    ahora_str = format_datetime(datetime.now())
    total_tools = len(tools)
    available_tools = sum(1 for t in tools if t.get('estado') == 'disponible')
    loaned_tools = sum(1 for t in tools if t.get('estado') == 'prestada')
    maint_tools = sum(1 for t in tools if t.get('estado') == 'mantenimiento')
    active_loans = sum(1 for l in loans if l.get('estado') == 'activo')
    overdue_loans = sum(1 for l in loans if l.get('estado') == 'activo' and str(l.get('fecha_limite')) < ahora_str)
    user_list = [u for u in users if u.get('rol') == 'user']
    total_users = len(user_list)
    avg_points = (sum(u.get('puntos', 100) for u in user_list) / total_users) if total_users > 0 else 100
    pending_requests = sum(1 for r in requests if r.get('estado') == 'pendiente')

    stats = {
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
            "promedio_puntos": round(float(avg_points), 1)
        },
        "requests": {
            "pendientes": pending_requests
        }
    }

    return {
        "stats": stats,
        "users": users,
        "tools": tools,
        "loans": loans,
        "leaderboard": leaderboard,
        "settings": settings,
        "transactions": transactions,
        "requests": requests
    }

async def api_sync(request):
    """Sincronización unificada de alta velocidad en 1 solo viaje de red."""
    data = await run_in_threadpool(get_all_sync_data)
    return JSONResponse(data)

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
            "promedio_puntos": round(float(avg_points or 100), 1)
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
    current_admin, err = require_auth(request, ["admin"])
    if err:
        return err
    data = await request.json()
    nombre = data.get("nombre", "").strip()
    email = data.get("email", "").strip().lower()
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
        if data.get("matricula"):
            execute_db("UPDATE users SET matricula = ? WHERE id = ?", (str(data["matricula"]).strip(), user_id))

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
    current_admin, err = require_auth(request, ["admin"])
    if err:
        return err
    user_id = request.path_params["id"]
    data = await request.json()
    nombre = data.get("nombre", "").strip()
    email = data.get("email", "").strip().lower()
    rol = data.get("rol", "user")
    tag_uid = data.get("tag_uid", "").strip() or None
    estado = data.get("estado", "activo")

    try:
        execute_db("""
            UPDATE users
            SET nombre = ?, email = ?, rol = ?, tag_uid = ?, estado = ?
            WHERE id = ?
        """, (nombre, email, rol, tag_uid, estado, user_id))

        if "matricula" in data:
            execute_db("UPDATE users SET matricula = ? WHERE id = ?", ((data.get("matricula") or "").strip() or None, user_id))
        if "dias_prestamo" in data:
            # Días de préstamo propios de esta persona; vacío = usar el general
            dias = data.get("dias_prestamo")
            execute_db("UPDATE users SET dias_prestamo = ? WHERE id = ?", (int(dias) if dias not in (None, "", 0, "0") else None, user_id))

        if "pin" in data:
            pin_val = data.get("pin", "").strip()
            pin_h = hash_pin(pin_val) if pin_val else None
            execute_db("UPDATE users SET pin_hash = ? WHERE id = ?", (pin_h, user_id))

        await broadcast_event("user_updated", {"id": user_id, "nombre": nombre})
        return JSONResponse({"success": True})
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=400)

async def api_delete_user(request):
    current_admin, err = require_auth(request, ["admin"])
    if err:
        return err
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
    current_admin, err = require_auth(request, ["admin", "operator"])
    if err:
        return err
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
    current_admin, err = require_auth(request, ["admin", "operator"])
    if err:
        return err
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
    current_admin, err = require_auth(request, ["admin", "operator"])
    if err:
        return err
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
               u.nombre as user_nombre, u.email as user_email, u.matricula as matricula, u.tag_uid as user_tag, u.puntos as user_puntos,
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

def _history_rows(params):
    """Historial de préstamos (activos y devueltos) con filtros."""
    where, args = ["1=1"], []
    q = (params.get("q") or "").strip().lower()
    if q:
        where.append("(LOWER(u.nombre) LIKE ? OR LOWER(COALESCE(u.matricula,'')) LIKE ? OR LOWER(t.nombre) LIKE ? OR LOWER(t.codigo_inventario) LIKE ?)")
        args += [f"%{q}%"] * 4
    estado = (params.get("estado") or "").strip()
    if estado in ("activo", "devuelto_a_tiempo", "devuelto_tarde"):
        where.append("l.estado = ?"); args.append(estado)
    condicion = (params.get("condicion") or "").strip()
    if condicion in ("bien", "con_detalles", "danada"):
        where.append("l.condicion = ?"); args.append(condicion)
    if params.get("desde"):
        where.append("CAST(l.fecha_prestamo AS TEXT) >= ?"); args.append(params["desde"])
    if params.get("hasta"):
        where.append("CAST(l.fecha_prestamo AS TEXT) <= ?"); args.append(params["hasta"] + " 23:59:59")
    if params.get("user_id"):
        where.append("l.user_id = ?"); args.append(params["user_id"])
    if params.get("tool_id"):
        where.append("l.tool_id = ?"); args.append(params["tool_id"])
    sql = f"""
        SELECT l.id, u.nombre AS alumno, u.matricula, u.email, t.nombre AS herramienta, t.codigo_inventario AS codigo,
               l.fecha_prestamo, l.fecha_limite, l.fecha_devolucion, l.estado, l.condicion, l.notas_devolucion,
               (SELECT SUM(pt.cantidad) FROM point_transactions pt WHERE pt.loan_id = l.id) AS puntos
        FROM loans l
        JOIN users u ON l.user_id = u.id
        JOIN tools t ON l.tool_id = t.id
        WHERE {' AND '.join(where)}
        ORDER BY l.fecha_prestamo DESC
        LIMIT 5000
    """
    return query_db(sql, tuple(args))

async def api_history(request):
    return JSONResponse(_history_rows(dict(request.query_params)))

async def api_history_csv(request):
    """Descarga el historial en CSV (se abre directo en Excel)."""
    current_admin, err = require_auth(request, ["admin", "operator"])
    if err:
        return err
    import csv, io
    from starlette.responses import Response
    rows = _history_rows(dict(request.query_params))
    estado_txt = {"activo": "En préstamo", "devuelto_a_tiempo": "Devuelto a tiempo", "devuelto_tarde": "Devuelto tarde"}
    cond_txt = {"bien": "En buen estado", "con_detalles": "Con detalles", "danada": "Dañada"}
    buf = io.StringIO()
    w = csv.writer(buf)
    w.writerow(["Alumno", "Matrícula", "Correo", "Herramienta", "Código", "Salida", "Fecha límite", "Regreso", "Resultado", "Estado al regresar", "Puntos", "Nota"])
    for r in rows:
        w.writerow([r["alumno"], r["matricula"] or "", r["email"], r["herramienta"], r["codigo"], r["fecha_prestamo"], r["fecha_limite"],
                    r["fecha_devolucion"] or "", estado_txt.get(r["estado"], r["estado"]), cond_txt.get(r["condicion"], ""),
                    r["puntos"] if r["puntos"] is not None else "", r["notas_devolucion"] or ""])
    nombre = "historial_prestamos_" + datetime.now().strftime("%Y%m%d_%H%M") + ".csv"
    return Response("\ufeff" + buf.getvalue(), media_type="text/csv; charset=utf-8",
                    headers={"Content-Disposition": f'attachment; filename="{nombre}"'})

async def api_checkout(request):
    """Procesa el check-out de una herramienta mediante ID o Tag."""
    current_admin, err = require_auth(request, ["admin", "operator"])
    if err:
        return err
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

async def api_checkout_multi(request):
    """Pedido de 1 o 2 herramientas a la vez (todo o nada). Acepta ids o tags."""
    current_admin, err = require_auth(request, ["admin", "operator"])
    if err:
        return err
    data = await request.json()
    user_id = data.get("user_id")
    user_tag = data.get("user_tag")
    tool_ids = list(data.get("tool_ids") or [])
    tool_tags = data.get("tool_tags") or []

    if not user_id and user_tag:
        u = query_db("SELECT id FROM users WHERE UPPER(tag_uid) = UPPER(?)", (user_tag.strip(),), one=True)
        if not u:
            return JSONResponse({"error": f"Tag de usuario no reconocido: {user_tag}"}, status_code=404)
        user_id = u["id"]
    for tag in tool_tags:
        t = query_db("SELECT id FROM tools WHERE UPPER(tag_uid) = UPPER(?)", (str(tag).strip(),), one=True)
        if not t:
            return JSONResponse({"error": f"Tag de herramienta no reconocido: {tag}"}, status_code=404)
        tool_ids.append(t["id"])

    if not user_id:
        return JSONResponse({"error": "Falta identificar al alumno"}, status_code=400)
    try:
        result = process_multi_checkout(user_id, tool_ids, data.get("custom_hours"))
        for loan in result["loans"]:
            await broadcast_event("loan_checkout", loan)
        return JSONResponse(result)
    except ValueError as ve:
        return JSONResponse({"error": str(ve)}, status_code=400)
    except Exception as e:
        return JSONResponse({"error": f"Error interno: {str(e)}"}, status_code=500)

async def api_checkin(request):
    """Procesa la devolución y calcula los puntos automáticos de gamificación."""
    current_admin, err = require_auth(request, ["admin", "operator"])
    if err:
        return err
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

        condicion = (data.get("condicion") or "bien").strip()
        notas = (data.get("notas") or "").strip()
        result = process_loan_checkin(loan_id, return_time, condicion, notas)
        await broadcast_event("loan_checkin", result)
        return JSONResponse(result)
    except ValueError as ve:
        return JSONResponse({"error": str(ve)}, status_code=400)
    except Exception as e:
        return JSONResponse({"error": f"Error interno: {str(e)}"}, status_code=500)

# --- PUNTOS Y GAMIFICACIÓN ---
async def api_adjust_points(request):
    current_admin, err = require_auth(request, ["admin"])
    if err:
        return err
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
    current_user, err = require_auth(request)
    if err:
        return err
    if current_user.get("rol") != "admin" and int(current_user["id"]) != int(request.path_params["id"]):
        return JSONResponse({"error": "No puedes modificar el perfil de otro usuario"}, status_code=403)
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
    current_user, err = require_auth(request)
    if err:
        return err
    if current_user.get("rol") != "admin" and int(current_user["id"]) != int(request.path_params["id"]):
        return JSONResponse({"error": "No puedes cambiar el PIN de otro usuario"}, status_code=403)
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
    Permite a un alumno, operario o administrador autenticarse con Usuario/Correo/Matrícula y Contraseña/PIN.
    Genera un JWT seguro y aplica protección contra fuerza bruta (Rate Limiting).
    """
    data = await request.json()
    identifier = data.get("identifier", "").strip()
    password = data.get("password", "").strip()

    client_ip = request.client.host if (request.client and request.client.host) else "local"
    rate_key = f"{client_ip}:{identifier.lower()}"

    if is_rate_limited(rate_key, max_attempts=5, window_seconds=60):
        return JSONResponse({
            "error": "Demasiados intentos fallidos. Por seguridad, espera 1 minuto antes de reintentar.",
            "code": "TOO_MANY_REQUESTS"
        }, status_code=429)

    if not identifier:
        return JSONResponse({"error": "Ingresa tu usuario, matrícula o correo"}, status_code=400)

    # Buscar usuario por email, nombre, tag o matrícula
    user = query_db("""
        SELECT * FROM users 
        WHERE LOWER(email) = LOWER(?) 
           OR LOWER(nombre) = LOWER(?)
           OR LOWER(tag_uid) = LOWER(?)
           OR LOWER(matricula) = LOWER(?)
    """, (identifier, identifier, identifier, identifier), one=True)

    if not user:
        user = query_db("SELECT * FROM users WHERE LOWER(nombre) LIKE LOWER(?)", (f"%{identifier}%",), one=True)

    if not user:
        record_login_failure(rate_key)
        return JSONResponse({"error": "No se encontró ningún usuario con esas credenciales"}, status_code=404)

    # Verificar contraseña / PIN de manera estricta
    if user.get("rol") in ["admin", "operator"] or user.get("pin_hash"):
        if not password:
            record_login_failure(rate_key)
            return JSONResponse({"error": "Contraseña o PIN requerido para esta cuenta"}, status_code=401)
        if not verify_pin(user["id"], password):
            record_login_failure(rate_key)
            return JSONResponse({"error": "Contraseña o PIN incorrecto"}, status_code=401)

    clear_login_failures(rate_key)

    # Generar JWT firmado
    token = create_access_token(user["id"], user["rol"], user["email"])

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
        "token": token,
        "user": user_safe,
        "active_loans": loans,
        "bloqueado_por_puntos": bloqueado,
        "umbral_minimo": min_threshold,
        "authenticated_via_password": True
    })

async def api_register(request):
    """
    Registro de un alumno. Datos: nombres, apellidos, matrícula, correo y el número del tag
    (el tag solo guarda un número; el resto de los datos vive en la base de datos).
    Siempre crea un usuario normal: los administradores no se crean desde aquí.
    """
    data = await request.json()
    nombres = (data.get("nombres") or "").strip()
    apellido_paterno = (data.get("apellido_paterno") or "").strip()
    apellido_materno = (data.get("apellido_materno") or "").strip()
    matricula = (data.get("matricula") or "").strip()
    email = (data.get("email") or "").strip().lower()
    tag_uid = (data.get("tag_uid") or "").strip() or None
    pin = (data.get("password") or data.get("pin") or "").strip()

    if not nombres or not apellido_paterno or not matricula or not email:
        return JSONResponse({"error": "Nombre, apellido paterno, matrícula y correo son obligatorios"}, status_code=400)
    if "@" not in email:
        return JSONResponse({"error": "El correo no es válido"}, status_code=400)
    if not pin or len(pin) < 4:
        return JSONResponse({"error": "Por seguridad, debes definir una contraseña o PIN de al menos 4 caracteres"}, status_code=400)

    if query_db("SELECT id FROM users WHERE LOWER(matricula) = LOWER(?)", (matricula,), one=True):
        return JSONResponse({"error": f"La matrícula {matricula} ya está registrada"}, status_code=409)
    if query_db("SELECT id FROM users WHERE LOWER(email) = LOWER(?)", (email,), one=True):
        return JSONResponse({"error": f"El correo {email} ya está registrado"}, status_code=409)
    if tag_uid:
        if query_db("SELECT id FROM users WHERE UPPER(tag_uid) = UPPER(?)", (tag_uid,), one=True) or \
           query_db("SELECT id FROM tools WHERE UPPER(tag_uid) = UPPER(?)", (tag_uid,), one=True):
            return JSONResponse({"error": "Ese tag ya está asignado a otra persona o herramienta"}, status_code=409)

    nombre_completo = f"{nombres} {apellido_paterno} {apellido_materno}".strip()
    initial_puntos = int(get_settings().get("initial_points", 100))

    try:
        user_id, _ = execute_db("""
            INSERT INTO users (nombre, nombres, apellido_paterno, apellido_materno, matricula, email, rol, tag_uid, puntos, estado, pin_hash)
            VALUES (?, ?, ?, ?, ?, ?, 'user', ?, ?, 'activo', ?)
        """, (nombre_completo, nombres, apellido_paterno, apellido_materno, matricula, email, tag_uid, initial_puntos, hash_pin(pin) if pin else None))

        execute_db("""
            INSERT INTO point_transactions (user_id, cantidad, motivo, saldo_resultante)
            VALUES (?, ?, 'Saldo inicial asignado en registro', ?)
        """, (user_id, initial_puntos, initial_puntos))

        await broadcast_event("user_created", {"id": user_id, "nombre": nombre_completo, "rol": "user"})
        token = create_access_token(user_id, 'user', email)
        return JSONResponse({
            "success": True,
            "token": token,
            "user": {"id": user_id, "nombre": nombre_completo, "matricula": matricula, "email": email,
                     "rol": "user", "tag_uid": tag_uid, "puntos": initial_puntos, "estado": "activo"},
            "message": "Alumno registrado correctamente."
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
    """
    Solicitud de préstamo de una o varias herramientas en un solo envío.
    El motivo es opcional. El plazo lo fija el sistema (días generales o los de la persona).
    """
    current_user, err = require_auth(request)
    if err:
        return err
    data = await request.json()
    user_id = data.get("user_id")
    tool_ids = list(data.get("tool_ids") or [])
    if data.get("tool_id") and data.get("tool_id") not in tool_ids:
        tool_ids.append(data.get("tool_id"))
    tool_ids = list(dict.fromkeys(tool_ids))  # sin repetidos, conservando el orden
    motivo = (data.get("motivo") or "").strip() or "Sin motivo indicado"

    if not user_id or not tool_ids:
        return JSONResponse({"error": "Elige al menos una herramienta"}, status_code=400)

    if current_user.get("rol") not in ["admin", "operator"] and int(current_user["id"]) != int(user_id):
        return JSONResponse({"error": "No puedes solicitar herramientas a nombre de otro alumno"}, status_code=403)

    settings = get_settings()
    min_threshold = int(settings.get("min_points_threshold", 20))
    max_tools = int(settings.get("max_tools_per_request", 2))
    user = query_db("SELECT id, nombre, puntos, estado, dias_prestamo FROM users WHERE id = ?", (user_id,), one=True)
    if not user:
        return JSONResponse({"error": "Usuario no encontrado"}, status_code=404)
    if user["estado"] == "bloqueado":
        return JSONResponse({"error": "Tu cuenta se encuentra bloqueada administrativamente"}, status_code=403)
    if user["puntos"] < min_threshold:
        return JSONResponse({"error": f"Puntos insuficientes ({user['puntos']} pts). El umbral mínimo requerido es de {min_threshold} puntos."}, status_code=403)

    # El límite cuenta lo que ya tiene prestado y lo que ya tiene pedido sin resolver
    activos = query_db("SELECT COUNT(*) AS n FROM loans WHERE user_id = ? AND estado = 'activo'", (user_id,), one=True)["n"]
    pendientes = query_db("SELECT COUNT(*) AS n FROM loan_requests WHERE user_id = ? AND (estado = 'pendiente' OR (estado = 'aprobada' AND loan_id IS NULL))", (user_id,), one=True)["n"]
    if activos + pendientes + len(tool_ids) > max_tools:
        return JSONResponse({"error": f"El máximo es {max_tools} herramientas a la vez. Tienes {activos} prestada(s) y {pendientes} solicitada(s) sin recoger."}, status_code=400)

    nombres = []
    for tid in tool_ids:
        tool = query_db("SELECT id, nombre, estado FROM tools WHERE id = ?", (tid,), one=True)
        if not tool:
            return JSONResponse({"error": "Herramienta no encontrada"}, status_code=404)
        if tool["estado"] != "disponible":
            return JSONResponse({"error": f"La herramienta '{tool['nombre']}' no está disponible (Estado: {tool['estado']})"}, status_code=400)
        if query_db("SELECT id FROM loan_requests WHERE user_id = ? AND tool_id = ? AND (estado = 'pendiente' OR (estado = 'aprobada' AND loan_id IS NULL))", (user_id, tid), one=True):
            return JSONResponse({"error": f"Ya tienes una solicitud en curso para '{tool['nombre']}'."}, status_code=400)
        nombres.append(tool["nombre"])

    horas = resolve_loan_hours(user, settings)
    grupo = uuid.uuid4().hex[:12] if len(tool_ids) > 1 else None
    req_ids = []
    for tid in tool_ids:
        req_id, _ = execute_db("""
            INSERT INTO loan_requests (user_id, tool_id, tiempo_horas, motivo, estado, grupo)
            VALUES (?, ?, ?, ?, 'pendiente', ?)
        """, (user_id, tid, horas, motivo, grupo))
        req_ids.append(req_id)

    await broadcast_event("request_created", {"ids": req_ids, "user": user["nombre"], "tools": nombres})
    return JSONResponse({"success": True, "ids": req_ids, "message": "Solicitud enviada al Administrador con éxito."})

def _pending_in_same_request(req):
    """La solicitud pendiente y las que se mandaron junto con ella (mismo grupo)."""
    if req.get("grupo"):
        return query_db("SELECT * FROM loan_requests WHERE grupo = ? AND estado = 'pendiente' ORDER BY id", (req["grupo"],))
    return [req]

def _approved_not_delivered(req):
    """Solicitudes aprobadas que aún no se entregan, del mismo pedido."""
    if req.get("grupo"):
        return query_db("SELECT * FROM loan_requests WHERE grupo = ? AND estado = 'aprobada' AND loan_id IS NULL ORDER BY id", (req["grupo"],))
    return [req] if (req["estado"] == "aprobada" and not req.get("loan_id")) else []

async def api_approve_request(request):
    """Autoriza el pedido. El plazo NO empieza aquí: empieza cuando se entrega el material."""
    current_admin, err = require_auth(request, ["admin", "operator"])
    if err:
        return err
    req_id = request.path_params["id"]
    req = query_db("SELECT * FROM loan_requests WHERE id = ?", (req_id,), one=True)
    if not req:
        return JSONResponse({"error": "Solicitud no encontrada"}, status_code=404)
    if req["estado"] != "pendiente":
        return JSONResponse({"error": f"Esta solicitud ya fue resuelta previamente ({req['estado']})"}, status_code=400)

    group = _pending_in_same_request(req)
    for r in group:
        tool = query_db("SELECT nombre, estado FROM tools WHERE id = ?", (r["tool_id"],), one=True)
        if not tool or tool["estado"] != "disponible":
            nombre = tool["nombre"] if tool else "una herramienta"
            return JSONResponse({"error": f"'{nombre}' ya no está disponible; no se puede aprobar este pedido."}, status_code=400)

    ahora_str = format_datetime(datetime.now())
    for r in group:
        execute_db("UPDATE loan_requests SET estado = 'aprobada', fecha_resolucion = ? WHERE id = ?", (ahora_str, r["id"]))

    await broadcast_event("request_approved", {"ids": [r["id"] for r in group]})
    return JSONResponse({"success": True, "message": "Solicitud aprobada. Entrega el material para que empiece el plazo."})

async def api_deliver_request(request):
    """Entrega física del material: aquí queda registrado el préstamo y empieza a contar el plazo."""
    current_admin, err = require_auth(request, ["admin", "operator"])
    if err:
        return err
    req_id = request.path_params["id"]
    req = query_db("SELECT * FROM loan_requests WHERE id = ?", (req_id,), one=True)
    if not req:
        return JSONResponse({"error": "Solicitud no encontrada"}, status_code=404)
    group = _approved_not_delivered(req)
    if not group:
        return JSONResponse({"error": "Esta solicitud no está pendiente de entrega"}, status_code=400)
    try:
        result = process_multi_checkout(req["user_id"], [r["tool_id"] for r in group])
        for r, loan in zip(group, result["loans"]):
            execute_db("UPDATE loan_requests SET loan_id = ? WHERE id = ?", (loan["loan_id"], r["id"]))
        for loan in result["loans"]:
            await broadcast_event("loan_checkout", loan)
        return JSONResponse({"success": True, "checkout": result, "message": "Material entregado. El plazo empezó a contar."})
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=400)

async def api_reject_request(request):
    current_admin, err = require_auth(request, ["admin", "operator"])
    if err:
        return err
    req_id = request.path_params["id"]
    data = await request.json()
    motivo_rechazo = data.get("motivo", "").strip() or "Rechazada por el Administrador"

    req = query_db("SELECT * FROM loan_requests WHERE id = ?", (req_id,), one=True)
    if not req:
        return JSONResponse({"error": "Solicitud no encontrada"}, status_code=404)
    if req["estado"] != "pendiente":
        return JSONResponse({"error": f"Esta solicitud ya fue resuelta previamente ({req['estado']})"}, status_code=400)

    ahora_str = format_datetime(datetime.now())
    group = _pending_in_same_request(req)
    for r in group:
        execute_db("""
            UPDATE loan_requests
            SET estado = 'rechazada', respuesta_admin = ?, fecha_resolucion = ?
            WHERE id = ?
        """, (motivo_rechazo, ahora_str, r["id"]))

    await broadcast_event("request_rejected", {"ids": [r["id"] for r in group], "motivo": motivo_rechazo})
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
    current_admin, err = require_auth(request, ["admin"])
    if err:
        return err
    data = await request.json()
    for k, v in data.items():
        update_setting(k, v)
    await broadcast_event("settings_updated", data)
    return JSONResponse({"success": True, "settings": get_settings()})

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

        token = create_access_token(user["id"], user["rol"], user["email"])
        return JSONResponse({
            "target": "user",
            "tag_uid": tag_uid,
            "token": token,
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
    """Canal de suscripción en tiempo real con heartbeat."""
    queue = asyncio.Queue()
    sse_subscribers.add(queue)

    async def event_generator():
        try:
            yield {"event": "connected", "data": json.dumps({"connected": True})}
            while True:
                try:
                    msg = await asyncio.wait_for(queue.get(), timeout=15.0)
                    yield {"event": "message", "data": msg}
                except asyncio.TimeoutError:
                    yield {"event": "ping", "data": "keepalive"}
        except asyncio.CancelledError:
            pass
        finally:
            sse_subscribers.discard(queue)

    return EventSourceResponse(
        event_generator(),
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive"
        }
    )

# --- SERVIR FRONTEND ---
class CachedStaticFiles(StaticFiles):
    async def get_response(self, path: str, scope):
        response = await super().get_response(path, scope)
        if response.status_code == 200:
            # Revalidar siempre para que los cambios se vean al recargar
            response.headers["Cache-Control"] = "no-cache"
        return response

async def serve_index(request):
    index_file = FRONTEND_DIR / "index.html"
    return FileResponse(
        index_file,
        headers={
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0"
        }
    )

# ==========================================
# DEFINICIÓN DE APLICACIÓN STARLETTE
# ==========================================


async def api_auth_me(request):
    """Valida la sesión actual del usuario basada en el JWT Bearer."""
    user = get_current_user_from_request(request)
    if not user:
        return JSONResponse({"authenticated": False, "user": None}, status_code=401)
    user_safe = {k: v for k, v in user.items() if k != "pin_hash"}
    return JSONResponse({"authenticated": True, "user": user_safe})

routes = [
    Route("/", serve_index),
    Route("/api/health", api_health, methods=["GET"]),
    Route("/api/sync", api_sync, methods=["GET"]),
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
    Route("/api/history", api_history, methods=["GET"]),
    Route("/api/history.csv", api_history_csv, methods=["GET"]),
    Route("/api/loans/checkout", api_checkout, methods=["POST"]),
    Route("/api/loans/checkout-multi", api_checkout_multi, methods=["POST"]),
    Route("/api/loans/checkin", api_checkin, methods=["POST"]),
    Route("/api/points/adjust", api_adjust_points, methods=["POST"]),
    Route("/api/users/{id:int}/profile", api_update_profile, methods=["PUT"]),
    Route("/api/users/{id:int}/pin", api_set_pin, methods=["PUT"]),
    Route("/api/verify-pin", api_verify_pin, methods=["POST"]),
    Route("/api/auth/me", api_auth_me, methods=["GET"]),
    Route("/api/auth/login", api_login, methods=["POST"]),
    Route("/api/auth/register", api_register, methods=["POST"]),
    Route("/api/requests", api_get_requests, methods=["GET"]),
    Route("/api/requests", api_create_request, methods=["POST"]),
    Route("/api/requests/{id:int}/approve", api_approve_request, methods=["POST"]),
    Route("/api/requests/{id:int}/deliver", api_deliver_request, methods=["POST"]),
    Route("/api/requests/{id:int}/reject", api_reject_request, methods=["POST"]),
    Route("/api/leaderboard", api_get_leaderboard, methods=["GET"]),
    Route("/api/transactions", api_get_transactions, methods=["GET"]),
    Route("/api/settings", api_get_settings, methods=["GET"]),
    Route("/api/settings", api_update_settings, methods=["PUT"]),
    Route("/api/rfid/scan", api_rfid_scan, methods=["POST"]),
    Route("/api/events", api_sse, methods=["GET"]),
    Mount("/static", CachedStaticFiles(directory=str(FRONTEND_DIR)), name="static"),
]

middleware = [
    Middleware(GZipMiddleware, minimum_size=500),
    Middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
        allow_credentials=True
    )
]

app = Starlette(debug=True, routes=routes, middleware=middleware)
