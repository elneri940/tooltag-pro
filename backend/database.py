import sqlite3
import os
import json
from pathlib import Path
from datetime import datetime

DB_PATH = Path(__file__).resolve().parent.parent / "rfid_inventory.db"

def get_connection():
    """Retorna una conexión a SQLite configurada con RowFactory y claves foráneas."""
    conn = sqlite3.connect(str(DB_PATH), timeout=10.0)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON;")
    conn.execute("PRAGMA journal_mode = WAL;")
    return conn

def init_db():
    """Crea las tablas necesarias si no existen."""
    conn = get_connection()
    cursor = conn.cursor()

    # 1. Tabla de Usuarios
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        rol TEXT NOT NULL CHECK(rol IN ('admin', 'user')),
        tag_uid TEXT UNIQUE,
        puntos INTEGER NOT NULL DEFAULT 100,
        estado TEXT NOT NULL DEFAULT 'activo' CHECK(estado IN ('activo', 'bloqueado')),
        avatar_url TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );
    """)

    # 2. Tabla de Herramientas
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS tools (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nombre TEXT NOT NULL,
        codigo_inventario TEXT UNIQUE NOT NULL,
        tag_uid TEXT UNIQUE,
        categoria TEXT NOT NULL,
        estado TEXT NOT NULL DEFAULT 'disponible' CHECK(estado IN ('disponible', 'prestada', 'mantenimiento')),
        tiempo_prestamo_horas INTEGER NOT NULL DEFAULT 8,
        ubicacion TEXT DEFAULT 'Taller Central',
        imagen_url TEXT,
        descripcion TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );
    """)

    # 3. Tabla de Préstamos
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS loans (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        tool_id INTEGER NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
        fecha_prestamo TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
        fecha_limite TEXT NOT NULL,
        fecha_devolucion TEXT,
        estado TEXT NOT NULL DEFAULT 'activo' CHECK(estado IN ('activo', 'devuelto_a_tiempo', 'devuelto_tarde')),
        notas TEXT,
        created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );
    """)

    # 4. Tabla de Transacciones de Puntos (Ledger de Gamificación)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS point_transactions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        loan_id INTEGER REFERENCES loans(id) ON DELETE SET NULL,
        cantidad INTEGER NOT NULL,
        motivo TEXT NOT NULL,
        saldo_resultante INTEGER,
        fecha TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );
    """)

    # 5. Tabla de Configuración del Sistema
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS system_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        descripcion TEXT
    );
    """)

    # 6. Tabla de Solicitudes de Préstamo (Workflow de Aprobación)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS loan_requests (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        tool_id INTEGER NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
        fecha_solicitud TEXT NOT NULL DEFAULT (datetime('now', 'localtime')),
        tiempo_horas INTEGER NOT NULL DEFAULT 8,
        motivo TEXT,
        estado TEXT NOT NULL DEFAULT 'pendiente' CHECK(estado IN ('pendiente', 'aprobada', 'rechazada')),
        respuesta_admin TEXT,
        fecha_resolucion TEXT,
        loan_id INTEGER REFERENCES loans(id) ON DELETE SET NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );
    """)

    # Migraciones en caliente
    cursor.execute("PRAGMA table_info(users);")
    columns = [row[1] for row in cursor.fetchall()]
    if "pin_hash" not in columns:
        cursor.execute("ALTER TABLE users ADD COLUMN pin_hash TEXT;")
    if "apellido_paterno" not in columns:
        cursor.execute("ALTER TABLE users ADD COLUMN apellido_paterno TEXT;")
    if "apellido_materno" not in columns:
        cursor.execute("ALTER TABLE users ADD COLUMN apellido_materno TEXT;")
    if "nombres" not in columns:
        cursor.execute("ALTER TABLE users ADD COLUMN nombres TEXT;")

    # Índices para búsquedas ultrarrápidas con RFID
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_users_tag ON users(tag_uid);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_tools_tag ON tools(tag_uid);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_loans_active ON loans(user_id, estado);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_points_user ON point_transactions(user_id);")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_loan_requests_pending ON loan_requests(estado);")

    conn.commit()
    conn.close()

def query_db(query, args=(), one=False):
    """Ejecuta una consulta SELECT y retorna diccionarios."""
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(query, args)
        rv = cur.fetchall()
        if one:
            return dict(rv[0]) if rv else None
        return [dict(ix) for ix in rv]
    finally:
        conn.close()

def execute_db(query, args=(), commit=True):
    """Ejecuta una sentencia INSERT, UPDATE, DELETE y retorna el lastrowid."""
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(query, args)
        if commit:
            conn.commit()
        last_id = cur.lastrowid
        rowcount = cur.rowcount
        return last_id, rowcount
    finally:
        conn.close()
