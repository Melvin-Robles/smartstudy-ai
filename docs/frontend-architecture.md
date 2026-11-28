# Frontend Architecture

## Estado

Primer incremento del MVP. La implementación es una demo ejecutable con adaptadores locales; el backend real aún no está aprobado.

## Estructura

```text
src/app/
├── core/       modelos, stores y guard de autenticación
├── features/   auth, dashboard, documents y flashcards
└── layout/     shell y navegación principal
```

La aplicación usa componentes standalone, rutas lazy-loaded y Angular Signals para el estado de presentación. Las features dependen de contratos del núcleo (`StudyDocument`, `Flashcard`) y del `StudyStore`, que será reemplazado por un puerto de aplicación cuando exista el backend.

## Límites

- El dominio no conoce HTTP, bases de datos ni proveedores de IA.
- `StudyStore` es un adaptador temporal en memoria para demostrar el ciclo vertical.
- La carga simula el procesamiento asíncrono y sus estados; no representa todavía un job real.
- No se implementan RAG, OCR avanzado, cuestionarios avanzados ni analítica fuera del MVP.

## Accesibilidad y UX

Se usan labels persistentes, focus visible, mensajes de error con `role="alert"`, navegación por teclado, contraste semántico y layout responsive con breakpoint móvil debajo de 768px.
