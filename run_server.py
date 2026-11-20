import sys
import os
import uvicorn
from pathlib import Path

# Agregar directorio actual al path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from backend.database import DB_PATH, init_db
from backend.seed import ensure_defaults

def main():
    port = int(os.environ.get("PORT", 8090))
    print("=" * 65)
    print("   TOOLTAG PRO - SISTEMA DE GESTIÓN DE HERRAMIENTAS RFID")
    print("             CON MOTOR DE GAMIFICACIÓN")
    print("=" * 65)

    # Inicializar base de datos si no existe
    if not DB_PATH.exists():
        print("[*] Base de datos no encontrada. Inicializando y sembrando datos de prueba...")
        ensure_defaults()
    else:
        print(f"[*] Base de datos SQLite activa en: {DB_PATH.name}")

    print("\n[+] Servidor local listo:")
    print(f"    -> URL Principal: http://localhost:{port}")
    print(f"    -> API REST:      http://localhost:{port}/api/health")
    print(f"    -> Eventos SSE:   http://localhost:{port}/api/events")
    print("\n[+] Administrador: admin@taller.io (tag AD-0001)")
    print("    -> Contraseña: la de la variable ADMIN_PASSWORD, o la que se mostró al crearse")
    print("\n[+] Hardware RFID:")
    print("    -> Lector USB HID compatible automáticamente (teclado + Enter)")
    print("    -> Simulador visual integrado en pantalla con 1-click")
    print("=" * 65 + "\n")

    uvicorn.run("backend.app:app", host="0.0.0.0", port=port, log_level="info", reload=False)

if __name__ == "__main__":
    main()
