from datetime import datetime, timedelta
from .database import get_connection, init_db
from .gamification import update_setting, DEFAULT_SETTINGS, format_datetime, hash_pin

ADMIN_MAESTRO_PASSWORD = "M9#xK4!vR2"

def clean_demo_and_ensure_admin_maestro():
    """Limpia absolutamente cualquier perfil de demo y asegura únicamente al Admin Maestro."""
    init_db()
    conn = get_connection()
    try:
        cur = conn.cursor()
        # 1. Eliminar cualquier usuario que no sea institucional de la UAEM ni el Admin Maestro
        cur.execute("DELETE FROM loan_requests WHERE user_id IN (SELECT id FROM users WHERE email NOT LIKE ? AND email != 'admin@taller.io');", ('%@uaem.edu.mx',))
        cur.execute("DELETE FROM point_transactions WHERE user_id IN (SELECT id FROM users WHERE email NOT LIKE ? AND email != 'admin@taller.io');", ('%@uaem.edu.mx',))
        cur.execute("DELETE FROM loans WHERE user_id IN (SELECT id FROM users WHERE email NOT LIKE ? AND email != 'admin@taller.io');", ('%@uaem.edu.mx',))
        cur.execute("DELETE FROM users WHERE email NOT LIKE ? AND email != 'admin@taller.io';", ('%@uaem.edu.mx',))

        # 2. Resetear herramientas a disponibles si no están en préstamos activos
        cur.execute("UPDATE tools SET estado = 'disponible' WHERE id NOT IN (SELECT tool_id FROM loans WHERE estado = 'activo');")

        # 3. Crear o actualizar al Admin Maestro con su clave segura
        cur.execute("SELECT id FROM users WHERE email = 'admin@taller.io';")
        admin_row = cur.fetchone()
        now = datetime.now()

        if admin_row:
            admin_id = admin_row["id"] if isinstance(admin_row, dict) else admin_row[0]
            cur.execute("""
                UPDATE users SET 
                    nombre = 'Admin Maestro',
                    nombres = 'Admin',
                    apellido_paterno = 'Maestro',
                    apellido_materno = '',
                    rol = 'admin',
                    tag_uid = 'AD-0001',
                    puntos = 500,
                    estado = 'activo',
                    avatar_url = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                    pin_hash = ?
                WHERE id = ?;
            """, (hash_pin(ADMIN_MAESTRO_PASSWORD), admin_id))
        else:
            cur.execute("""
                INSERT INTO users (nombre, nombres, apellido_paterno, apellido_materno, email, rol, tag_uid, puntos, estado, avatar_url, pin_hash, created_at)
                VALUES ('Admin Maestro', 'Admin', 'Maestro', '', 'admin@taller.io', 'admin', 'AD-0001', 500, 'activo', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', ?, ?)
            """, (hash_pin(ADMIN_MAESTRO_PASSWORD), format_datetime(now)))

            cur.execute("SELECT id FROM users WHERE email = 'admin@taller.io';")
            created_admin = cur.fetchone()
            admin_id = created_admin["id"] if isinstance(created_admin, dict) else created_admin[0]

            cur.execute("""
                INSERT INTO point_transactions (user_id, loan_id, cantidad, motivo, saldo_resultante, fecha)
                VALUES (?, NULL, 500, 'Saldo inicial del Administrador Maestro', 500, ?)
            """, (admin_id, format_datetime(now)))

        conn.commit()
        print("Perfiles demo eliminados y Admin Maestro configurado con contraseña segura.")
    finally:
        conn.close()

def seed_database(force=True):
    """Inicializa la base de datos limpia con únicamente el Administrador Maestro."""
    init_db()
    conn = get_connection()
    try:
        cur = conn.cursor()

        if force:
            cur.execute("DELETE FROM loan_requests;")
            cur.execute("DELETE FROM point_transactions;")
            cur.execute("DELETE FROM loans;")
            cur.execute("DELETE FROM users WHERE email != 'admin@taller.io';")

        # 1. Configuración por defecto del sistema
        for k, v in DEFAULT_SETTINGS.items():
            desc = {
                "initial_points": "Puntaje otorgado a todo nuevo operario",
                "on_time_bonus": "Bono de puntos por devolución a tiempo o anticipada",
                "late_penalty_base": "Penalización fija base por devolución tardía",
                "late_penalty_hourly": "Penalización adicional por cada hora de retraso",
                "min_points_threshold": "Umbral mínimo de puntos para permitir préstamos",
                "kiosk_timeout_seconds": "Segundos de inactividad antes de cerrar sesión en kiosco"
            }.get(k, "")
            cur.execute("INSERT OR REPLACE INTO system_settings (key, value, descripcion) VALUES (?, ?, ?)", (k, v, desc))

        now = datetime.now()

        # 2. Crear o Actualizar al Administrador Maestro Único
        cur.execute("SELECT id FROM users WHERE email = 'admin@taller.io';")
        admin_row = cur.fetchone()

        if admin_row:
            admin_id = admin_row["id"] if isinstance(admin_row, dict) else admin_row[0]
            cur.execute("""
                UPDATE users SET 
                    nombre = 'Admin Maestro',
                    nombres = 'Admin',
                    apellido_paterno = 'Maestro',
                    apellido_materno = '',
                    rol = 'admin',
                    tag_uid = 'AD-0001',
                    puntos = 500,
                    estado = 'activo',
                    avatar_url = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
                    pin_hash = ?
                WHERE id = ?;
            """, (hash_pin(ADMIN_MAESTRO_PASSWORD), admin_id))
        else:
            cur.execute("""
                INSERT INTO users (nombre, nombres, apellido_paterno, apellido_materno, email, rol, tag_uid, puntos, estado, avatar_url, pin_hash, created_at)
                VALUES ('Admin Maestro', 'Admin', 'Maestro', '', 'admin@taller.io', 'admin', 'AD-0001', 500, 'activo', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', ?, ?)
            """, (hash_pin(ADMIN_MAESTRO_PASSWORD), format_datetime(now)))
            admin_id = getattr(cur, "lastrowid", None) or 1

        # 3. Catálogo base de herramientas (Todas disponibles para uso real)
        tools = [
            ("Taladro Percutor DeWalt 20V Max", "TL-001", "TAG-TL-001", "Herramientas Eléctricas", "disponible", 8, "Estante Eléctrico A-1", "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=300", "Motor sin escobillas de alto rendimiento, incluye 2 baterías XR."),
            ("Multímetro Digital Industrial Fluke 87V", "TL-002", "TAG-TL-002", "Medición y Diagnóstico", "disponible", 4, "Armario Metrología B-2", "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300", "True RMS, termómetro incorporado, resolución de 6000 cuentas."),
            ("Llave Dinamométrica Digital Milwaukee 1/2\"", "TL-003", "TAG-TL-003", "Herramientas Manuales", "disponible", 6, "Panel Mecánico C-1", "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=300", "Rango 17-203 Nm, precisión ±2%, pantalla LCD con alerta sonora."),
            ("Amoladora Angular Bosch Pro 850W", "TL-004", "TAG-TL-004", "Herramientas Eléctricas", "disponible", 4, "Estante Eléctrico A-2", "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=300", "Disco 115mm, protección contra re-arranque y empuñadura antivibración."),
            ("Osciloscopio Digital Rigol DS1054Z 50MHz", "TL-005", "TAG-TL-005", "Medición y Diagnóstico", "disponible", 12, "Mesa de Calibración", "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=300", "4 canales analógicos, precisión industrial para diagnóstico.")
        ]

        cur.execute("SELECT count(*) as count FROM tools;")
        count_row = cur.fetchone()
        t_count = count_row["count"] if isinstance(count_row, dict) else count_row[0]

        if t_count == 0:
            for nombre, codigo, tag_uid, cat, estado, tiempo, ubicacion, img, desc in tools:
                cur.execute("""
                    INSERT INTO tools (nombre, codigo_inventario, tag_uid, categoria, estado, tiempo_prestamo_horas, ubicacion, imagen_url, descripcion, created_at)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
                """, (nombre, codigo, tag_uid, cat, estado, tiempo, ubicacion, img, desc, format_datetime(now)))
        else:
            cur.execute("UPDATE tools SET estado = 'disponible';")

        cur.execute("""
            INSERT INTO point_transactions (user_id, loan_id, cantidad, motivo, saldo_resultante, fecha)
            VALUES (?, NULL, 500, 'Saldo inicial del Administrador Maestro', 500, ?)
        """, (admin_id, format_datetime(now)))

        conn.commit()
        print("Base de datos configurada en modo producción con Admin Maestro y sin perfiles demo.")
    finally:
        conn.close()

if __name__ == '__main__':
    seed_database(force=True)
