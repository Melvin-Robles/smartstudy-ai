# TDD — Test-Driven Development

## Ciclo obligatorio

### RED

Definir un caso de comportamiento observable y escribir una prueba que falle por la ausencia del comportamiento. La prueba debe estar vinculada a una historia y criterio de aceptación.

### GREEN

Implementar la solución mínima que hace pasar la prueba, sin añadir alcance no especificado.

### REFACTOR

Mejorar diseño, nombres, duplicación, seguridad y mantenibilidad manteniendo todas las pruebas en verde.

## Cobertura por riesgo

- Dominio y casos de uso: unit tests.
- Persistencia, colas y proveedores: integration tests.
- Frontend y UIKit: component tests y pruebas de accesibilidad.
- API y adaptadores: contract tests.
- Flujos críticos: E2E.
- Aislamiento, carga de archivos, secretos y prompt injection: security tests.

## IA

Separar pruebas deterministas de evaluaciones probabilísticas. Validar esquema, referencias de fuente, comportamiento ante evidencia insuficiente y resistencia a instrucciones maliciosas. Registrar modelo, prompt, dataset/evaluación y versión de criterios.

## Evidencia

Un reporte debe indicar comando, fecha, resultado, alcance, fallos y artefactos. Si una prueba no se ejecutó, debe permanecer como `NOT RUN`.

