# Product Scope

## MVP recomendado

El MVP debe demostrar un ciclo vertical completo y medible:

1. Crear una cuenta e iniciar/cerrar sesión.
2. Subir un PDF, DOCX o TXT a una biblioteca privada.
3. Validar el archivo y mostrar el estado de procesamiento.
4. Extraer y normalizar texto; informar claramente si el documento no es procesable.
5. Generar un resumen estructurado y fundamentado en el documento.
6. Generar flashcards estructuradas con referencia al contenido fuente.
7. Resolver una sesión básica de flashcards y registrar el resultado.
8. Eliminar el documento y sus artefactos derivados según la política de retención.

## Fuera del MVP

- Chat RAG conversacional.
- OCR de documentos escaneados.
- Cuestionarios avanzados y evaluación de preguntas abiertas.
- Repetición espaciada avanzada.
- Recomendaciones personalizadas.
- Analítica avanzada y detección de debilidades.
- Multi-tenancy, colaboración y roles administrativos.
- Integración con múltiples proveedores de almacenamiento o LLM en producción.

Estas capacidades permanecen en el roadmap porque dependen de contratos, telemetría y validaciones que el MVP debe establecer primero.

## Criterio de éxito del MVP

Un usuario nuevo debe poder cargar un documento, recibir un resumen y flashcards válidos, practicar y eliminar sus datos sin acceder a información de otro usuario. La experiencia debe ser observable, recuperable ante fallos y verificable mediante pruebas automatizadas.

