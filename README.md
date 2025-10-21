# TourTicketSalesApp

Aplicación full-stack para gestionar y vender tiquetes de tours.
Incluye una landing para los usuarios y un panel administrativo para manejar tours, usuarios y tickets.

## Funcionalidades principales

- Listado de tours con filtrado por cupos disponibles.
- Detalle del tour con selección de cantidad y cálculo automático del total.
- Proceso de compra:
  - Buscar usuario por cédula o crear uno nuevo.
  - Confirmar la compra y generar el ticket.
  - Descuento automático de cupos.
- Panel Admin:
  - Crear, editar y eliminar tours.
  - Ver historial de compras.
- Subida de imágenes a Cloudinary con validaciones.

## Stack técnico

- Frontend: Next.js (App Router), React, Tailwind CSS
- Backend: Prisma + PostgreSQL
- Otros: Cloudinary, SweetAlert2, react-hook-form,

## Validaciones principales

- Los cupos disponibles no pueden superar la capacidad total.
- Al crear un ticket:
  - Se valida que el tour exista y tenga cupos suficientes.
  - Se calcula el total y se descuentan los cupos.
- Solo se permiten imágenes tipo `image/*` y tamaño ≤ 25MB.

## Requisitos previos

- Node.js 18+
- PostgreSQL accesible y cadena de conexión
- Cuenta de Cloudinary para almacenar imágenes

## Variables de entorno

Crear un archivo `.env` en la raíz con:

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB?schema=public"
CLOUDINARY_CLOUD_NAME="tu_cloud_name"
CLOUDINARY_API_KEY="tu_api_key"
CLOUDINARY_API_SECRET="tu_api_secret"
```

---

## Instalación y ejecución

```bash
# Clonar el proyecto
git clone https://github.com/Dazzlm/TourTicketSalesApp.git
cd TourTicketSalesApp

# Instalar dependencias
npm install
```

Configura el archivo `.env`, luego ejecuta:

```bash
# Preparar Prisma y base de datos
npx prisma generate
npx prisma migrate dev --name init

# Iniciar entorno de desarrollo
npm run dev
```

La app quedará disponible en:  
http://localhost:3000

---

## Rutas principales

| Ruta               | Descripción                              |
| ------------------ | ---------------------------------------- |
| `/`                | Listado de tours disponibles             |
| `/tour/[id]`       | Detalle del tour y selección de cantidad |
| `/admin/tours`     | Panel de administración de tours         |
| `/admin/tours/new` | Crear un nuevo tour                      |

---

## Flujos de UI

- Home (`/`): lista tours con cupos > 0. Navega a detalle al hacer click.
- Detalle (`/tour/[id]`): muestra datos, permite seleccionar cantidad y navegar a compra.
- Compra (`/purchase`):
  - Carga tour por `tourId` y cantidad desde query.
  - Buscar usuario por cédula (GET /api/users?cedula=...). Si no existe, crear (POST /api/users).
  - Confirmar pago (modal) y crear ticket (POST /api/tickets/new).
- Admin (`/admin`): accesos a gestión de tours e historial (placeholder).
- Admin tours (`/admin/tours`): lista, edita y elimina. Crear en `/admin/tours/new` y editar en `/admin/tours/[id]/edit`.

## Estilos y UI

- Tailwind CSS 4 para estilos utilitarios.
- lucide-react para íconos.
- SweetAlert2 para modales.

# Decisiones tomadas

Durante el desarrollo tomé varias decisiones técnicas buscando un balance entre orden, rendimiento y claridad en el código.

### Estructura y arquitectura

- **Next.js App Router:** lo usé para mantener la UI y los handlers de la API juntos por ruta, lo que facilita el mantenimiento y la ubicacion por carpetas.
- **Capas separadas (Controller → Service → Repository → Prisma):** ayuda a mantener una separación clara de responsabilidades y facilita el entendimiento y depuración.

### Base de datos y ORM

- **Prisma + PostgreSQL:** Prisma ofrece tipado fuerte y migraciones rápidas e investigando encontre que era la mas usada; PostgreSQL por ser una de las base de datos que uso, ademas Neon emplea el mismo motor y ofrece almacenamiento persistente externo, que es lo necesario para Vercel que no maneja volúmenes locales.
- **Campos `price` y `total` como Decimal:** evita errores de punto flotante al manejar dinero.

### Manejo de imágenes

- **Cloudinary:** lo elegí para manejar las imágenes externamente, ya que en producción no podría servir archivos desde el servidor. Así evito problemas de almacenamiento y simplifico el despliegue.
- **Subida por stream (`upload_stream` + `streamifier`):** reduce el uso de memoria.
- **`public/uploads/`:** se mantiene porque contiene imágenes usadas durante el desarrollo y podría servir como opción futura para almacenamiento local.

### Edición de imágenes

Si al editar un tour no se sube una nueva imagen, se conserva la existente para no dejarlo sin foto.

### Validaciones y experiencia de usuario

- **Validación doble (frontend + backend):**
  - Frontend con react-hook-form para mejorar la UX, aunque también incluí validaciones manuales para mostrar ambas formas de manejo de formularios.
  - Backend como fuente de verdad (en `TicketService` y `TourService`) para garantizar consistencia.
- **DTOs y `AppError`:** definen contratos de datos claros y centralizan el manejo de errores.
- **SweetAlert2:** usado para confirmaciones y mensajes claros al usuario.

### Diseño de API

- **Endpoints separados:**
  - `/api/admin/tours` para CRUD administrativo.
  - `/api/tickets/new` para el flujo de compra.
- **Handlers en `src/app/api/*`:** aprovecha la estructura del App Router para mantener cercanía entre UI y lógica del servidor.

### Consistencia

- La validación de cupos ocurre en el backend antes de crear el ticket.
- Se descuenta `availableSpots` inmediatamente después de la compra.
- En escenarios de alta concurrencia, se podría implementar transacciones o bloqueo optimista.

### Manejo de números y dinero

- Normalizo el total a 2 decimales en el servicio.
- En el cliente se muestra con `toLocaleString()` para mejor legibilidad.

### Seguridad y configuración

- Validaciones de tipo y tamaño de archivos antes de subirlos.
- Variables sensibles en `.env`.
- `AppError` evita exponer mensajes internos.

### Autenticación

Por ahora no incluí autenticación.  
Quise enfocarme primero en el flujo principal que era lo solicitado (listar tours, comprar y generar tickets).

### Migraciones

- Migraciones manejadas con Prisma (`migrate dev` y `migrate deploy`).

## Notas finales

- Preferí usar pocas librerías y solo las necesaria, por ejemplo, SweetAlert2 para manejar confirmaciones y alertas de forma más amigable sin tener que crear modales desde cero.
