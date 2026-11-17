# Arquitectura del Sistema - ToolTag Pro
**Sistema Integral de Gestión de Préstamo de Herramientas mediante RFID/NFC con Motor de Gamificación y Auditoría**

---

## 1. Visión General de la Arquitectura

ToolTag Pro implementa una arquitectura modular de alta disponibilidad orientada a eventos para entornos industriales, talleres mecánicos, laboratorios de electrónica y plantas de manufactura. Permite la identificación instantánea de operarios y herramientas mediante etiquetas físicas RFID/NFC (frecuencias 125 kHz EM4100 / 13.56 MHz Mifare / NFC ISO14443A) o simuladores integrados, procesando reglas automatizadas de control de inventario y gamificación con incentivos por puntualidad.

```mermaid
flowchart TD
    subgraph Hardware["1. Capa de Hardware e Interacción"]
        RFID_PHYS["Lector USB HID Físico (RFID/NFC)"]
        RFID_SIM["Simulador Visual de Tags (Software)"]
    end

    subgraph Client["2. Frontend Kiosco / Web (React + Tailwind)"]
        HID_LISTENER["Buffer Listener Global HID (< 50ms + Enter)"]
        AUDIO_ENGINE["Web Audio Engine (Feedback Acústico)"]
        UI_KIOSK["Modo Kiosco de Autoservicio"]
        UI_ADMIN["Dashboard de Supervisión Admin"]
        UI_PROFILE["Perfil de Operario & Historial"]
        UI_LEADER["Leaderboard & Ranking en Vivo"]
    end

    subgraph Server["3. Backend y Lógica de Negocio"]
        ROUTER["API Router REST + SSE"]
        AUTH_VAL["Validador de Permisos y Umbral de Puntos"]
        GAME_ENGINE["Motor de Gamificación (Puntualidad & Penalizaciones)"]
        LEDGER_MGR["Gestor Inmutable de Transacciones (Ledger)"]
    end

    subgraph Storage["4. Capa de Persistencia"]
        DB[(Base de Datos ACID - SQLite / PostgreSQL)]
        TABLE_USERS["Users (Operarios & Admins)"]
        TABLE_TOOLS["Tools (Inventario & Estados)"]
        TABLE_LOANS["Loans (Ciclo de Préstamos)"]
        TABLE_POINTS["PointTransactions (Auditoría)"]
        TABLE_SETTINGS["SystemSettings (Parámetros)"]
    end

    RFID_PHYS -->|Emulación Teclado + Enter| HID_LISTENER
    RFID_SIM -->|Inyección Directa de UID| HID_LISTENER
    HID_LISTENER --> AUDIO_ENGINE
    HID_LISTENER --> ROUTER

    UI_KIOSK <--> ROUTER
    UI_ADMIN <--> ROUTER
    UI_PROFILE <--> ROUTER
    UI_LEADER <--> ROUTER

    ROUTER --> AUTH_VAL
    AUTH_VAL --> GAME_ENGINE
    GAME_ENGINE --> LEDGER_MGR
    LEDGER_MGR --> DB

    DB --- TABLE_USERS
    DB --- TABLE_TOOLS
    DB --- TABLE_LOANS
    DB --- TABLE_POINTS
    DB --- TABLE_SETTINGS
```

---

## 2. Diagrama Entidad-Relación (Base de Datos)

El modelo de datos garantiza integridad referencial con claves foráneas activas y un registro de auditoría (*append-only ledger*) para asegurar que cada punto otorgado o deducido tenga trazabilidad completa.

```mermaid
erDiagram
    USERS ||--o{ LOANS : "solicita"
    USERS ||--o{ POINT_TRANSACTIONS : "posee historial"
    TOOLS ||--o{ LOANS : "es prestada en"
    LOANS ||--o{ POINT_TRANSACTIONS : "origina"

    USERS {
        int id PK
        string nombre
        string email UK
        string rol "admin | user"
        string tag_uid UK "UID Tag RFID"
        int puntos "Default 100"
        string estado "activo | bloqueado"
        string avatar_url
        datetime created_at
    }

    TOOLS {
        int id PK
        string nombre
        string codigo_inventario UK
        string tag_uid UK "UID Tag RFID"
        string categoria
        string estado "disponible | prestada | mantenimiento"
        int tiempo_prestamo_horas "Default 8h"
        string ubicacion
        string imagen_url
        string descripcion
        datetime created_at
    }

    LOANS {
        int id PK
        int user_id FK
        int tool_id FK
        datetime fecha_prestamo
        datetime fecha_limite
        datetime fecha_devolucion
        string estado "activo | devuelto_a_tiempo | devuelto_tarde"
        string notas
        datetime created_at
    }

    POINT_TRANSACTIONS {
        int id PK
        int user_id FK
        int loan_id FK "Opcional para ajustes admin"
        int cantidad "+/- Puntos"
        string motivo "Justificación auditable"
        int saldo_resultante "Balance post-transacción"
        datetime fecha
    }

    SYSTEM_SETTINGS {
        string key PK
        string value
        string descripcion
    }
```

---

## 3. Especificación del Motor de Gamificación

El sistema recompensa la puntualidad en el retorno de equipo y penaliza las demoras de forma proporcional al tiempo de retraso.

### 3.1. Fórmulas de Cálculo

1. **Saldo Inicial**:
   Todo nuevo usuario registrado comienza con un capital base de:
   $$\text{Puntos Iniciales} = 100\text{ pts}$$

2. **Entrega a Tiempo o Anticipada** ($t_{\text{devolución}} \le t_{\text{límite}}$):
   $$\Delta_{\text{puntos}} = +\text{BonoPuntualidad} \quad (\text{por defecto } +10\text{ pts})$$
   $$\text{Estado del Préstamo} = \texttt{devuelto\_a\_tiempo}$$

3. **Entrega Tardía** ($t_{\text{devolución}} > t_{\text{límite}}$):
   $$\Delta t = t_{\text{devolución}} - t_{\text{límite}}$$
   $$\text{HorasRetraso} = \max\left(1, \left\lceil \frac{\Delta t}{3600\text{ s}} \right\rceil\right)$$
   $$\text{Penalización} = \text{PenalizaciónBase} + (\text{HorasRetraso} \times \text{PenalizaciónHoraria})$$
   $$\Delta_{\text{puntos}} = -\text{Penalización} \quad (\text{ej: } -[15 + 2 \times 5] = -25\text{ pts})$$
   $$\text{Estado del Préstamo} = \texttt{devuelto\_tarde}$$

4. **Actualización del Saldo del Usuario**:
   $$\text{Puntos}_{\text{nuevo}} = \max\left(0, \text{Puntos}_{\text{anterior}} + \Delta_{\text{puntos}}\right)$$

### 3.2. Umbral de Seguridad y Bloqueo de Préstamos
Si un operario acumula retrasos continuos y su puntaje cae por debajo del umbral mínimo:
$$\text{Puntos} < \text{UmbralMínimo} \quad (\text{ej: } < 20\text{ pts})$$
El sistema Kiosco:
- **Bloquea** la pestaña de Check-out (no permite retirar nuevas herramientas).
- **Mantiene abierta** la pestaña de Check-in para que el operario pueda devolver sus herramientas pendientes y recuperar puntos.
- Muestra una alerta visual en rojo indicando el motivo exacto del bloqueo.

### 3.3. Tiers y Niveles de Operario (Leaderboard)
- **💎 Nivel Diamante**: $\ge 130$ puntos (Operario Modelo / Prioridad en herramientas críticas).
- **🥇 Nivel Oro**: $110 - 129$ puntos (Excelente puntualidad).
- **🥈 Nivel Plata**: $90 - 109$ puntos (Cumplimiento estándar).
- **🥉 Nivel Bronce**: $50 - 89$ puntos (Requiere atención).
- **⚠️ En Riesgo**: $< 50$ puntos (Alerta preventiva antes de bloqueo).

---

## 4. Protocolo de Integración para Lectores USB HID (RFID/NFC)

### 4.1. Comportamiento Físico del Hardware
La gran mayoría de los lectores RFID y NFC de escritorio (como Sycreader USB, RC522 USB, PN532 HID, o lectores de códigos de barras industriales) se identifican ante el sistema operativo como un **dispositivo de interfaz humana (USB HID Keyboard)**.

Al acercar una tarjeta o tag:
1. El microcontrolador del lector lee el UID del transponder (ej: `E20000192809` o `USR-001-A`).
2. Transmite cada caracter del UID a través de paquetes de teclado a una velocidad de ráfaga muy alta (intervalo entre teclas $\le 25\text{ ms}$).
3. Envía un caracter delimitador final, que por estándar es `Enter` (`\r` o `\n` o código ASCII 13).

### 4.2. Algoritmo de Detección en Frontend (`app.js`)
Para no obligar al operario a hacer clic en una caja de texto antes de acercar su credencial, ToolTag Pro implementa un **Listener Global de Ráfagas**:
- Monitorea el evento `window.addEventListener('keydown', ...)`.
- Mide el diferencial de tiempo entre caracteres ($\Delta t_{\text{tecla}}$). Si $\Delta t > 120\text{ ms}$, descarta el buffer por considerarlo tecleo manual humano lento.
- Al recibir `Enter`, si la longitud del buffer es $\ge 3$ caracteres, lo procesa inmediatamente como lectura de Tag RFID.
- Realiza una consulta contextual a `/api/rfid/scan`:
  - Si el UID pertenece a un **Usuario**, inicia sesión inmediatamente en el Kiosco.
  - Si el UID pertenece a una **Herramienta** y el usuario ya está en el Kiosco:
    - Si ya tiene la herramienta prestada $\to$ **Ejecuta Check-in (devolución inmediata)**.
    - Si está disponible $\to$ **Ejecuta Check-out (préstamo inmediato)**.

---

## 5. Catálogo de Endpoints REST & SSE

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/api/health` | Verificación de estado de la aplicación. |
| `GET` | `/api/stats` | Métricas globales (herramientas, préstamos activos, vencidos, usuarios). |
| `POST` | `/api/rfid/scan` | Procesador inteligente de Tag UID (identifica si es usuario o herramienta). |
| `GET` | `/api/users` | Lista de todos los operarios con estado y préstamos activos. |
| `POST` | `/api/users` | Registrar nuevo operario con UID de tag físico. |
| `GET` | `/api/users/by-tag/{tag_uid}` | Búsqueda ultrarrápida de usuario mediante RFID. |
| `GET` | `/api/tools` | Catálogo de herramientas con filtros por categoría y estado. |
| `POST` | `/api/tools` | Alta de herramienta vinculando UID de Tag RFID. |
| `POST` | `/api/loans/checkout` | Registro de préstamo con cálculo automático de fecha límite. |
| `POST` | `/api/loans/checkin` | Registro de devolución con cálculo automático de bonos/penalizaciones. |
| `POST` | `/api/points/adjust` | Ajuste manual de puntos por Administrador con justificación en Ledger. |
| `GET` | `/api/leaderboard` | Tabla de clasificación en tiempo real ordenada por puntos y puntualidad. |
| `GET` | `/api/transactions` | Historial completo de auditoría de transacciones de puntos. |
| `GET` | `/api/settings` | Obtención de parámetros de gamificación y umbrales. |
| `PUT` | `/api/settings` | Actualización de reglas de gamificación en caliente. |
| `POST` | `/api/seed/reset` | Reinicio de base de datos a los datos de prueba oficiales. |
| `GET` | `/api/events` | Canal Server-Sent Events (SSE) para sincronización en tiempo real. |
