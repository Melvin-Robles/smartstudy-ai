# Architecture Overview

## Decisión base

Se propone comenzar con un **Modular Monolith** y separar módulos por dominio. No se introducirán microservicios hasta que existan necesidades demostradas de escalado, aislamiento o despliegue independiente.

## Capas

- **Domain:** entidades, value objects, reglas y puertos; sin Angular, HTTP, base de datos ni proveedor de IA.
- **Application:** casos de uso, comandos, consultas, políticas y coordinación de puertos.
- **Infrastructure:** persistencia, colas, almacenamiento, extracción, proveedores LLM/embeddings y adaptadores HTTP.
- **Presentation:** componentes Angular, rutas, formularios, estados de UI y composición de casos de uso.

## Módulos iniciales

Identity, Documents, Processing, AI Generation, Study Sessions y Shared/UIKit. La separación física y los nombres definitivos se decidirán en STEP 01.

## Backend seleccionado

El backend del MVP usa **Node.js + TypeScript + NestJS** como modular monolith. Los módulos iniciales son Identity, Documents, Processing, AI Generation y Study Sessions.

La integración de IA se mantiene detrás de un adaptador y se configura mediante `GEMINI_API_KEY`. El MVP ejecuta el procesamiento fuera del ciclo HTTP; Redis/BullMQ queda previsto para persistencia de trabajos y reintentos en producción. Ver [ADR-0001](./adrs/ADR-0001-backend-selection-pending.md).

## Dependencias de infraestructura previstas

PostgreSQL, pgvector, Redis, almacenamiento compatible con S3 y Docker son infraestructura objetivo. El MVP implementa SQLite local, almacenamiento local y OpenAPI/Swagger.

