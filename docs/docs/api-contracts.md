# API Contracts — Initial Scope

Los contratos definitivos se diseñarán en STEP 01 y se publicarán mediante OpenAPI.

## Operaciones MVP candidatas

| Operación | Propósito |
|---|---|
| `POST /auth/register` | Crear identidad |
| `POST /auth/session` | Iniciar sesión |
| `GET /documents` | Listar documentos propios |
| `POST /documents` | Crear carga de documento |
| `GET /documents/{id}` | Consultar estado y metadatos |
| `DELETE /documents/{id}` | Eliminar documento y derivados |
| `GET /documents/{id}/artifacts` | Consultar resumen y flashcards |
| `POST /study-sessions` | Iniciar práctica |
| `POST /study-sessions/{id}/attempts` | Registrar intento |

No se implementan endpoints como parte de STEP 00.

