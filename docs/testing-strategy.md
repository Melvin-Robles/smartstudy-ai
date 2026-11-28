# Testing Strategy

## Pirámide

1. **Unit:** reglas de dominio, casos de uso, validadores y transformaciones.
2. **Integration:** persistencia, colas, almacenamiento y adaptadores con dependencias controladas.
3. **Component:** comportamiento accesible y estados de componentes UIKit/features.
4. **Contract:** compatibilidad entre API, frontend y adaptadores de IA.
5. **End-to-end:** flujos críticos de autenticación, carga, procesamiento, generación y práctica.
6. **Security:** autorización, aislamiento, carga maliciosa, rate limiting, secretos y prompt injection.

## TDD

Cada historia sigue RED → GREEN → REFACTOR. No se acepta una prueba declarada como ejecutada si no existe evidencia de ejecución en el informe del Step.

## Calidad de IA

Las pruebas deben distinguir validación estructural, grounding/citas, seguridad frente a instrucciones maliciosas y calidad educativa. Las evaluaciones de modelo se versionarán y no reemplazarán las pruebas deterministas.

