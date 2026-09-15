# Project Status

## Current State

- **Phase:** 11 — Web Product / V1 Core
- **Milestone:** Local-first executable comic-book studio
- **Status:** IN_PROGRESS
- **Implementation maturity:** Usable V1 core with deterministic generation, QA, renderer, provider configuration, persistence contract, orchestration and `/studio` UI.
- **Last verified:** Repository implementation review on 2026-09-15. GitHub Actions run availability is still environment-dependent.

## Completed

- Persistent AI-agent handoff protocol and roadmap.
- TypeScript + pnpm monorepo.
- Zod canonical book model.
- Structured story engine with deterministic fallback.
- Age-band-aware Persian generation.
- Versioned character identity and asset reference fields.
- Page/panel/dialogue model.
- Child-safety and continuity QA with scoring.
- Basic repair loop.
- Provider-neutral LLM/Image contracts.
- Ollama, LM Studio/OpenAI-compatible and ComfyUI configuration helpers.
- Portable RTL HTML comic renderer with print CSS.
- `/studio` browser creation flow.
- HTML export from the browser.
- BookStore contract and in-memory persistence implementation.
- Generation orchestrator with QA/repair path.
- Persian end-user/developer usage guide.

## Current limitations before V1.0

- Real network LLM/Image provider implementations are not yet enabled by default.
- Persistent disk/SQLite store is still required for durable projects across restarts.
- Native server PDF generation is not included; browser print is the current path.
- Full visual image generation and character-reference enforcement remain to be implemented.
- Full editor, project library, asset management and regeneration UX remain to be implemented.
- Browser E2E verification must be executed against a running server before release.

## Verification contract

```bash
pnpm install
pnpm check
pnpm --filter @openstory/web build
pnpm --filter @openstory/web dev
```

Then verify `/studio` in a browser: generation, QA, responsive layout and HTML export.

## Next Concrete Tasks

1. Add durable local project storage.
2. Add real Ollama/LM Studio structured generation adapters.
3. Add ComfyUI image generation adapter and asset lifecycle.
4. Add project/book/page editor and regeneration controls.
5. Add browser E2E tests and visual verification.
6. Complete release hardening, documentation, license and V1.0 acceptance.

## Handoff Notes

Any LLM continuing this project must read `AGENTS.md`, this file, and `planning/CURRENT_TASK.md` before coding. Never infer project progress from conversation history.
