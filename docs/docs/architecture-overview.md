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

## Backend pendiente

No se ha seleccionado NestJS ni FastAPI. La decisión debe registrarse en un ADR después de comparar mantenibilidad, integración con IA, escalabilidad, ecosistema, testing y operación. La recomendación provisional para evaluar primero es FastAPI por su cercanía al ecosistema Python de procesamiento documental e IA; no es una decisión aprobada.

## Dependencias de infraestructura previstas

PostgreSQL, pgvector, Redis, almacenamiento compatible con S3, Docker y OpenAPI. Ninguna se considera implementada por este documento.

