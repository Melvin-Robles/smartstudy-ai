# User Stories — MVP

## EPIC-01 Identity

### US-001 — Registro e inicio de sesión

Como estudiante, quiero crear una cuenta e iniciar sesión para acceder de forma privada a mi biblioteca.

**Prioridad:** P0. **Dependencias:** decisión de identidad y backend.

**Aceptación:** Given una cuenta válida, When inicia sesión, Then obtiene una sesión válida; credenciales inválidas no revelan si el usuario existe.

## EPIC-02 Documents

### US-002 — Cargar documento

Como estudiante, quiero cargar un PDF, DOCX o TXT para convertirlo en material de estudio.

**Prioridad:** P0. **Dependencias:** almacenamiento, validación y autorización.

**Aceptación:** Given un archivo permitido dentro del límite, When lo cargo, Then aparece en mi biblioteca con estado `UPLOADED` o `PROCESSING`; un archivo inválido se rechaza con una razón accionable.

### US-003 — Consultar procesamiento

Como estudiante, quiero conocer el estado del procesamiento para saber cuándo puedo estudiar.

**Prioridad:** P0.

**Aceptación:** Given un documento, When consulto su estado, Then veo estado, fecha y error categorizado si falla, sin ver información de otro usuario.

### US-004 — Eliminar documento

Como estudiante, quiero eliminar un documento para controlar mis datos.

**Prioridad:** P0.

**Aceptación:** Given un documento propio, When lo elimino, Then desaparecen el archivo y sus artefactos según la política; un documento ajeno responde como no accesible.

## EPIC-03 AI Study Materials

### US-005 — Generar resumen fundamentado

Como estudiante, quiero un resumen de mi documento para comprender sus ideas principales.

**Prioridad:** P0. **Dependencias:** procesamiento listo, proveedor intercambiable y esquema.

**Aceptación:** Given un documento procesado, When solicito un resumen, Then recibo una estructura válida con referencias; si la evidencia es insuficiente, se informa la limitación.

### US-006 — Generar y practicar flashcards

Como estudiante, quiero obtener flashcards y practicar con ellas para reforzar la retención.

**Prioridad:** P0. **Dependencias:** US-005 y persistencia de artefactos.

**Aceptación:** Given flashcards válidas, When respondo una tarjeta, Then se registra el resultado y se actualiza el progreso básico.

