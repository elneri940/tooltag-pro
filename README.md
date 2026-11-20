# ToolTag Pro — Préstamo de herramientas con tags RFID/NFC

Sistema para un taller universitario. Los alumnos se registran una vez, piden hasta 2 herramientas,
se llevan el material y lo devuelven pasando su tag. Cada entrega a tiempo suma puntos; los atrasos y
las herramientas dañadas restan. Con pocos puntos el alumno deja de poder pedir herramientas.

## Cómo arrancar (Windows)

1. Instala Python 3.10 o más nuevo.
2. En una terminal, dentro de esta carpeta: `pip install -r requirements.txt`
3. (Recomendado) Define la contraseña del administrador: `set ADMIN_PASSWORD=tu_clave`
4. `python run_server.py` (o doble clic en `iniciar_tooltag_pro.bat`) y abre http://localhost:8090 (para otro puerto: `set PORT=9000` antes de arrancar)

Si no defines `ADMIN_PASSWORD`, la primera vez se genera una al azar y se muestra una sola vez en la consola.
Administrador: `admin@taller.io`, tag `AD-0001`.

## Cómo funciona

- **El tag solo guarda un número.** Nombre, matrícula y correo viven en la base de datos; el número del tag los encuentra.
- **Registro del alumno:** nombre, apellidos, matrícula, correo y tag (el lector escribe el número solo).
- **Pedir:** el alumno entra a su cuenta, elige hasta 2 herramientas y manda **una sola solicitud** (el motivo es opcional).
  También puede hacerlo directo en el kiosco con su tag.
- **Aprobar y entregar:** el administrador acepta la solicitud y, cuando le da el material al alumno, pulsa **Entregar**.
  Ahí queda registrada la hora de salida y **empieza a contar el plazo**.
- **Devolver:** el encargado registra la devolución (con el tag de la herramienta o desde el panel) y marca si regresó *bien*, *con detalles* o *dañada*.
- **Historial:** pestaña *Historial* del administrador, con filtros (persona, herramienta, estado, fechas) y botón **Descargar para Excel**.
- **Plazo:** el administrador define los días de préstamo (por defecto 1) en *Ajustes*, y puede dar otro plazo a una persona desde su perfil.
- **Puntos** (todo editable en *Ajustes*): inicial 100 · a tiempo y en buen estado +10 · tarde −15 y −5 por hora ·
  con detalles −10 · dañada −30 (la herramienta pasa a mantenimiento) · mínimo para pedir: 20.
- Máximo 2 herramientas a la vez por alumno (editable).

## Lector RFID

Cualquier lector USB tipo teclado funciona sin drivers. Si no hay lector, usa el simulador flotante en pantalla.

## Estructura

- `backend/` servidor (Starlette): `app.py` rutas, `gamification.py` reglas, `database.py`, `seed.py`.
- `frontend/` aplicación React (`app.js`, `index.html`).
- `ARCHITECTURE.md` documento de arquitectura original; `prisma/` y `node-backend-ref/` son material de referencia que no se usa.

## Pendiente de seguridad

Las rutas de administración de la API todavía no exigen sesión: no publiques el sistema en internet sin agregar esa protección.
