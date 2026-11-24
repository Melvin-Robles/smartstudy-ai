# Non-Functional Requirements

| ID | Categoría | Requisito verificable |
|---|---|---|
| NFR-001 | Seguridad | Todas las operaciones de documentos deben autorizarse por identidad y propiedad del recurso. |
| NFR-002 | Seguridad | No se almacenarán secretos, tokens ni credenciales en el repositorio. |
| NFR-003 | Seguridad | La carga validará extensión, MIME real, tamaño, contenido y nombre seguro. |
| NFR-004 | Privacidad | Debe existir política explícita de retención, eliminación y uso de documentos para IA. |
| NFR-005 | IA | Las salidas deben validarse contra esquemas estructurados antes de persistirse. |
| NFR-006 | IA | El dominio no debe depender de un proveedor concreto de LLM o embeddings. |
| NFR-007 | Calidad | El código debe usar TypeScript strict, lint, formato consistente y pruebas automatizadas. |
| NFR-008 | Accesibilidad | La UI objetivo debe cumplir WCAG 2.2 AA en teclado, foco, contraste y lectores de pantalla. |
| NFR-009 | Observabilidad | Cada procesamiento debe tener correlación, estado, duración, error categorizado y métricas. |
| NFR-010 | Resiliencia | Los trabajos asíncronos deben ser reintentables, idempotentes y tener límite de reintentos. |
| NFR-011 | Rendimiento | Las operaciones largas no deben bloquear la interacción del usuario; se comunicarán mediante estados. |
| NFR-012 | Evolución | La API debe versionarse y publicarse mediante contrato OpenAPI. |

