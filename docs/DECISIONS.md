# Architecture Decision Record Log

## ADR-0001 — Provider Agnostic AI
**Status:** Accepted
The domain layer will not depend directly on a specific LLM or image-generation vendor. Providers implement stable interfaces.
**Reason:** local AI, self-hosting, cost control, experimentation, and long-term open-source sustainability.

## ADR-0002 — Structured Canonical Book Model
**Status:** Accepted
LLM output is not the canonical book state. Generated content must be validated into structured domain objects before persistence.
**Reason:** reliable editing, rendering, testing, migrations, and multi-agent handoff.

## ADR-0003 — Persistent AI Handoff Files
**Status:** Accepted
`AGENTS.md`, `docs/PROJECT_STATUS.md`, and `planning/CURRENT_TASK.md` are mandatory continuity documents.
**Reason:** different LLMs and sessions must be able to continue the same engineering work without relying on conversation history.

## ADR-0004 — SD 1.5 + IPAdapter Plus for V1 Character Consistency
**Status:** Accepted
V1 uses a provider-neutral image contract with a ComfyUI implementation based on SD 1.5 and IPAdapter Plus. Character identity is represented by persistent reference assets and injected into page generation rather than relying on prompt text alone.
**Reason:** practical 6 GB VRAM target, local-first operation, and a clear extension path to multi-reference workflows and future Character LoRA/ControlNet.

## ADR-0005 — File-based ComfyUI Workflow with Legacy JSON Fallback
**Status:** Accepted
`COMFYUI_WORKFLOW_PATH` is the primary workflow configuration. `COMFYUI_WORKFLOW_JSON` remains a compatibility fallback.
**Reason:** readable/versionable workflows should not be embedded as large environment strings while existing deployments remain functional.

## Future Decisions
Record significant stack, storage, provider, safety, rendering, and deployment changes here.
