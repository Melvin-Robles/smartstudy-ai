# Test Plans — Initial

La matriz ejecutable se detallará por Step. El baseline mínimo del MVP es:

| Área | Casos obligatorios |
|---|---|
| Identity | registro válido, credenciales inválidas, sesión expirada, acceso no autenticado |
| Upload | extensión inválida, MIME falsificado, archivo vacío, exceso de tamaño, nombre malicioso |
| Isolation | listar, consultar, descargar y eliminar documento de otro usuario |
| Processing | éxito, fallo recuperable, fallo permanente, reintento e idempotencia |
| AI output | esquema inválido, ausencia de fuente, contenido no fundamentado, prompt injection en documento |
| Practice | respuesta correcta, incorrecta, repetida, sesión inexistente y persistencia |
| Accessibility | teclado, foco visible, contraste, nombre accesible y mensajes de error |

