# ADR-0001 — Selección del backend

- **Estado:** Proposed / Pending approval
- **Fecha:** 2026-11-18
- **Contexto:** El backend de SmartStudyAI aún no está definido.

## Alternativas

### NestJS

Ventajas: coherencia de lenguaje con Angular, estructura modular, inyección de dependencias, buen soporte para APIs empresariales y testing.

Desventajas: el ecosistema de procesamiento documental, OCR y modelos de IA puede requerir servicios Python adicionales o integración menos directa.

### FastAPI

Ventajas: integración natural con procesamiento documental, OCR, embeddings y librerías de IA; tipado y contratos OpenAPI; testing sencillo.

Desventajas: introduce un segundo lenguaje frente al frontend, exige disciplina arquitectónica y puede aumentar la variedad operativa.

## Recomendación provisional

Evaluar primero FastAPI para un modular monolith orientado a IA, manteniendo NestJS como alternativa válida si el equipo prioriza homogeneidad TypeScript y el procesamiento de IA se encapsula detrás de adaptadores o workers.

## Criterio de decisión

La selección debe basarse en una matriz ponderada y un spike técnico no productivo que cubra autenticación, contrato OpenAPI, job asíncrono, extracción de texto y una generación estructurada simulada.

