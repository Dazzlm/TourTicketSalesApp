# TourTicketSalesApp

Aplicación full‑stack para la gestión y venta de tiquetes de tours. Incluye panel administrativo para CRUD de tours, compra con validación de cupos, búsqueda/creación de usuarios y registro de tickets. Construida con Next.js App Router, Prisma y PostgreSQL. Carga de imágenes en Cloudinary y UI con Tailwind.

## Características

- Landing de tours con filtrado por cupos disponibles.
- Detalle del tour con control de cantidad y cálculo de total.
- Flujo de compra con:
  - Búsqueda de usuario por cédula.
  - Creación de usuario si no existe.
  - Confirmación de compra y creación de ticket.
  - Descuento automático de cupos del tour.
- Panel Admin:
  - Listado, creación, edición y eliminación de tours.
  - Historial de compras de tickets.
- Subida de imágenes a Cloudinary con validaciones (tipo/size).
- API modular con controlador/servicio/repositorio/DTOs.
- Prisma para ORM y migraciones. PostgreSQL como base de datos.
- SweetAlert2 para confirmaciones y feedback.

## Stack técnico

- Next.js 15 (App Router) + React 19
- TypeScript 5, ESLint 9, Tailwind CSS 4
- Prisma 6, PostgreSQL
- Cloudinary (carga de imágenes)
- SweetAlert2, react-hook-form, lucide-react

## Reglas/validaciones clave

- availableSpots no puede superar capacity (al crear/actualizar tour).
- Al crear ticket:
  - Debe existir el tour y tener suficientes cupos.
  - Se calcula total.
  - Se descuenta availableSpots = availableSpots - quantity.
- Carga de imagen sólo si el archivo es image/\* y <= 25MB.

## Decisiones de arquitectura

- Capas separadas: Controller -> Service -> Repository -> Prisma. Los DTOs tipan entradas/salidas y AppError centraliza errores operacionales.
- Uso de Cloudinary para evitar servir y gestionar archivos en el servidor. Se sube mediante upload_stream con streamifier.
- En UI se usa SweetAlert2 para confirmaciones/feedback. En formularios se emplea react-hook-form para validación y manejo de estado.
- App Router de Next.js con handlers por carpeta para mantener proximidad entre UI y API.

## Requisitos previos

- Node.js 18+
- PostgreSQL accesible y cadena de conexión
- Cuenta de Cloudinary para almacenar imágenes

## Variables de entorno

Crea un archivo `.env` en la raíz con:

```
DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DB?schema=public"
CLOUDINARY_CLOUD_NAME="tu_cloud_name"
CLOUDINARY_API_KEY="tu_api_key"
CLOUDINARY_API_SECRET="tu_api_secret"
```

## Guía rápida (Windows/PowerShell)

Paso 0 — (comprobaciones)

- Node 18 o 20 instalado: `node -v`
- Base de datos (puerto, usuario, password)
- Cuenta de Cloudinary con clave secreta

Paso 1 — Clonar e instalar

```powershell
git clone https://github.com/Dazzlm/TourTicketSalesApp.git
cd TourTicketSalesApp
```

```powershell
npm install
```

Paso 2 — Configurar variables de entorno
Crea `.env` en la raíz con:

```dotenv
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DB?schema=public"
CLOUDINARY_CLOUD_NAME="tu_cloud_name"
CLOUDINARY_API_KEY="tu_api_key"
CLOUDINARY_API_SECRET="tu_api_secret"
```

Paso 3 — Preparar Prisma y base de datos

```powershell
npx prisma generate
npx prisma migrate deploy
```

```powershell
npx prisma migrate dev --name init
```

Paso 4 — Ejecutar en desarrollo

```powershell
npm run dev
```

Paso 5 — Verificar

- App: http://localhost:3000
- Admin tours: http://localhost:3000/admin/tours
- Crear un tour en /admin/tours/new (necesita Cloudinary)

## Scripts disponibles

- dev: `next dev --turbopack`
- build: `next build --turbopack`
- start: `next start`
- lint: `eslint`

## Endpoints (resumen)

- GET `/api/admin/tours` → Lista de tours (admin) [TourController.list]
- POST `/api/admin/tours` → Crear tour (multipart/form-data con image) [TourController.create]
- GET `/api/admin/tours/:id` → Obtener tour por id [TourController.get]
- PUT `/api/admin/tours/:id` → Actualizar tour (multipart/form-data opcional image) [TourController.update]
- DELETE `/api/admin/tours/:id` → Eliminar tour [TourController.remove]
- GET `/api/tours/:id` → Obtener tour público por id
- POST `/api/tickets/new` → Crear ticket { tourId, quantity, cedula, name?, email?, total? }

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

## Notas y decisiones específicas

- Precio maneja Decimal en BD pero en el cliente se trata como número. En el servicio de tickets se normaliza a 2 decimales para el total.
- availableSpots se valida en servicios y también en formularios del cliente para mejorar UX, pero la fuente de verdad está en el backend.
- Carga de imágenes al crear/editar tour: si no se adjunta imagen en edición, se conserva la existente.
- La carpeta `public/uploads/` quedó disponible por si en un futuro se desea almacenamiento local, pero actualmente se usa Cloudinary.

## Error comun

- Error al iniciar `npm run dev`:
  - Verifica que `.env` tenga `DATABASE_URL` válido y que la BD esté accesible.
  - Ejecuta `npx prisma generate` y `npx prisma migrate deploy`.
  - Asegúrate de tener variables de Cloudinary si vas a crear/editar tours con imagen.

## Decisiones

Estas son las decisiones más relevantes.

## Enrutamiento y estructura

- App Router de Next.js: permite co-localizar UI y handlers de API por ruta. Esto mejora el mantenimiento al tener UI y endpoint cerca (por ejemplo, `src/app/admin/tours` y `src/app/api/admin/tours`).
- Capas en backend (Controller → Service → Repository): separa responsabilidades. Los controllers orquestan HTTP/NextResponse, los services contienen reglas de negocio (validaciones, flujos), y los repositories interactúan con Prisma. Esto facilita pruebas y evita mezclar HTTP con lógica de dominio.
- DTOs: los tipos en `src/server/dtos` documentan contratos de entrada/salida y endurecen el tipado con TypeScript estricto.
- Manejo de errores con `AppError`: centraliza errores operacionales con `status` y `message`. Los controllers traducen a respuestas HTTP.

## Gestión de datos y Prisma

- PostgreSQL + Prisma: PostgreSQL es robusto para integridad (FKs, cascadas) y Prisma acelera productividad con tipado e introspección.
- PrismaClient singleton (`src/lib/prisma.ts`): evita crear múltiples conexiones en desarrollo (hot reload) y reduce fugas. Se activa logging de queries en dev para depurar.
- Tipos numéricos: `price` y `total` son `Decimal(10,2)` en BD para precisión financiera. En frontend se manejan como `number` y se formatean, y en servicios se normaliza el total a 2 decimales para evitar errores por punto flotante.
- Reglas de negocio en service: `availableSpots <= capacity` y validación de cupos al comprar viven en `TourService`/`TicketService` para garantizar consistencia incluso si cambian los clientes.

## Almacenamiento de imágenes

- Cloudinary vs disco local: se eligió Cloudinary para evitar servir archivos desde el servidor, simplificar CDN/caching y reducir responsabilidad de almacenamiento local. La carpeta `public/uploads/` queda como alternativa futura.
- Subida por stream (`upload_stream` + `streamifier`): evita cargar la imagen completa en memoria y es más eficiente para archivos grandes.
- Validaciones de archivo: sólo `image/*` y tamaño ≤ 25MB para mejorar seguridad y UX.

## Diseño de la API

- Handlers por ruta en `src/app/api/*`: siguen convenciones del App Router. Los handlers delegan a controllers para mantener el código testable.
- Rutas de tours admin: `/api/admin/tours` y `/api/admin/tours/[id]` agrupan CRUD administrativo. La obtención pública del tour está en `/api/tours/[id]`.
- Tickets: se usó `POST /api/tickets/new` para distinguir el flujo de compra (simple y explícito).
- Usuarios: búsqueda/creación por cédula simplifica el flujo de compra; el service `UserService.findOrCreate` elimina la necesidad de lógica duplicada.
- Respuestas y errores: controllers capturan `AppError` y responden con el `status` adecuado. Esto evita filtrar mensajes internos y estandariza el contrato de error.

## Flujo de compra y consistencia

- Validación de cupos en backend: aunque el cliente limita la cantidad, la validación real esta en `TicketService` para prevenir inconsistencias.
- Actualización de cupos tras compra: el service descuenta `availableSpots` inmediatamente después de crear el ticket.
- Confirmación con modal (SweetAlert2): revisión final del total antes de continuar la compra y reduce compras por error.

## Estado y render en el frontend

- Páginas client-side (`"use client"`): las vistas clave usan estado/efectos, navegación del cliente y modales, por eso se marcan como cliente.
- Estrategia de estado al cargar listas: en admin (`/admin/tours`) se usa `tours: Tour[] | null` para distinguir “cargando” (null) de “sin datos” ([]). En Home se usa `[]` + `loading: true` para un patrón clásico. Se muestran ambos enfoques a propósito.
- Formateo de números: `toLocaleString()` para precio y totales, buscando legibilidad.

## Validación de formularios

- Admin (crear/editar tour): `react-hook-form` usado para validaciones y mensajes claros.
- Compra (BuyerForm): validación ligera manual (regex y longitudes). M
- Doble validación (cliente + servidor).

## UX y feedback

- SweetAlert2: confirmaciones y unificación de mensajes.
- Componentización: `PurchaseSummary` y `BuyerForm` separan responsabilidades y se evita la contruccion de un solo componente muy grande `en Purchase`.

## Seguridad y configuración

- Variables de entorno: credenciales y URLs sensibles no viven en el repositorio. Cloudinary se configura con `CLOUDINARY_*`.
- Sin auth ni login: se priorizó la funcionalidad principal y detallada de los requisitos solicitados.
- Validación de tipos de archivo y tamaño: mitiga riesgos al subir contenido.

## Alternativas consideradas

- Almacenamiento local de imágenes: Inicialmente se hizo de forma local cargando las imagenes y por tema de despliegue lo migre a Cloudinary.
