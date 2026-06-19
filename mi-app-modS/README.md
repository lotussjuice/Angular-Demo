# mi-app-modS

Aplicación Angular con autenticación, productos, usuarios, paginación y mapa interactivo con Google Maps.

## Requisitos previos

- Node.js >= 18
- npm >= 9

## Instalación

```bash
npm install
```

## Ejecución en desarrollo (local)

```bash
npm start
```

La aplicación se levanta en `http://localhost:4200` con hot-reload.

Se usa `src/environments/environment.development.ts` que apunta el backend a `http://localhost:3000`.

## Ejecución con Docker

Desde la raíz del proyecto:

```bash
# Producción
docker compose up -d --build

# Desarrollo
docker compose -f docker-compose.dev.yml up -d --build
```

- Frontend: `http://localhost:8001`
- Backend: `http://localhost:3000`

## Build estático

```bash
npm run build
```

Genera archivos optimizados en `dist/mi-app-modS/browser/`.

## Estructura del proyecto

```
src/app/
├── features/
│   ├── auth/          # Login, servicio de autenticación, guards
│   ├── home/          # Pantalla de bienvenida
│   ├── maps/          # Mapa interactivo con Google Maps
│   ├── not-found/     # Página 404
│   ├── numbers/       # Fichas de productos
│   ├── products/      # CRUD de productos con paginación
│   └── users/         # Gestión de usuarios
├── shared/            # Pipes y utilidades compartidas
├── app.routes.ts      # Rutas principales
├── app.config.ts      # Configuración de la aplicación
└── app.html           # Layout principal (sidebar + router-outlet)
```

## Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm start` | Servidor de desarrollo en `localhost:4200` |
| `npm run build` | Build de producción |
| `npm run build -- --configuration development` | Build sin optimizaciones (debug) |
| `npm test` | Tests unitarios (Vitest) |
| `npm run watch` | Build con watch |
