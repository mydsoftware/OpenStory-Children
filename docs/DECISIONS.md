# Architecture Decision Record Log

This file records decisions that future agents must not accidentally reverse without reconsideration.

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

## Future Decisions

Record significant stack, storage, provider, safety, rendering, and deployment decisions here with status and rationale.
