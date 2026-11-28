# SmartStudyAI API — Contratos del MVP

Documentación de los endpoints implementados en `backend-smartstudy`.

## Datos generales

- **Base URL local:** `http://localhost:3000/api/v1`
- **Swagger UI:** `http://localhost:3000/docs`
- **OpenAPI JSON:** `http://localhost:3000/docs-json`
- **Formato:** JSON, excepto la carga de documentos.
- **Fechas:** ISO 8601, por ejemplo `2026-11-28T12:30:00.000Z`.
- **IDs:** cadenas generadas por el backend.

## Headers

### Endpoints públicos

Para registro e inicio de sesión:

```http
Content-Type: application/json
```

### Endpoints protegidos

Todos los endpoints de documentos y sesiones requieren el token devuelto por `/auth/register` o `/auth/session`:

```http
Authorization: Bearer <accessToken>
```

Para requests JSON protegidos también se usa:

```http
Content-Type: application/json
```

### Carga de documentos

```http
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data
```

El campo del archivo debe llamarse `file`. En Angular, al enviar `FormData`, no se debe establecer manualmente el header `Content-Type`; el navegador agrega el boundary automáticamente.

## Autenticación

### `POST /auth/register`

Crea una cuenta y devuelve un JWT.

#### Body

```json
{
  "email": "demo@smartstudy.local",
  "password": "SmartStudyDemo123!"
}
```

Reglas:

- `email` debe tener formato de correo válido.
- `password` debe tener al menos 8 caracteres.
- El correo se guarda en minúsculas.

#### Respuesta `201 Created`

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "cm123abc",
    "email": "demo@smartstudy.local"
  }
}
```

#### Errores frecuentes

- `400`: body inválido.
- `409`: el correo ya está registrado.

### `POST /auth/session`

Inicia sesión y devuelve un JWT.

#### Body

```json
{
  "email": "demo@smartstudy.local",
  "password": "SmartStudyDemo123!"
}
```

#### Respuesta `201 Created`

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "cm123abc",
    "email": "demo@smartstudy.local"
  }
}
```

#### Errores frecuentes

- `400`: body inválido.
- `401`: correo o contraseña inválidos.

### `GET /auth/me`

Devuelve el usuario autenticado.

#### Headers

```http
Authorization: Bearer <accessToken>
```

#### Respuesta `200 OK`

```json
{
  "id": "cm123abc",
  "email": "demo@smartstudy.local"
}
```

## Documentos

### `GET /documents`

Lista los documentos del usuario autenticado.

#### Respuesta `200 OK`

```json
[
  {
    "id": "cm456doc",
    "originalName": "introduccion.pdf",
    "mimeType": "application/pdf",
    "sizeBytes": 245760,
    "status": "READY",
    "failureReason": null,
    "createdAt": "2026-11-28T12:30:00.000Z",
    "updatedAt": "2026-11-28T12:30:05.000Z"
  }
]
```

### `POST /documents`

Sube un documento y comienza su procesamiento de texto en segundo plano.

#### Headers

```http
Authorization: Bearer <accessToken>
Content-Type: multipart/form-data
```

#### Form data

```text
file: introduccion.pdf
```

Formatos permitidos:

- `.pdf`
- `.docx`
- `.txt`

Tamaño máximo actual: `10 MB`.

#### Respuesta `201 Created`

```json
{
  "id": "cm456doc",
  "originalName": "introduccion.pdf",
  "mimeType": "application/pdf",
  "sizeBytes": 245760,
  "status": "UPLOADED",
  "failureReason": null,
  "createdAt": "2026-11-28T12:30:00.000Z",
  "updatedAt": "2026-11-28T12:30:00.000Z"
}
```

El procesamiento posterior cambia el estado a `PROCESSING` y luego a `READY` o `FAILED`.

#### Ejemplo con PowerShell

```powershell
curl.exe -X POST http://localhost:3000/api/v1/documents `
  -H "Authorization: Bearer <accessToken>" `
  -F "file=@C:\ruta\introduccion.pdf"
```

### `GET /documents/:id`

Consulta el estado y metadatos de un documento propio.

#### Respuesta `200 OK`

```json
{
  "id": "cm456doc",
  "originalName": "introduccion.pdf",
  "mimeType": "application/pdf",
  "sizeBytes": 245760,
  "status": "READY",
  "failureReason": null,
  "createdAt": "2026-11-28T12:30:00.000Z",
  "updatedAt": "2026-11-28T12:30:05.000Z"
}
```

### Estados de documento

| Estado | Significado |
|---|---|
| `UPLOADED` | Archivo guardado, pendiente de extracción. |
| `PROCESSING` | El backend está extrayendo el texto. |
| `READY` | El documento puede generar resumen y flashcards. |
| `FAILED` | La extracción falló; revisar `failureReason` o reintentar. |

### `POST /documents/:id/retry`

Reinicia el procesamiento de un documento que falló.

#### Body

No requiere body.

#### Respuesta `200 OK`

Devuelve el documento nuevamente con estado `UPLOADED` o `PROCESSING`:

```json
{
  "id": "cm456doc",
  "originalName": "introduccion.pdf",
  "mimeType": "application/pdf",
  "sizeBytes": 245760,
  "status": "UPLOADED",
  "failureReason": null,
  "createdAt": "2026-11-28T12:30:00.000Z",
  "updatedAt": "2026-11-28T12:35:00.000Z"
}
```

### `DELETE /documents/:id`

Elimina el documento, sus artefactos y el archivo almacenado.

#### Respuesta `200 OK`

```json
{
  "deleted": true
}
```

## Generación de contenido con Gemini

El documento debe tener estado `READY` antes de llamar estos endpoints. El backend procesa como máximo los primeros 100,000 caracteres del texto extraído.

### `POST /documents/:id/artifacts/summary`

Genera un resumen estructurado en español, con puntos clave y referencias al documento.

#### Body

No requiere body.

#### Respuesta `201 Created`

```json
{
  "id": "cm789summary",
  "type": "SUMMARY",
  "payload": {
    "summary": "El documento explica los conceptos principales...",
    "keyPoints": [
      "Primer concepto importante.",
      "Segundo concepto importante."
    ],
    "sourceRefs": [
      {
        "quote": "Cita breve y verificable del documento.",
        "location": "Página 2"
      }
    ]
  }
}
```

### `POST /documents/:id/artifacts/flashcards`

Genera flashcards estructuradas en español.

#### Body

No requiere body.

#### Respuesta `201 Created`

```json
{
  "id": "cm789cards",
  "type": "FLASHCARDS",
  "payload": {
    "flashcards": [
      {
        "question": "¿Cuál es el concepto principal?",
        "answer": "El concepto principal es...",
        "explanation": "Esto significa que...",
        "sourceRef": {
          "quote": "Cita breve y verificable del documento.",
          "location": "Página 2"
        }
      }
    ]
  }
}
```

### `GET /documents/:id/artifacts`

Lista los resúmenes y flashcards generados para un documento.

#### Respuesta `200 OK`

```json
[
  {
    "id": "cm789summary",
    "type": "SUMMARY",
    "payload": {
      "summary": "El documento explica los conceptos principales...",
      "keyPoints": ["Primer concepto importante."],
      "sourceRefs": [
        { "quote": "Cita breve y verificable.", "location": "Página 2" }
      ]
    },
    "model": "gemini-3.5-flash-lite",
    "promptVersion": "v1",
    "createdAt": "2026-11-28T12:40:00.000Z"
  }
]
```

#### Errores frecuentes de generación

- `404`: documento inexistente o perteneciente a otro usuario.
- `503`: documento no listo, `GEMINI_API_KEY` ausente, cuota agotada o proveedor no disponible.
- `502`: Gemini rechazó la solicitud o devolvió un resultado que el backend no pudo procesar.

## Sesiones de estudio

### `POST /study-sessions`

Crea una sesión usando las últimas flashcards generadas para un documento.

#### Body

```json
{
  "documentId": "cm456doc"
}
```

#### Respuesta `201 Created`

```json
{
  "id": "cm999session",
  "documentId": "cm456doc",
  "artifactId": "cm789cards",
  "totalCards": 10,
  "createdAt": "2026-11-28T12:45:00.000Z"
}
```

#### Errores frecuentes

- `400`: no existen flashcards generadas para el documento.
- `404`: documento inexistente, de otro usuario o todavía no listo.

### `GET /study-sessions/:id`

Consulta una sesión y sus intentos registrados.

#### Respuesta `200 OK`

```json
{
  "id": "cm999session",
  "documentId": "cm456doc",
  "artifactId": "cm789cards",
  "totalCards": 10,
  "attempts": [
    {
      "id": "cmattempt1",
      "sessionId": "cm999session",
      "cardIndex": 0,
      "correct": true,
      "createdAt": "2026-11-28T12:46:00.000Z"
    }
  ],
  "createdAt": "2026-11-28T12:45:00.000Z"
}
```

### `POST /study-sessions/:id/attempts`

Registra la respuesta del usuario para una flashcard.

#### Body

```json
{
  "cardIndex": 0,
  "correct": true
}
```

`cardIndex` comienza en `0` y no puede ser mayor que el número de flashcards menos uno.

#### Respuesta `201 Created`

```json
{
  "id": "cmattempt1",
  "sessionId": "cm999session",
  "cardIndex": 0,
  "correct": true,
  "createdAt": "2026-11-28T12:46:00.000Z"
}
```

## Respuestas de error

NestJS devuelve los errores con esta estructura general:

```json
{
  "message": "Descripción del error",
  "error": "Bad Request",
  "statusCode": 400
}
```

En errores de validación, `message` puede ser un arreglo:

```json
{
  "message": [
    "email must be an email",
    "password must be longer than or equal to 8 characters"
  ],
  "error": "Bad Request",
  "statusCode": 400
}
```

Errores comunes:

| Código | Significado |
|---:|---|
| `400` | Body, archivo o parámetro inválido. |
| `401` | Falta el Bearer token o es inválido/expiró. |
| `404` | Recurso inexistente o no pertenece al usuario. |
| `409` | Conflicto, normalmente correo ya registrado. |
| `413` | Archivo mayor al límite permitido. |
| `502` | El proveedor de IA rechazó o no procesó la solicitud. |
| `503` | Servicio temporalmente no disponible o configuración incompleta. |

## Flujo recomendado del frontend

1. Registrar o iniciar sesión.
2. Guardar `accessToken` y enviarlo como Bearer token.
3. Subir el documento con `multipart/form-data`.
4. Consultar `GET /documents/:id` hasta obtener `READY` o `FAILED`.
5. Generar resumen o flashcards.
6. Crear una sesión con `POST /study-sessions`.
7. Registrar cada respuesta con `POST /study-sessions/:id/attempts`.
