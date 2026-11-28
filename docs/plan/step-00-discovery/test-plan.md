# STEP 00 — Test Plan

## Objetivo

Definir la estrategia de pruebas que acompañará cada historia; no se ejecutan pruebas en este Step porque aún no existe implementación.

## Casos prioritarios

- US-001: identidad válida, credencial inválida, sesión expirada y acceso no autenticado.
- US-002: formato permitido, formato no permitido, MIME falsificado, archivo vacío, límite de tamaño y nombre inseguro.
- US-003: transición correcta, fallo recuperable, fallo permanente, reintento e idempotencia.
- US-004: borrado propio, recurso ajeno, derivados y reintento de borrado.
- US-005: esquema válido, grounding, fuente insuficiente, timeout y prompt injection.
- US-006: generación vacía, tarjeta inválida, respuesta correcta, incorrecta y duplicada.

## TDD requerido

Para cada caso: escribir primero la prueba fallida (RED), implementar el mínimo (GREEN), refactorizar manteniendo las pruebas (REFACTOR), y registrar la ejecución.

