# SmartStudyAI

Monorepo de SmartStudyAI con instalaciones independientes.

## Estructura

- `frontend-smartstudy/`: aplicación Angular 22 y sus dependencias en `frontend-smartstudy/node_modules/`.
- `backend-smartstudy/`: API NestJS y sus dependencias en `backend-smartstudy/node_modules/`.
- `docs/`: documentación del proyecto.

## Instalación

Instala cada aplicación desde su propia carpeta:

```bash
cd frontend-smartstudy
npm install
```

```bash
cd ../backend-smartstudy
npm install
```

## Ejecución

Frontend:

```bash
cd frontend-smartstudy
npm start
```

Backend:

```bash
cd backend-smartstudy
npm run prisma:generate
npm run prisma:push
npm run start:dev
```

También puedes usar los scripts de la raíz, que delegan a cada carpeta sin instalar dependencias en la raíz:

```bash
npm run start:frontend
npm run dev:backend
```

El frontend usa `http://localhost:4200`, el backend `http://localhost:3000/api/v1` y Swagger `http://localhost:3000/docs`.
