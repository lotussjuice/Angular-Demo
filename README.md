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
node app.js
```

**Frontend:**

```bash
cd mi-app-modS
npm install
npm start
```

Frontend en `http://localhost:4200`, proxy API a `http://localhost:3000`.

## Comandos útiles

| Comando | Descripción |
|---------|-------------|
| `docker compose up -d --build` | Levantar todo (producción) |
| `docker compose -f docker-compose.dev.yml up -d --build` | Levantar todo (desarrollo) |
| `docker compose down` | Detener todos los servicios |
| `docker compose logs -f` | Ver logs en tiempo real |
| `docker compose down -v` | Detener y eliminar volúmenes (borra datos MySQL) |

## Estructura del frontend

```
mi-app-modS/src/app/
├── features/
│   ├── auth/          # Login, guards
│   ├── home/          # Bienvenida
│   ├── maps/          # Google Maps interactivo
│   ├── products/      # CRUD productos + paginación
│   └── users/         # Gestión de usuarios
├── shared/            # Pipes y utilidades
├── app.routes.ts      # Rutas
└── app.config.ts      # Configuración
```

## Stack tecnológico

- **Frontend:** Angular 21, Bootstrap 5, Google Maps, ngx-pagination
- **Backend:** Express.js, MySQL 8.0
- **Infraestructura:** Docker, Nginx
