---
description: Delega una tarea al agente orchestrator, que la reparte entre los subagentes especializados de .claude/agents/
argument-hint: [descripcion de la tarea]
---

Usar el agente `orchestrator` para resolver la siguiente tarea. El
agente `orchestrator` es quien decide como repartirla entre
`ux-color-designer`, `security-auditor`, `frontend-implementer` y
`qa-build-reviewer`, y entrega al final un resumen ejecutivo.

Tarea: $ARGUMENTS
