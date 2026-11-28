# ADR-0001 — Selección del backend

- **Estado:** Accepted
- **Fecha de propuesta:** 2026-11-18
- **Fecha de aceptación:** 2026-11-27
- **Contexto:** El backend de SmartStudyAI aún no está definido.

## Alternativas

### NestJS

Ventajas: coherencia de lenguaje con Angular, estructura modular, inyección de dependencias, buen soporte para APIs empresariales y testing.

Desventajas: el ecosistema de procesamiento documental, OCR y modelos de IA puede requerir servicios Python adicionales o integración menos directa.

### FastAPI

Ventajas: integración natural con procesamiento documental, OCR, embeddings y librerías de IA; tipado y contratos OpenAPI; testing sencillo.

Desventajas: introduce un segundo lenguaje frente al frontend, exige disciplina arquitectónica y puede aumentar la variedad operativa.

## Decisión

Se selecciona **Node.js + TypeScript + NestJS** como backend del MVP y base del modular monolith.

La generación de IA se encapsula detrás de un servicio de aplicación para mantener el dominio desacoplado del proveedor. Si OCR, modelos locales o cargas CPU-intensivas lo requieren, se podrán añadir workers especializados sin cambiar los contratos HTTP.

El MVP local usa SQLite mediante Prisma. La migración prevista para producción es PostgreSQL, con pgvector cuando se implemente RAG.

## Criterio de decisión

La decisión queda validada por el MVP inicial, que cubre autenticación, OpenAPI, carga y extracción de PDF/DOCX/TXT, estados de procesamiento y generación estructurada opcional con Google Gemini.

