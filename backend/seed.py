from datetime import datetime, timedelta
from .database import get_connection, init_db
from .gamification import update_setting, DEFAULT_SETTINGS, format_datetime, hash_pin

def seed_database(force=True):
    """Inicializa y llena la base de datos con los datos de prueba requeridos."""
    init_db()
    conn = get_connection()
    try:
        cur = conn.cursor()

        if force:
            cur.execute("DELETE FROM loan_requests;")
            cur.execute("DELETE FROM point_transactions;")
            cur.execute("DELETE FROM loans;")
            cur.execute("DELETE FROM tools;")
            cur.execute("DELETE FROM users;")
            cur.execute("DELETE FROM system_settings;")

        # 1. Configuración por defecto
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

        # 2. Usuarios de Prueba con Desglose de Nombres y Apellidos
        users = [
            ("Roberto", "Silva", "Castillo", "admin@taller.io", "admin", "AD-9999", 250, "activo", "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150", "0000"),
            ("Carlos", "Mendoza", "Ríos", "carlos.mendoza@taller.io", "user", "USR-001-A", 140, "activo", "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150", "1234"),
            ("María", "González", "López", "maria.gonzalez@taller.io", "user", "USR-002-B", 105, "activo", "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150", "1234"),
            ("Juan", "Pérez", "Soto", "juan.perez@taller.io", "user", "USR-003-C", 15, "activo", "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150", "1234")
        ]

        user_ids = {}
        for nombres, ap_pat, ap_mat, email, rol, tag_uid, puntos, estado, avatar, pin in users:
            nombre_completo = f"{nombres} {ap_pat} {ap_mat}".strip()
            cur.execute("""
                INSERT INTO users (nombre, nombres, apellido_paterno, apellido_materno, email, rol, tag_uid, puntos, estado, avatar_url, pin_hash, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (nombre_completo, nombres, ap_pat, ap_mat, email, rol, tag_uid, puntos, estado, avatar, hash_pin(pin), format_datetime(now - timedelta(days=30))))
            user_ids[email] = cur.lastrowid

        # 3. Herramientas de Prueba (5 herramientas)
        tools = [
            ("Taladro Percutor DeWalt 20V Max", "TL-001", "TAG-TL-001", "Herramientas Eléctricas", "prestada", 8, "Estante Eléctrico A-1", "https://images.unsplash.com/photo-1504148455328-c376907d081c?w=300", "Motor sin escobillas de alto rendimiento, incluye 2 baterías XR."),
            ("Multímetro Digital Industrial Fluke 87V", "TL-002", "TAG-TL-002", "Medición y Diagnóstico", "prestada", 4, "Armario Metrología B-2", "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=300", "True RMS, termómetro incorporado, resolución de 6000 cuentas."),
            ("Llave Dinamométrica Digital Milwaukee 1/2\"", "TL-003", "TAG-TL-003", "Herramientas Manuales", "disponible", 6, "Panel Mecánico C-1", "https://images.unsplash.com/photo-1616401784845-180882ba9ba8?w=300", "Rango 17-203 Nm, precisión ±2%, pantalla LCD con alerta sonora."),
            ("Amoladora Angular Bosch Pro 850W", "TL-004", "TAG-TL-004", "Herramientas Eléctricas", "disponible", 4, "Estante Eléctrico A-2", "https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=300", "Disco 115mm, protección contra re-arranque y empuñadura antivibración."),
            ("Osciloscopio Digital Rigol DS1054Z 50MHz", "TL-005", "TAG-TL-005", "Medición y Diagnóstico", "mantenimiento", 12, "Mesa de Calibración", "https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=300", "4 canales analógicos, en calibración preventiva de rutina.")
        ]

        tool_ids = {}
        for nombre, codigo, tag_uid, cat, estado, tiempo, ubicacion, img, desc in tools:
            cur.execute("""
                INSERT INTO tools (nombre, codigo_inventario, tag_uid, categoria, estado, tiempo_prestamo_horas, ubicacion, imagen_url, descripcion, created_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (nombre, codigo, tag_uid, cat, estado, tiempo, ubicacion, img, desc, format_datetime(now - timedelta(days=20))))
            tool_ids[codigo] = cur.lastrowid

        # 4. Historial de Préstamos y Transacciones (Ledger)
        carlos_id = user_ids["carlos.mendoza@taller.io"]
        maria_id = user_ids["maria.gonzalez@taller.io"]
        juan_id = user_ids["juan.perez@taller.io"]
        admin_id = user_ids["admin@taller.io"]

        # 4.1 Registros iniciales de puntos (+100 de bienvenida para todos)
        for u_id, u_nombre in [(carlos_id, "Carlos Mendoza"), (maria_id, "María González"), (juan_id, "Juan Pérez")]:
            cur.execute("""
                INSERT INTO point_transactions (user_id, loan_id, cantidad, motivo, saldo_resultante, fecha)
                VALUES (?, NULL, 100, 'Saldo inicial de bienvenida al sistema de herramientas', 100, ?)
            """, (u_id, format_datetime(now - timedelta(days=25))))

        # 4.2 Historial Carlos (+10, +10, +20 premio)
        # Préstamo pasado devuelto a tiempo
        past_start = now - timedelta(days=10)
        past_limit = past_start + timedelta(hours=6)
        past_return = past_start + timedelta(hours=5)
        cur.execute("""
            INSERT INTO loans (user_id, tool_id, fecha_prestamo, fecha_limite, fecha_devolucion, estado, notas)
            VALUES (?, ?, ?, ?, ?, 'devuelto_a_tiempo', 'Devolución impecable')
        """, (carlos_id, tool_ids["TL-003"], format_datetime(past_start), format_datetime(past_limit), format_datetime(past_return)))
        l1_id = cur.lastrowid
        cur.execute("""
            INSERT INTO point_transactions (user_id, loan_id, cantidad, motivo, saldo_resultante, fecha)
            VALUES (?, ?, 10, 'Devolución puntual de herramienta ''Llave Dinamométrica Digital Milwaukee 1/2"'' (+10 pts)', 110, ?)
        """, (carlos_id, l1_id, format_datetime(past_return)))

        # Otro préstamo devuelto a tiempo
        past_start2 = now - timedelta(days=5)
        past_limit2 = past_start2 + timedelta(hours=4)
        past_return2 = past_start2 + timedelta(hours=3, minutes=30)
        cur.execute("""
            INSERT INTO loans (user_id, tool_id, fecha_prestamo, fecha_limite, fecha_devolucion, estado)
            VALUES (?, ?, ?, ?, ?, 'devuelto_a_tiempo')
        """, (carlos_id, tool_ids["TL-004"], format_datetime(past_start2), format_datetime(past_limit2), format_datetime(past_return2)))
        l2_id = cur.lastrowid
        cur.execute("""
            INSERT INTO point_transactions (user_id, loan_id, cantidad, motivo, saldo_resultante, fecha)
            VALUES (?, ?, 10, 'Devolución puntual de herramienta ''Amoladora Angular Bosch Pro 850W'' (+10 pts)', 120, ?)
        """, (carlos_id, l2_id, format_datetime(past_return2)))

        # Reconocimiento manual de Administrador a Carlos (+20 pts)
        cur.execute("""
            INSERT INTO point_transactions (user_id, loan_id, cantidad, motivo, saldo_resultante, fecha)
            VALUES (?, NULL, 20, '[Ajuste Admin] Reconocimiento por excelencia y limpieza en banco de trabajo', 140, ?)
        """, (carlos_id, format_datetime(now - timedelta(days=2))))

        # Préstamo ACTIVO para Carlos (En curso, a tiempo)
        loan_carlos_active_start = now - timedelta(hours=2)
        loan_carlos_active_limit = loan_carlos_active_start + timedelta(hours=8)
        cur.execute("""
            INSERT INTO loans (user_id, tool_id, fecha_prestamo, fecha_limite, estado)
            VALUES (?, ?, ?, ?, 'activo')
        """, (carlos_id, tool_ids["TL-001"], format_datetime(loan_carlos_active_start), format_datetime(loan_carlos_active_limit)))

        # 4.3 Historial María (Devolución a tiempo +10, pequeño ajuste -5 = 105)
        p_start_m = now - timedelta(days=3)
        p_limit_m = p_start_m + timedelta(hours=6)
        p_return_m = p_start_m + timedelta(hours=4)
        cur.execute("""
            INSERT INTO loans (user_id, tool_id, fecha_prestamo, fecha_limite, fecha_devolucion, estado)
            VALUES (?, ?, ?, ?, ?, 'devuelto_a_tiempo')
        """, (maria_id, tool_ids["TL-003"], format_datetime(p_start_m), format_datetime(p_limit_m), format_datetime(p_return_m)))
        lm_id = cur.lastrowid
        cur.execute("""
            INSERT INTO point_transactions (user_id, loan_id, cantidad, motivo, saldo_resultante, fecha)
            VALUES (?, ?, 10, 'Devolución puntual de herramienta ''Llave Dinamométrica Digital Milwaukee 1/2"'' (+10 pts)', 110, ?)
        """, (maria_id, lm_id, format_datetime(p_return_m)))

        cur.execute("""
            INSERT INTO point_transactions (user_id, loan_id, cantidad, motivo, saldo_resultante, fecha)
            VALUES (?, NULL, -5, '[Ajuste Admin] Devolución sin guardar en estuche correspondiente', 105, ?)
        """, (maria_id, format_datetime(now - timedelta(days=1))))

        # 4.4 Historial Juan (Retraso severo de 4 horas en el pasado: 100 - (15 + 4*5 = 35) = 65; luego penalización -50 = 15)
        p_start_j = now - timedelta(days=7)
        p_limit_j = p_start_j + timedelta(hours=4)
        p_return_j = p_start_j + timedelta(hours=8)  # 4 horas tarde
        cur.execute("""
            INSERT INTO loans (user_id, tool_id, fecha_prestamo, fecha_limite, fecha_devolucion, estado)
            VALUES (?, ?, ?, ?, ?, 'devuelto_tarde')
        """, (juan_id, tool_ids["TL-001"], format_datetime(p_start_j), format_datetime(p_limit_j), format_datetime(p_return_j)))
        lj_id = cur.lastrowid
        cur.execute("""
            INSERT INTO point_transactions (user_id, loan_id, cantidad, motivo, saldo_resultante, fecha)
            VALUES (?, ?, -35, 'Devolución tardía (4h retraso) de ''Taladro Percutor DeWalt 20V Max'' (-35 pts)', 65, ?)
        """, (juan_id, lj_id, format_datetime(p_return_j)))

        cur.execute("""
            INSERT INTO point_transactions (user_id, loan_id, cantidad, motivo, saldo_resultante, fecha)
            VALUES (?, NULL, -50, '[Ajuste Admin] Incidente de seguridad: daño de cable por mal uso en amoladora', 15, ?)
        """, (juan_id, format_datetime(now - timedelta(days=4))))

        # Préstamo ACTIVO para Juan: ¡VENCIDO HACE 3 HORAS!
        # Inicio: hace 7 horas. Límite: 4 horas de préstamo (venció hace 3 horas).
        # Esto permite probar de inmediato en el Kiosco la alerta y la penalización de devolución tardía.
        loan_juan_active_start = now - timedelta(hours=7)
        loan_juan_active_limit = loan_juan_active_start + timedelta(hours=4)
        cur.execute("""
            INSERT INTO loans (user_id, tool_id, fecha_prestamo, fecha_limite, estado)
            VALUES (?, ?, ?, ?, 'activo')
        """, (juan_id, tool_ids["TL-002"], format_datetime(loan_juan_active_start), format_datetime(loan_juan_active_limit)))

        # 5. Solicitud de Préstamo Pendiente de Prueba (María González -> Llave Dinamométrica)
        cur.execute("""
            INSERT INTO loan_requests (user_id, tool_id, fecha_solicitud, tiempo_horas, motivo, estado)
            VALUES (?, ?, ?, 6, 'Ajuste de pernos de culata en estación de motores 3', 'pendiente')
        """, (maria_id, tool_ids["TL-003"], format_datetime(now - timedelta(minutes=45))))

        conn.commit()
        print("Base de datos inicializada y sembrada con éxito.")
    finally:
        conn.close()

if __name__ == "__main__":
    seed_database(force=True)
