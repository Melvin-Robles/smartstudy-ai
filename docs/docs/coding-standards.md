# Coding Standards — Baseline

- TypeScript strict y tipos explícitos en límites de aplicación.
- Standalone Components, Signals y APIs compatibles con Angular 22; no usar APIs obsoletas.
- Dependencias justificadas en ADR o technical design.
- Dominio independiente de framework y proveedores.
- Errores tipados y contratos explícitos; evitar `any` salvo excepción documentada.
- Nombres orientados al dominio y funciones con responsabilidad única.
- Validación en límites de entrada y autorización en cada operación protegida.
- Pruebas junto al módulo responsable y trazabilidad hacia historias de usuario.
- No registrar contenido sensible, tokens ni documentos completos en logs.

