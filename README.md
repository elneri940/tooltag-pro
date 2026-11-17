# ToolTag Pro - Sistema de Préstamo de Herramientas RFID & Gamificación

Bienvenido a **ToolTag Pro**, una plataforma industrial full-stack diseñada para la gestión rápida, automatizada y gamificada de préstamos de herramientas en talleres, laboratorios y plantas de manufactura utilizando tecnología **RFID / NFC**.

---

## 🚀 Inicio Rápido en 1 Paso

Para iniciar la aplicación completa (Backend REST/SSE + Frontend React + Base de Datos SQLite):

```powershell
cd "C:\Users\luisn\.gemini\antigravity\scratch\rfid-tool-manager"
python run_server.py
```

Una vez iniciado, abre en tu navegador:
👉 **[http://localhost:8000](http://localhost:8000)**

---

## 🪪 Credenciales y Tags RFID de Prueba (Semilla Oficial)

La base de datos viene precargada con datos realistas para probar todos los flujos de inmediato:

| Nombre | Rol | Tag RFID (UID) | Puntos | Estado / Nivel | Caso de Prueba |
|---|---|---|---|---|---|
| **Ing. Roberto Silva** | `admin` | `AD-9999` | 250 pts | Activo / Admin | PIN por defecto: `0000`. Supervisión, CRUD y ajuste de reglas. |
| **Carlos Mendoza** | `user` | `USR-001-A` | 140 pts | 💎 Diamante (#1) | PIN por defecto: `1234`. Top operario, 1 herramienta activa. |
| **María González** | `user` | `USR-002-B` | 105 pts | 🥈 Plata (#2) | PIN por defecto: `1234`. Regular, 100% puntualidad. |
| **Juan Pérez** | `user` | `USR-003-C` | 15 pts | ⚠️ En Riesgo | PIN por defecto: `1234`. **Puntaje < 20 pts (Bloqueado)**. Multímetro vencido. |

---

## 🔒 Seguridad: Contraseña / PIN para Préstamos y Edición de Administrador

### 1. Edición del Perfil de Administrador
En la barra superior, haz clic en el botón **"Mi Perfil"**:
* **Datos Personales:** Modifica tu Nombre, Correo Electrónico, URL de Fotografía/Avatar y UID del Tag RFID personal.
* **PIN de Seguridad:** Establece o cambia tu PIN de 4 a 8 dígitos (el PIN inicial de prueba es `0000`).

### 2. Préstamo con Usuario y Contraseña (o PIN)
* **Acceso sin tarjeta física:** Si un operario no tiene su tarjeta RFID/NFC en ese momento, en la pantalla principal del Kiosco puede pulsar la pestaña **"Usuario y Contraseña"**.
* **Credenciales Aceptadas:** Puede ingresar su correo electrónico (ej: `carlos.mendoza@taller.io`), su nombre de usuario (`Carlos Mendoza` o `carlos`) y su PIN o contraseña (`1234`).
* **Préstamo Directo:** Al autenticarse con su contraseña, el sistema sabe que el operario ya validó su identidad, por lo que puede retirar y devolver herramientas directamente sin que se le vuelva a pedir la clave.

### 3. PIN de Seguridad en el Kiosco de Préstamo (Modo RFID)
* **Protección contra extravío de tarjetas:** Cuando un operario se identifica mediante tarjeta RFID y su cuenta tiene PIN configurado, al pulsar **"Solicitar Préstamo"** en el Kiosco se abre un modal de seguridad solicitando el PIN numérico de 4 dígitos.
* **Control Global:** En *Admin Dashboard* $\to$ *Reglas de Gamificación*, puedes activar/desactivar la política global de requerimiento de PIN con un solo clic.
* **Gestión por Usuario:** En la tabla de operarios, el Administrador puede ver qué usuarios tienen PIN activo y asignarles o resetearles su clave en cualquier momento.

### 🛠️ Herramientas de Prueba y sus Tags RFID:

1. **Taladro Percutor DeWalt 20V Max** (`TL-001` | Tag: `TAG-TL-001`): Prestada a Carlos (a tiempo).
2. **Multímetro Industrial Fluke 87V** (`TL-002` | Tag: `TAG-TL-002`): **Prestada a Juan (¡Vencida hace 3 horas!)**. Al devolverla en el Kiosco, se aplica la penalización automática de retraso.
3. **Llave Dinamométrica Digital Milwaukee 1/2"** (`TL-003` | Tag: `TAG-TL-003`): **Disponible** (6 horas de préstamo).
4. **Amoladora Angular Bosch Pro 850W** (`TL-004` | Tag: `TAG-TL-004`): **Disponible** (4 horas de préstamo).
5. **Osciloscopio Digital Rigol DS1054Z 50MHz** (`TL-005` | Tag: `TAG-TL-005`): En **Mantenimiento**.

---

## 🎮 Motor de Gamificación: Reglas y Matemáticas

- **Capital Inicial:** 100 puntos al registrarse.
- **Entrega a Tiempo o Anticipada:** `+10 puntos` de bonificación directa al saldo.
- **Entrega Tardía:** `-15 puntos` base + `-5 puntos` por cada hora de retraso acumulado.
- **Bloqueo de Seguridad:** Si un operario tiene menos de `20 puntos` (configurable), el Kiosco bloquea automáticamente el retiro de nuevas herramientas y le exige devolver las que tenga en posesión.
- **Ledger Inmutable:** Cada variación queda registrada con fecha, herramienta involucrada y motivo exacto.

---

## 📡 Soporte para Hardware RFID y Simulador Integrado

### 1. Lectores USB HID Físicos
Cualquier lector de tarjetas RFID/NFC tipo teclado USB (Sycreader, Mifare, EM4100) funciona de manera **nativa y transparente**:
- No requiere instalar drivers ni pulsar previamente en una casilla de texto.
- El sistema cuenta con un *listener global* que detecta ráfagas de teclado a alta velocidad culminadas con `Enter` y ejecuta la acción adecuada en el Kiosco o en el panel de inventario.

### 2. Simulador Visual Flotante
En la esquina inferior izquierda de la pantalla encontrarás el panel **"Simulador de Lector RFID / NFC"**:
- Botones de 1-click para simular credenciales de operarios o tags de herramientas.
- Entrada para escribir cualquier UID manual.
- Feedback sonoro generado mediante **Web Audio API** (chimes de lectura RFID, éxito y alertas de error).

---

## 📂 Estructura del Proyecto

- `backend/app.py`: Servidor Starlette con rutas REST y streaming Server-Sent Events (SSE).
- `backend/database.py`: Motor de persistencia SQLite con claves foráneas e índices de búsqueda rápida.
- `backend/gamification.py`: Algoritmo de cálculo de bonos, penalizaciones y ledger.
- `backend/seed.py`: Datos de prueba iniciales.
- `frontend/index.html`: Estructura HTML5 con Tailwind CSS.
- `frontend/app.js`: Aplicación React 18 completa (Kiosco, Admin Dashboard, Perfil, Leaderboard y Simulador).
- `frontend/rfid-audio.js`: Sintetizador de sonido por software para hardware RFID.
- `prisma/schema.prisma`: Esquema de producción para Prisma ORM / PostgreSQL / Supabase.
- `node-backend-ref/server.ts`: Backend de referencia equivalente en TypeScript / Express.
- `ARCHITECTURE.md`: Documento de arquitectura de software, diagramas Mermaid y especificaciones de hardware.
- `run_server.py`: Script de ejecución rápida.
