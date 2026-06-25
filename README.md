# Angular-Demo

Proyecto fullstack para gestión de servicios ACME. Backend con Express + MySQL y frontend en Angular.

## Arquitectura

```
├── backend-server/   # API REST (Express.js)
├── mi-app-modS/      # Frontend (Angular 21)
├── docker-compose.yml        # Producción
├── docker-compose.dev.yml    # Desarrollo
└── .env                      # Variables de entorno
```

**Servicios:**

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| `db` | 3307 → 3306 | MySQL 8.0 |
| `backend` | 3000 | API Express |
| `frontend` | 8001 → 80 | Angular (Nginx) |

## Requisitos previos

- Docker y Docker Compose v2
- Node.js >= 18 (solo para desarrollo sin Docker)

## Variables de entorno

Configurar el archivo `.env` en la raíz:

```env
DB_NAME=angular_db
DB_ROOT_PASSWORD=1234
DB_USER=admin
DB_PASSWORD=1234
DB_PORT=3307
```

## Levantar en producción

```bash
docker compose up -d --build
```

- Frontend: `http://localhost:8001`
- Backend API: `http://localhost:3000`
- MySQL: `localhost:3307`

## Levantar en desarrollo

```bash
docker compose -f docker-compose.dev.yml up -d --build
```

Usa `BUILD_CONFIG=development` para el frontend (sin optimizaciones, con source maps).

## Desarrollo local (sin Docker)

**Backend:**

```bash
cd backend-server
npm install
npm run seed    # Poblar base de datos con datos de prueba
node app.js
```

**Frontend:**

```bash
cd mi-app-modS
npm install --force
npm start
```

Frontend en `http://localhost:4200`, proxy API a `http://localhost:3000`.

## Credenciales de prueba

El seeder crea automáticamente los siguientes usuarios:

| Usuario | Email | Password | Rol |
|---------|-------|----------|-----|
| Admin | admin@acme.com | admin123 | admin |
| Miguel | miguel@gmail.com | miguel123 | admin |
| Test User | test@gmail.com | test123 | user |
| Carlos Garcia | carlos@gmail.com | carlos123 | user |
| Ana Lopez | ana@gmail.com | ana123 | user |

## Seeder de datos

El seeder (`backend-server/seed.js`) inserta datos iniciales:

- **12 productos** de tecnología con rating en escala 0-200
- **5 usuarios** con diferentes roles

### Ejecutar seed manualmente

```bash
cd backend-server
npm run seed
```

### Ejecutar seed en Docker

El seed se ejecuta automáticamente al levantar el contenedor backend.

## Comandos útiles

| Comando | Descripción |
|---------|-------------|
| `docker compose up -d --build` | Levantar todo (producción) |
| `docker compose -f docker-compose.dev.yml up -d --build` | Levantar todo (desarrollo) |
| `docker compose down` | Detener todos los servicios |
| `docker compose logs -f` | Ver logs en tiempo real |
| `docker compose down -v` | Detener y eliminar volúmenes (borra datos MySQL) |
| `cd backend-server && npm run seed` | Ejecutar seed manualmente |

## Estructura del frontend

```
mi-app-modS/src/app/
├── features/
│   ├── auth/          # Login, guards
│   ├── dashboards/    # Gráficos NGX-Charts
│   ├── home/          # Bienvenida
│   ├── maps/          # Google Maps interactivo
│   ├── products/      # CRUD productos + paginación
│   └── users/         # Gestión de usuarios
├── shared/            # Pipes y utilidades
├── app.routes.ts      # Rutas
└── app.config.ts      # Configuración
```

## Stack tecnológico

- **Frontend:** Angular 21, Bootstrap 5, Google Maps, NGX-Charts
- **Backend:** Express.js, MySQL 8.0, JWT, bcrypt
- **Infraestructura:** Docker, Nginx
