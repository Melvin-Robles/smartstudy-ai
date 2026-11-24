# Data Model — Initial Conceptual Model

Entidades candidatas para validar en STEP 01:

- `User`: identidad y preferencias mínimas.
- `Document`: propiedad, metadatos, estado y referencia al objeto almacenado.
- `DocumentVersion`: hash, tipo, tamaño y versión del contenido.
- `TextChunk`: texto normalizado, posición y metadatos de origen.
- `GeneratedArtifact`: resumen o flashcard, esquema y trazabilidad.
- `StudySession`: sesión de práctica y métricas básicas.
- `StudyAttempt`: resultado de una interacción de práctica.
- `ProcessingJob`: estado, reintentos, correlación y errores.

La normalización, claves, índices, estrategia de borrado y uso de pgvector no están aprobados todavía.

