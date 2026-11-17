import sys
import os
import uvicorn
from pathlib import Path

# Agregar directorio actual al path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from backend.database import DB_PATH, init_db
from backend.seed import seed_database

def main():
    print("=" * 65)
    print("   TOOLTAG PRO - SISTEMA DE GESTIÓN DE HERRAMIENTAS RFID")
    print("             CON MOTOR DE GAMIFICACIÓN")
    print("=" * 65)

    # Inicializar base de datos si no existe
    if not DB_PATH.exists():
        print("[*] Base de datos no encontrada. Inicializando y sembrando datos de prueba...")
        seed_database(force=True)
    else:
        print(f"[*] Base de datos SQLite activa en: {DB_PATH.name}")

    print("\n[+] Servidor local listo:")
    print("    -> URL Principal: http://localhost:8000")
    print("    -> API REST:      http://localhost:8000/api/health")
    print("    -> Eventos SSE:   http://localhost:8000/api/events")
    print("\n[+] Usuarios de prueba listos:")
    print("    -> Admin:   Ing. Roberto Silva  (Tag: AD-9999)     [250 pts]")
    print("    -> User 1:  Carlos Mendoza      (Tag: USR-001-A)   [140 pts - Diamante]")
    print("    -> User 2:  María González      (Tag: USR-002-B)   [105 pts - Plata]")
    print("    -> User 3:  Juan Pérez          (Tag: USR-003-C)   [ 15 pts - En Riesgo/Bloqueado]")
    print("\n[+] Hardware RFID:")
    print("    -> Lector USB HID compatible automáticamente (teclado + Enter)")
    print("    -> Simulador visual integrado en pantalla con 1-click")
    print("=" * 65 + "\n")

    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("backend.app:app", host="0.0.0.0", port=port, log_level="info", reload=False)

if __name__ == "__main__":
    main()
