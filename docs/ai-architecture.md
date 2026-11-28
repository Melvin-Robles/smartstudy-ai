# AI Architecture

## Puertos de dominio/aplicación

- `DocumentTextExtractor`
- `OcrProcessor`
- `TextChunker`
- `EmbeddingProvider`
- `SemanticRetriever`
- `StructuredContentGenerator`
- `AnswerEvaluator`

Los nombres son contratos conceptuales para STEP 01; no representan código implementado.

## Pipeline propuesto

Upload → validación → extracción → OCR opcional → normalización → chunking → metadatos → embeddings → persistencia → generación → validación estructurada → persistencia de artefactos.

## Reglas de IA

1. El contenido generado debe incluir trazabilidad al documento y, cuando aplique, al fragmento fuente.
2. Si no existe evidencia suficiente, la respuesta debe declarar la limitación.
3. Los documentos del usuario se tratarán como datos no confiables; nunca podrán alterar las instrucciones del sistema.
4. Cada generación registrará modelo, proveedor, versión de prompt, esquema, timestamp y resultado de validación.
5. Los adaptadores de proveedor estarán fuera del dominio.
6. La evaluación de respuestas abiertas no podrá depender exclusivamente de similitud textual.

