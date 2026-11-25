# SmartStudyAI

MVP frontend de SmartStudyAI, construido con Angular 22, standalone components, Angular Router, Signals, Reactive Forms y SCSS.

## Alcance implementado

- Inicio de sesión demo con validación de email y contraseña.
- Guard de navegación para proteger el espacio autenticado.
- Dashboard con métricas y actividad reciente.
- Biblioteca personal con carga de PDF, DOCX y TXT.
- Estados de documento `UPLOADED`, `PROCESSING`, `READY` y `FAILED`.
- Reintento y eliminación de documentos con artefactos derivados.
- Detalle de documento con resumen, ideas principales y trazabilidad.
- Práctica básica de flashcards y registro local de avance.

La aplicación usa `StudyStore` como adaptador local temporal. No se implementó backend ni persistencia remota porque la decisión NestJS/FastAPI sigue pendiente de aprobación.

## Ejecución

```bash
npm install
npm start
```

Abre `http://localhost:4200/login`. Para la demo se acepta cualquier email válido y una contraseña de al menos ocho caracteres.

## Verificaciones

```bash
npm run build
npm test
```

El proyecto requiere Node compatible con la versión de Angular 22 instalada.
