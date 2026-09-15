# Project Status

## Current State

- **Phase:** 11 — Web Product / V1 Core
- **Milestone:** Local-first executable comic-book studio
- **Status:** IN_PROGRESS
- **Implementation maturity:** Usable V1 core with deterministic generation, optional local LLM generation, QA, renderer, provider adapters, durable filesystem persistence, project API, orchestration and `/studio` library workflow.
- **Last repository review:** 2026-09-15.

## Verified Implemented

- TypeScript + pnpm monorepo.
- Zod canonical book model.
- Deterministic story engine and fallback generation.
- Age-band-aware Persian generation.
- Versioned character identity and asset reference fields.
- Page/panel/dialogue model.
- Child-safety and continuity QA with scoring.
- Basic repair loop.
- Provider-neutral LLM/Image contracts.
- Real Ollama structured-output adapter.
- Real LM Studio/OpenAI-compatible structured-output adapter.
- ComfyUI image generation adapter with workflow submission and polling.
- Validated LLM story generation with deterministic fallback.
- Environment-driven local LLM provider selection for the server API.
- Portable RTL HTML comic renderer with print CSS.
- `/studio` browser creation flow.
- Persistent filesystem `FileBookStore`.
- `/api/books` create/list endpoint.
- `/api/books/[id]` load/delete endpoint.
- Studio project library with load/delete actions.
- HTML export from the studio.
- Browser/server package-entry separation for Node filesystem persistence.
- Automated GitHub CI for typecheck, tests and production build.
- CI verified green on run 62 after an agentic repair loop fixed configuration, schema, workspace package-resolution and test-harness failures.
- Persian end-user/developer usage guide.

## Current Limitations Before V1.0

- Studio provider selection/configuration is still environment-driven rather than user-selectable in the UI.
- Image generation is available as a core ComfyUI adapter but is not yet part of the default book-generation job.
- Page/panel editing and scoped regeneration are not complete.
- Character reference assets and visual consistency enforcement are not complete.
- Provider health checks, retries and richer job recovery are not complete.
- Native server PDF generation is not included; browser print remains the current PDF path.
- Browser E2E/visual verification has not been executed in this environment because the execution runtime cannot start a local server with external browser tooling.

## Verification Contract

```bash
pnpm install
pnpm check
pnpm --filter @openstory/web build
pnpm --filter @openstory/web dev
```

CI has verified `pnpm check` and the web production build successfully. A local browser pass is still required for the final release gate.

## Next Concrete Tasks

1. Add provider configuration/health UI.
2. Add page/panel editor and scoped regeneration.
3. Add character asset/reference lifecycle and consistency checks.
4. Add image generation into the production job pipeline.
5. Add API/provider failure integration tests.
6. Run browser E2E and repair every failure.
7. Add release hardening and only then perform V1.0 acceptance.

## Agentic Repair Rule

When a check fails, continue the engineering loop: inspect the actual failure, identify the smallest coherent fix, implement it, rerun the failed check, and continue. Do not claim completion from documentation alone.

## Handoff

Any LLM continuing this project must read `AGENTS.md`, this file, and `planning/CURRENT_TASK.md` before coding. Never infer project progress from conversation history.
