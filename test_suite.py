import sys
from pathlib import Path

# Agregar al path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from backend.database import query_db
from backend.gamification import (
    process_loan_checkout, process_loan_checkin, get_leaderboard,
    adjust_user_points, get_settings
)
from backend.seed import seed_database

def run_test():
    print("=== INICIANDO SUITE DE PRUEBAS DEL MOTOR DE GAMIFICACIÓN ===")

    # 1. Sembrado de base de datos
    seed_database(force=True)
    print("[1] Base de datos sembrada correctamente.")

    # Obtener IDs dinámicos
    admin_id = query_db("SELECT id FROM users WHERE email = 'admin@taller.io'", one=True)["id"]
    carlos_id = query_db("SELECT id FROM users WHERE email = 'carlos.mendoza@taller.io'", one=True)["id"]
    maria_id = query_db("SELECT id FROM users WHERE email = 'maria.gonzalez@taller.io'", one=True)["id"]
    juan_id = query_db("SELECT id FROM users WHERE email = 'juan.perez@taller.io'", one=True)["id"]

    tool_torque_id = query_db("SELECT id FROM tools WHERE codigo_inventario = 'TL-003'", one=True)["id"]

    # 2. Configuración
    settings = get_settings()
    print(f"[2] Configuración cargada: Bono={settings['on_time_bonus']} pts, BasePenalización={settings['late_penalty_base']} pts, UmbralBloqueo={settings['min_points_threshold']} pts")

    # 3. Leaderboard
    lead = get_leaderboard()
    print(f"[3] Leaderboard Top #1: {lead[0]['nombre']} con {lead[0]['puntos']} pts ({lead[0]['nivel']['nombre']})")
    print(f"    Leaderboard Top #2: {lead[1]['nombre']} con {lead[1]['puntos']} pts ({lead[1]['nivel']['nombre']})")
    print(f"    Leaderboard Top #3: {lead[2]['nombre']} con {lead[2]['puntos']} pts ({lead[2]['nivel']['nombre']})")

    # 4. Verificar Préstamo Vencido de Juan Pérez
    loans = query_db("SELECT * FROM loans WHERE user_id = ? AND estado = 'activo'", (juan_id,))
    assert len(loans) == 1, "Juan debe tener exactamente 1 préstamo activo vencido"
    juan_loan_id = loans[0]["id"]
    print(f"[4] Préstamo activo de Juan detectado: Préstamo ID {juan_loan_id}, Herramienta ID {loans[0]['tool_id']}")

    # 5. Devolución de herramienta vencida (Multímetro Fluke)
    res_juan = process_loan_checkin(juan_loan_id)
    print(f"[5] Devolución procesada:")
    print(f"    -> Estado: {res_juan['estado']}")
    print(f"    -> Horas de retraso: {res_juan['horas_retraso']}h")
    print(f"    -> Variación de puntos: {res_juan['puntos_delta']} pts")
    print(f"    -> Saldo resultante: {res_juan['nuevo_saldo']} pts")
    print(f"    -> Motivo: {res_juan['motivo']}")
    assert res_juan["estado"] == "devuelto_tarde", "El estado debió ser devuelto_tarde"
    assert res_juan["puntos_delta"] < 0, "Debe ser penalización negativa"

    # 6. Intentar solicitar un nuevo préstamo con Juan (Puntos < 20)
    print("[6] Verificando bloqueo de seguridad por puntaje insuficiente...")
    try:
        process_loan_checkout(user_id=juan_id, tool_id=tool_torque_id)
        raise AssertionError("ERROR: El sistema no bloqueó al usuario con puntaje bajo!")
    except ValueError as ve:
        print(f"    -> Correcto: Préstamo bloqueado con mensaje: '{ve}'")

    # 7. Préstamo para Carlos Mendoza (140 pts - Top Operario)
    print("[7] Registrando nuevo préstamo para Carlos Mendoza...")
    co = process_loan_checkout(user_id=carlos_id, tool_id=tool_torque_id)
    print(f"    -> Préstamo creado con éxito: ID {co['loan_id']}, Límite: {co['fecha_limite']}")

    # 8. Devolución inmediata a tiempo de Carlos
    print("[8] Procesando devolución a tiempo para Carlos...")
    ci = process_loan_checkin(co["loan_id"])
    print(f"    -> Estado: {ci['estado']}")
    print(f"    -> Variación de puntos: +{ci['puntos_delta']} pts")
    print(f"    -> Saldo nuevo: {ci['nuevo_saldo']} pts")
    assert ci["estado"] == "devuelto_a_tiempo", "Debe ser devuelto_a_tiempo"
    assert ci["puntos_delta"] == 10, "El bono debe ser +10 pts"

    # 9. Verificación de Ledger
    txs = query_db("SELECT * FROM point_transactions WHERE user_id = ? ORDER BY fecha DESC", (carlos_id,))
    print(f"[9] Transacciones registradas en Ledger para Carlos: {len(txs)} movimientos auditados.")
    print(f"    Última transacción: '{txs[0]['motivo']}' (Cantidad: {txs[0]['cantidad']}, Saldo: {txs[0]['saldo_resultante']})")

    # 10. Re-sembrado final para dejar la demo lista para el usuario
    seed_database(force=True)
    print("\n[OK] ¡TODAS LAS PRUEBAS UNITARIAS Y DE NEGOCIO PASARON AL 100%!")

if __name__ == "__main__":
    run_test()
