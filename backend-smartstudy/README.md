# SmartStudyAI Backend MVP

API modular en NestJS + TypeScript.

## Alcance

- Registro, inicio de sesión y JWT.
- Biblioteca privada por usuario.
- Carga y validación de PDF, DOCX y TXT.
- Extracción y normalización de texto en segundo plano.
- Estados `UPLOADED`, `PROCESSING`, `READY` y `FAILED`.
- Generación estructurada de resumen y flashcards con Google Gemini.
- Sesiones básicas de práctica y registro de intentos.
- Autorización por propietario en cada operación de documentos y sesiones.

## Configuración local

Requiere Node.js 22+.

```powershell
Copy-Item .env.example .env
npm install
npm run prisma:generate
npm run prisma:push
npm run start:dev
```

La API queda disponible en `http://localhost:3000/api/v1`.

### Google Gemini

Configura `GEMINI_API_KEY` en `backend-smartstudy/.env`. Puedes obtenerla desde Google AI Studio. El modelo se puede cambiar con `GEMINI_MODEL`; el valor inicial del ejemplo es `gemini-3.8-flash`. Si no se configura, la extracción de texto funciona y los endpoints de generación devuelven `503` explícitamente.

## Endpoints MVP

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/auth/register` | Registrar usuario |
| POST | `/auth/session` | Iniciar sesión |
| GET | `/auth/me` | Consultar usuario autenticado |
| GET | `/documents` | Listar documentos propios |
| POST | `/documents` | Subir archivo como multipart `file` |
| GET | `/documents/:id` | Consultar estado |
| DELETE | `/documents/:id` | Eliminar documento y derivados |
| POST | `/documents/:id/retry` | Reintentar procesamiento |
| POST | `/documents/:id/artifacts/summary` | Generar resumen |
| POST | `/documents/:id/artifacts/flashcards` | Generar flashcards |
| GET | `/documents/:id/artifacts` | Listar artefactos |
| POST | `/study-sessions` | Crear sesión de flashcards |
| POST | `/study-sessions/:id/attempts` | Registrar intento |
| GET | `/study-sessions/:id` | Consultar sesión |

## Nota de persistencia

El MVP local usa SQLite para arrancar sin infraestructura adicional. La capa de acceso está aislada en Prisma para migrar a PostgreSQL/pgvector en el Step 01/13 sin cambiar los contratos HTTP. El procesamiento en segundo plano local usa `setImmediate`; Redis/BullMQ debe conectarse antes de producción para persistencia de trabajos, reintentos y observabilidad distribuida.
