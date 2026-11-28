# Backend MVP — Estado y uso

## Implementado

- API NestJS + TypeScript en `backend-smartstudy/`.
- Registro, inicio de sesión, contraseñas hasheadas y JWT.
- Aislamiento por propietario para documentos y sesiones.
- Carga y validación de PDF, DOCX y TXT.
- Estados `UPLOADED`, `PROCESSING`, `READY` y `FAILED`.
- Extracción y normalización de texto en segundo plano.
- Resúmenes y flashcards estructurados, validados antes de persistirse.
- Referencias de fuente, modelo y versión de prompt por artefacto.
- Sesión básica de práctica y registro de intentos.
- OpenAPI/Swagger en `/docs` y `/docs-json`.

## Limitaciones del MVP

- Usa SQLite y almacenamiento local para desarrollo.
- El procesamiento local usa `setImmediate`; producción requiere Redis/BullMQ persistente.
- La generación de IA requiere configurar `GEMINI_API_KEY` en `backend-smartstudy/.env`.
- OCR, RAG, cuestionarios avanzados, analítica, recomendaciones y frontend conectado al backend quedan pendientes.
