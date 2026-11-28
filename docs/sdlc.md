# SDLC — SmartStudyAI

## Propósito

Establecer el ciclo obligatorio para descubrir, diseñar, construir, verificar y cerrar cada funcionalidad sin perder trazabilidad ni calidad.

## Fases obligatorias

1. **Discovery:** problema, actores, objetivos, riesgos y alcance.
2. **Requirements Analysis:** requisitos funcionales, no funcionales, reglas y restricciones.
3. **Specification:** historias, criterios Given/When/Then, contratos y flujos alternativos.
4. **Architecture & Design:** límites, dependencias, decisiones, seguridad y observabilidad.
5. **Test Design:** casos positivos, negativos, límites, integración, seguridad y E2E.
6. **Implementation:** desarrollo incremental guiado por pruebas y dentro del Step aprobado.
7. **Verification:** pruebas ejecutadas, lint, build, accesibilidad, seguridad y revisión técnica.
8. **Documentation:** actualizar contratos, ADRs, trazabilidad y decisiones.
9. **Closure:** emitir informe, resolver bloqueantes y solicitar aprobación explícita.

## Gates

Una fase no se considera completa por la existencia de código. Cada Step debe satisfacer alcance, historias, criterios, pruebas ejecutadas, lint, build, seguridad, documentación y validación técnica. Los estados válidos son `PENDING`, `IN_PROGRESS`, `IN_REVIEW`, `BLOCKED` y `COMPLETED`.

## Regla de avance

Solo se inicia un Step cuando el anterior está `COMPLETED` y existe aprobación explícita. Las decisiones que cambien alcance o arquitectura requieren actualización de la especificación y un ADR cuando corresponda.

