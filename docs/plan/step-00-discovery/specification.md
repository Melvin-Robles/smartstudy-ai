# STEP 00 — Specification

## Objetivo

Definir el producto inicial, reglas de negocio, actores, requisitos, restricciones y criterios de aceptación de SmartStudyAI.

## Actores

- Estudiante: propietario y consumidor de documentos y materiales.
- Sistema: valida, procesa, genera y registra estados.
- Proveedor de IA: adaptador externo no confiable desde la perspectiva del dominio.
- Operador técnico: observa salud y fallos, sin acceso implícito al contenido privado.

## Reglas de negocio recomendadas

1. Un documento pertenece a un único usuario en el MVP.
2. La autorización se evalúa en cada operación, no solo al listar recursos.
3. Solo se aceptan formatos y tamaños configurados; la extensión no basta para validar un archivo.
4. Un documento no se usa para generar contenido hasta estar en estado `READY`.
5. Los trabajos pueden reintentarse, pero el mismo evento no debe crear artefactos duplicados.
6. Todo artefacto de IA conserva referencia al documento y versión de generación.
7. El sistema no presenta una inferencia como hecho si no puede fundamentarla en la fuente.
8. El contenido del documento nunca puede sobrescribir instrucciones del sistema o políticas de seguridad.
9. El usuario puede eliminar documentos y derivados; la retención técnica debe estar documentada.
10. Los errores visibles deben ser accionables y los logs no deben exponer secretos ni texto sensible innecesario.
11. Un proveedor de IA puede sustituirse sin modificar reglas de negocio.
12. Las funciones fuera del MVP no se implementan por anticipación.

## Alcance

El alcance aprobado para revisión es el descrito en `docs/product-scope.md` y cubre US-001 a US-006.

## Restricciones

- No existe backend seleccionado.
- No existe código base ni configuración inicial.
- No se implementa código en STEP 00.
- Angular 22, TypeScript strict, standalone components, Signals, SCSS y UIKit son restricciones del frontend.
- Las versiones concretas de librerías deben verificarse antes de adoptarse.

## Criterio de salida

MVP, reglas, riesgos, criterios de aceptación y plan de pruebas aprobados explícitamente; luego podrá comenzar STEP 01.

