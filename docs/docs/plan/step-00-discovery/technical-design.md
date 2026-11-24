# STEP 00 — Technical Design

## Decisiones de diseño

- Modular monolith como punto de partida.
- Frontend por capas Domain, Application, Infrastructure y Presentation.
- Proveedores de IA detrás de puertos y adaptadores.
- Procesamiento documental asíncrono y observable.
- Contratos API mediante OpenAPI.
- PostgreSQL, pgvector, Redis y almacenamiento S3-compatible como infraestructura prevista, pendiente de diseño y validación.

## Decisión pendiente principal

Seleccionar NestJS o FastAPI mediante ADR-0001. No se autoriza implementar el backend basándose únicamente en la recomendación provisional.

## Riesgos principales

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Alucinaciones de IA | Alto | grounding, esquemas, citas, evaluación y declaración de incertidumbre |
| Documentos maliciosos | Alto | validación, sandbox, límites y no confiar en instrucciones del documento |
| Coste/latencia de LLM | Medio/alto | límites, colas, cache, métricas y proveedores intercambiables |
| Aislamiento insuficiente | Crítico | autorización por recurso, pruebas negativas y revisión de seguridad |
| Alcance excesivo | Alto | MVP cerrado y gates formales |

