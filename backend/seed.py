import os
import secrets
from datetime import datetime
from .database import get_connection, init_db
from .gamification import DEFAULT_SETTINGS, format_datetime, hash_pin

ADMIN_EMAIL = "admin@taller.io"
ADMIN_TAG = "AD-0001"

SETTING_DESCRIPTIONS = {
    "initial_points": "Puntaje otorgado a todo alumno nuevo",
    "on_time_bonus": "Puntos que se ganan por devolver a tiempo y en buen estado",
    "late_penalty_base": "Penalización fija por devolver tarde",
    "late_penalty_hourly": "Penalización adicional por cada hora de retraso",
    "min_points_threshold": "Puntos mínimos para poder pedir herramientas",
    "kiosk_timeout_seconds": "Segundos de inactividad antes de cerrar sesión en el kiosco",
    "require_pin_for_loans": "Pedir PIN al prestar (true/false)",
    "loan_days_default": "Días que se presta una herramienta (general)",
    "max_tools_per_request": "Máximo de herramientas que puede tener un alumno a la vez",
    "damage_penalty_minor": "Puntos que se restan si regresa con detalles",
    "damage_penalty_major": "Puntos que se restan si regresa dañada",
}

INITIAL_TOOLS = [
    ("Taladro Percutor DeWalt 20V Max", "TL-001", "TAG-TL-001", "Herramientas Eléctricas", 8, "Estante Eléctrico A-1", "Motor sin escobillas de alto rendimiento, incluye 2 baterías XR."),
    ("Multímetro Digital Industrial Fluke 87V", "TL-002", "TAG-TL-002", "Medición y Diagnóstico", 4, "Armario Metrología B-2", "True RMS, termómetro incorporado, resolución de 6000 cuentas."),
    ("Llave Dinamométrica Digital Milwaukee 1/2\"", "TL-003", "TAG-TL-003", "Herramientas Manuales", 6, "Panel Mecánico C-1", "Rango 17-203 Nm, precisión ±2%, pantalla LCD con alerta sonora."),
    ("Amoladora Angular Bosch Pro 850W", "TL-004", "TAG-TL-004", "Herramientas Eléctricas", 4, "Estante Eléctrico A-2", "Disco 115mm, protección contra re-arranque y empuñadura antivibración."),
    ("Osciloscopio Digital Rigol DS1054Z 50MHz", "TL-005", "TAG-TL-005", "Medición y Diagnóstico", 12, "Mesa de Calibración", "4 canales analógicos, precisión industrial para diagnóstico."),
]


def _first(row, key):
    return row[key] if not isinstance(row, (tuple, list)) else row[0]


def ensure_defaults():
    """
    Deja el sistema listo para usarse SIN borrar nada:
    - crea las tablas si no existen,
    - agrega los ajustes que falten (no pisa los que el admin ya cambió),
    - crea el administrador si no existe,
    - carga herramientas de ejemplo solo si el catálogo está vacío.
    """
    init_db()
    conn = get_connection()
    try:
        cur = conn.cursor()

        # 1. Ajustes: solo se insertan los que faltan
        cur.execute("SELECT key FROM system_settings")
        existentes = {(r["key"] if not isinstance(r, (tuple, list)) else r[0]) for r in cur.fetchall()}
        for k, v in DEFAULT_SETTINGS.items():
            if k not in existentes:
                cur.execute(
                    "INSERT INTO system_settings (key, value, descripcion) VALUES (?, ?, ?)",
                    (k, v, SETTING_DESCRIPTIONS.get(k, "")),
                )

        # 2. Administrador (la contraseña viene de la variable ADMIN_PASSWORD o la predeterminada M9#xK4!vR2)
        cur.execute("SELECT id FROM users WHERE email = ?", (ADMIN_EMAIL,))
        if not cur.fetchone():
            password = os.environ.get("ADMIN_PASSWORD") or "M9#xK4!vR2"
            ahora = format_datetime(datetime.now())
            cur.execute(
                """INSERT INTO users (nombre, nombres, apellido_paterno, apellido_materno, email, rol,
                                      tag_uid, puntos, estado, pin_hash, created_at)
                   VALUES ('Administrador', 'Administrador', '', '', ?, 'admin', ?, 500, 'activo', ?, ?)""",
                (ADMIN_EMAIL, ADMIN_TAG, hash_pin(password), ahora),
            )
            print("=" * 60)
            print(f"[ADMIN] Cuenta creada -> correo: {ADMIN_EMAIL} | tag: {ADMIN_TAG}")
            if generated:
                print(f"[ADMIN] Contraseña generada (guárdala, no se vuelve a mostrar): {password}")
            else:
                print("[ADMIN] Contraseña tomada de la variable ADMIN_PASSWORD")
            print("=" * 60)

        # 3. Herramientas de ejemplo solo si no hay ninguna
        cur.execute("SELECT COUNT(*) AS n FROM tools")
        if (_first(cur.fetchone(), "n") or 0) == 0:
            ahora = format_datetime(datetime.now())
            for nombre, codigo, tag, cat, horas, ubic, desc in INITIAL_TOOLS:
                cur.execute(
                    """INSERT INTO tools (nombre, codigo_inventario, tag_uid, categoria, estado,
                                          tiempo_prestamo_horas, ubicacion, descripcion, created_at)
                       VALUES (?, ?, ?, ?, 'disponible', ?, ?, ?, ?)""",
                    (nombre, codigo, tag, cat, horas, ubic, desc, ahora),
                )

        conn.commit()
    finally:
        conn.close()


# Nombres anteriores, para no romper imports existentes
def clean_demo_and_ensure_admin_maestro():
    ensure_defaults()


def seed_database(force=False):
    ensure_defaults()


if __name__ == "__main__":
    ensure_defaults()
