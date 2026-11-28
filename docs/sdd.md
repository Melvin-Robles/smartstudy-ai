# SDD — Spec-Driven Development

## Propósito

Convertir cada necesidad de producto en una especificación aprobada antes de implementar.

## Plantilla obligatoria de una funcionalidad

- Objetivo y contexto.
- Alcance y exclusiones.
- Actores y permisos.
- Reglas de negocio.
- Historia de usuario con identificador y prioridad.
- Criterios de aceptación Given/When/Then.
- Flujo principal y flujos alternativos.
- Manejo de errores y estados.
- Contratos de entrada, salida y eventos.
- Restricciones técnicas y de seguridad.
- Dependencias y riesgos.
- Casos de prueba y trazabilidad.
- Definition of Done.

## Proceso de aprobación

1. Product Owner y Business Analyst validan el valor y el alcance.
2. Arquitectura valida límites, dependencias, seguridad y evolución.
3. QA valida la cobertura y la verificabilidad.
4. UI/UX valida accesibilidad y consistencia con UIKit cuando haya interfaz.
5. La especificación pasa a `APPROVED` solo con las observaciones críticas resueltas.

Una especificación no aprobada no autoriza implementación.

