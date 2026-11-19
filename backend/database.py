import os
import re
import sqlite3
from pathlib import Path
from datetime import datetime

DB_PATH = Path(__file__).resolve().parent.parent / "rfid_inventory.db"
DATABASE_URL = os.environ.get("DATABASE_URL")
IS_POSTGRES = bool(DATABASE_URL and (DATABASE_URL.startswith("postgres://") or DATABASE_URL.startswith("postgresql://")))

if IS_POSTGRES:
    try:
        import psycopg2
        import psycopg2.extras
        import psycopg2.pool
    except ImportError:
        IS_POSTGRES = False

_pg_pool = None

def get_pg_pool():
    global _pg_pool
    if _pg_pool is None and IS_POSTGRES:
        url = DATABASE_URL
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql://", 1)
        try:
            _pg_pool = psycopg2.pool.ThreadedConnectionPool(minconn=1, maxconn=10, dsn=url)
        except Exception as e:
            print(f"[DB] Error inicializando ThreadedConnectionPool: {e}")
            _pg_pool = None
    return _pg_pool

def adapt_query_for_pg(query):
    """Adapta sintaxis SQLite a PostgreSQL."""
    q = query
    # Adaptar funciones de fecha
    q = re.sub(r"datetime\('now'(\s*,\s*'localtime')?\)", "CURRENT_TIMESTAMP", q, flags=re.IGNORECASE)
    # Adaptar INSTR a STRPOS / POSITION
    q = re.sub(r"INSTR\s*\(([^,]+),\s*([^)]+)\)", r"STRPOS(\1, \2)", q, flags=re.IGNORECASE)
    # Adaptar INSERT OR REPLACE a ON CONFLICT en Postgres
    if "INSERT OR REPLACE INTO system_settings" in q:
        q = ("INSERT INTO system_settings (key, value, descripcion) VALUES (%s, %s, %s) "
             "ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, descripcion = EXCLUDED.descripcion")
    # Reemplazar placeholders ? por %s unicamente fuera de cadenas de texto literales
    parts = q.split("'")
    for i in range(0, len(parts), 2):
        parts[i] = parts[i].replace("?", "%s")
    q = "'".join(parts)
    return q

class PGConnectionWrapper:
    """Wrapper para emular comportamiento de SQLite con psycopg2 reutilizando conexiones del pool."""
    def __init__(self, raw_conn, pool=None):
        self._raw_conn = raw_conn
        self._pool = pool

    def cursor(self):
        return PGCursorWrapper(self._raw_conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor))

    def execute(self, query, args=None):
        cur = self.cursor()
        cur.execute(query, args)
        return cur

    def commit(self):
        self._raw_conn.commit()

    def rollback(self):
        self._raw_conn.rollback()

    def close(self):
        if self._pool:
            try:
                if self._raw_conn.closed:
                    self._pool.putconn(self._raw_conn, close=True)
                else:
                    self._raw_conn.rollback()
                    self._pool.putconn(self._raw_conn)
            except Exception:
                pass
        else:
            try:
                self._raw_conn.close()
            except Exception:
                pass

from decimal import Decimal
from datetime import datetime as dt_type, date as d_type

def _clean_pg_row(row):
    if not row:
        return None
    d = dict(row)
    for k, v in d.items():
        if isinstance(v, Decimal):
            d[k] = float(v) if '.' in str(v) else int(v)
        elif isinstance(v, (dt_type, d_type)):
            d[k] = v.strftime("%Y-%m-%d %H:%M:%S")
    return d

class PGCursorWrapper:
    """Wrapper para capturar lastrowid automáticamente con RETURNING id."""
    def __init__(self, raw_cursor):
        self._cur = raw_cursor
        self.lastrowid = None
        self.rowcount = 0

    def execute(self, query, args=None):
        adapted = adapt_query_for_pg(query)
        is_insert = adapted.strip().upper().startswith("INSERT INTO") and "RETURNING" not in adapted.upper()
        
        if is_insert:
            adapted += " RETURNING id"

        if args:
            self._cur.execute(adapted, args)
        else:
            self._cur.execute(adapted)

        self.rowcount = self._cur.rowcount
        if is_insert:
            try:
                row = self._cur.fetchone()
                if row:
                    self.lastrowid = row["id"] if isinstance(row, dict) else row[0]
            except Exception:
                self.lastrowid = None
        else:
            self.lastrowid = None
        return self

    def fetchone(self):
        res = self._cur.fetchone()
        return _clean_pg_row(res)

    def fetchall(self):
        rows = self._cur.fetchall()
        return [_clean_pg_row(r) for r in rows] if rows else []

    def close(self):
        self._cur.close()

def get_connection():
    """Retorna una conexión activa a PostgreSQL (en Render/Supabase) con pool o a SQLite (local)."""
    if IS_POSTGRES:
        pool = get_pg_pool()
        if pool:
            try:
                raw_conn = pool.getconn()
                if raw_conn.closed:
                    pool.putconn(raw_conn, close=True)
                    raw_conn = pool.getconn()
                return PGConnectionWrapper(raw_conn, pool=pool)
            except Exception as e:
                print(f"[DB] Fallback de getconn a conexión directa: {e}")
        url = DATABASE_URL
        if url.startswith("postgres://"):
            url = url.replace("postgres://", "postgresql://", 1)
        raw_conn = psycopg2.connect(url)
        return PGConnectionWrapper(raw_conn)
    else:
        conn = sqlite3.connect(str(DB_PATH), timeout=10.0)
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA foreign_keys = ON;")
        conn.execute("PRAGMA journal_mode = WAL;")
        return conn

def init_db():
    """Crea las tablas e índices necesarios según el motor de base de datos."""
    conn = get_connection()
    cursor = conn.cursor()

    if IS_POSTGRES:
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            nombre TEXT NOT NULL,
            nombres TEXT,
            apellido_paterno TEXT,
            apellido_materno TEXT,
            email TEXT UNIQUE NOT NULL,
            rol TEXT NOT NULL CHECK(rol IN ('admin', 'user')),
            tag_uid TEXT UNIQUE,
            puntos INTEGER NOT NULL DEFAULT 100,
            estado TEXT NOT NULL DEFAULT 'activo' CHECK(estado IN ('activo', 'bloqueado')),
            avatar_url TEXT,
            pin_hash TEXT,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        """)

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS tools (
            id SERIAL PRIMARY KEY,
            nombre TEXT NOT NULL,
            codigo_inventario TEXT UNIQUE NOT NULL,
            tag_uid TEXT UNIQUE,
            categoria TEXT NOT NULL,
            estado TEXT NOT NULL DEFAULT 'disponible' CHECK(estado IN ('disponible', 'prestada', 'mantenimiento')),
            tiempo_prestamo_horas INTEGER NOT NULL DEFAULT 8,
            ubicacion TEXT DEFAULT 'Taller Central',
            imagen_url TEXT,
            descripcion TEXT,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        """)

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS loans (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            tool_id INTEGER NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
            fecha_prestamo TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            fecha_limite TIMESTAMP NOT NULL,
            fecha_devolucion TIMESTAMP,
            estado TEXT NOT NULL DEFAULT 'activo' CHECK(estado IN ('activo', 'devuelto_a_tiempo', 'devuelto_tarde')),
            notas TEXT,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        """)

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS point_transactions (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            loan_id INTEGER REFERENCES loans(id) ON DELETE SET NULL,
            cantidad INTEGER NOT NULL,
            motivo TEXT NOT NULL,
            saldo_resultante INTEGER,
            fecha TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        """)

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS system_settings (
            key TEXT PRIMARY KEY,
            value TEXT NOT NULL,
            descripcion TEXT
        );
        """)

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS loan_requests (
            id SERIAL PRIMARY KEY,
            user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            tool_id INTEGER NOT NULL REFERENCES tools(id) ON DELETE CASCADE,
            fecha_solicitud TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            tiempo_horas INTEGER NOT NULL DEFAULT 8,
            motivo TEXT,
            estado TEXT NOT NULL DEFAULT 'pendiente' CHECK(estado IN ('pendiente', 'aprobada', 'rechazada')),
            respuesta_admin TEXT,
            fecha_resolucion TIMESTAMP,
            loan_id INTEGER REFERENCES loans(id) ON DELETE SET NULL,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        """)

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS verification_codes (
            id SERIAL PRIMARY KEY,
            email TEXT NOT NULL,
            code TEXT NOT NULL,
            expires_at TIMESTAMP NOT NULL,
            used INTEGER NOT NULL DEFAULT 0,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );
        """)

        cursor.execute("CREATE INDEX IF NOT EXISTS idx_users_tag ON users(tag_uid);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_tools_tag ON tools(tag_uid);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_loans_active ON loans(user_id, estado);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_points_user ON point_transactions(user_id);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_loan_requests_pending ON loan_requests(estado);")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_verification_codes_lookup ON verification_codes(email, code, used);")

        conn.commit()
        conn.close()
        return

    # MODO SQLITE (Local)
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

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS system_settings (
        key TEXT PRIMARY KEY,
        value TEXT NOT NULL,
        descripcion TEXT
    );
    """)

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

    cursor.execute("""
    CREATE TABLE IF NOT EXISTS verification_codes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL,
        code TEXT NOT NULL,
        expires_at TEXT NOT NULL,
        used INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL DEFAULT (datetime('now', 'localtime'))
    );
    """)

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
    """Ejecuta una sentencia INSERT, UPDATE, DELETE y retorna (lastrowid, rowcount)."""
    conn = get_connection()
    try:
        cur = conn.cursor()
        cur.execute(query, args)
        if commit:
            conn.commit()
        last_id = getattr(cur, "lastrowid", None)
        rowcount = getattr(cur, "rowcount", 0)
        return last_id, rowcount
    finally:
        conn.close()
