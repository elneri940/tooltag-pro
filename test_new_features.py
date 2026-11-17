import sys
from backend.database import init_db, get_connection
from backend.seed import seed_database
from backend.gamification import hash_pin, verify_pin

def run_tests():
    print("=== TEST DE NUEVAS FUNCIONALIDADES ===")
    seed_database()
    conn = get_connection()
    c = conn.cursor()

    # 1. Verificar primer admin
    c.execute("SELECT id, email, pin_hash FROM users WHERE rol = ? ORDER BY id ASC LIMIT 1", ("admin",))
    master = c.fetchone()
    assert master is not None, "Debe existir al menos un admin maestro"
    assert verify_pin(master["id"], "0000"), "La clave del admin maestro debe ser 0000"
    print("[1] Admin maestro verificado con éxito:", master["email"])

    # 2. Simular registro de usuario operador
    nombres = "Alejandro"
    ap_pat = "Ruiz"
    ap_mat = "Silva"
    nombre_completo = f"{nombres} {ap_pat} {ap_mat}".strip()
    email_user = "alejandro.ruiz@taller.io"
    pin_user = "pass123"
    pin_hash_user = hash_pin(pin_user)

    c.execute("""
        INSERT INTO users (nombre, nombres, apellido_paterno, apellido_materno, email, pin_hash, rol, puntos, estado)
        VALUES (?, ?, ?, ?, ?, ?, 'user', 100, 'activo')
    """, (nombre_completo, nombres, ap_pat, ap_mat, email_user, pin_hash_user))
    new_user_id = c.lastrowid
    print(f"[2] Usuario Operador creado: ID {new_user_id}, {nombre_completo}")

    # 3. Simular registro de nuevo admin con contraseña maestra válida
    master_pass_input = "0000"
    assert verify_pin(master["id"], master_pass_input), "Validación contraseña primer admin falló"

    admin_nombres = "Laura"
    admin_pat = "Torres"
    admin_mat = "Ramos"
    admin_completo = f"{admin_nombres} {admin_pat} {admin_mat}".strip()
    email_admin = "laura.torres@taller.io"
    pin_admin = "adminSecure99"
    pin_hash_admin = hash_pin(pin_admin)

    c.execute("""
        INSERT INTO users (nombre, nombres, apellido_paterno, apellido_materno, email, pin_hash, rol, puntos, estado)
        VALUES (?, ?, ?, ?, ?, ?, 'admin', 100, 'activo')
    """, (admin_completo, admin_nombres, admin_pat, admin_mat, email_admin, pin_hash_admin))
    new_admin_id = c.lastrowid
    print(f"[3] Nuevo Administrador registrado con autorización de clave maestra: ID {new_admin_id}, {admin_completo}")

    # 4. Simular solicitud de préstamo
    c.execute("SELECT id FROM tools WHERE estado = 'disponible' LIMIT 1")
    tool = c.fetchone()
    assert tool is not None, "Debe haber una herramienta disponible"
    tool_id = tool["id"]

    c.execute("""
        INSERT INTO loan_requests (user_id, tool_id, motivo, tiempo_horas, estado)
        VALUES (?, ?, ?, ?, 'pendiente')
    """, (new_user_id, tool_id, "Trabajo en torno CNC", 3))
    req_id = c.lastrowid
    print(f"[4] Solicitud de préstamo creada: ID {req_id} para herramienta {tool_id}")

    # 5. Admin aprueba la solicitud
    c.execute("UPDATE loan_requests SET estado = 'aprobada', fecha_resolucion = CURRENT_TIMESTAMP WHERE id = ?", (req_id,))
    # Crear el préstamo
    c.execute("""
        INSERT INTO loans (user_id, tool_id, fecha_limite, estado)
        VALUES (?, ?, datetime('now', '+3 hours'), 'activo')
    """, (new_user_id, tool_id))
    c.execute("UPDATE tools SET estado = 'prestada' WHERE id = ?", (tool_id,))
    conn.commit()
    print(f"[5] Solicitud aprobada y préstamo activo generado.")

    # 6. Consultar préstamos activos para el panel de admin (ver quién tiene qué y cuándo regresa)
    c.execute("""
        SELECT l.id, u.nombre as usuario, t.nombre as herramienta, l.fecha_prestamo, l.fecha_limite
        FROM loans l
        JOIN users u ON u.id = l.user_id
        JOIN tools t ON t.id = l.tool_id
        WHERE l.estado = 'activo'
    """)
    prestamos = c.fetchall()
    print(f"[6] Total préstamos activos visibles para Admin: {len(prestamos)}")
    for p in prestamos:
        print(f"    - {p['herramienta']} en poder de {p['usuario']} (Regresa: {p['fecha_limite']})")

    conn.close()
    print("\n[OK] ¡TODAS LAS NUEVAS REGLAS Y FLUJOS PROBADOS CON ÉXITO!")

if __name__ == '__main__':
    run_tests()
