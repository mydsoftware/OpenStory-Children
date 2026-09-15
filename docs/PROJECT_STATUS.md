# Project Status

## Current State

- **Phase:** 11 — Web Product / V1 Core
- **Milestone:** Local-first executable comic-book studio
- **Status:** IN_PROGRESS
- **Implementation maturity:** Usable V1 core with deterministic generation, QA, renderer, provider adapters, durable filesystem persistence, project API, orchestration and `/studio` library workflow.
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
- Portable RTL HTML comic renderer with print CSS.
- `/studio` browser creation flow.
- Persistent filesystem `FileBookStore`.
- `/api/books` create/list endpoint.
- `/api/books/[id]` load/delete endpoint.
- Studio project library with load/delete actions.
- HTML export from the studio.
- Persian end-user/developer usage guide.

## Current Limitations Before V1.0

- Studio provider selection/configuration is not yet exposed in the UI.
- The current API generation path still uses the deterministic story engine; real LLM/image providers are available as core adapters but are not yet wired into the generation job.
- Page/panel editing and scoped regeneration are not complete.
- Character reference assets and visual consistency enforcement are not complete.
- Provider health checks, retries and richer job recovery are not complete.
- Native server PDF generation is not included; browser print remains the current PDF path.
- Browser E2E verification has not been executed in this environment because external network/DNS access is unavailable to the execution runtime.
- `pnpm check` and production build therefore require verification in a network-enabled environment.

## Verification Contract

```bash
pnpm install
pnpm check
pnpm --filter @openstory/web build
pnpm --filter @openstory/web dev
```

Then verify `/studio` in a browser: create, persist, reload, delete, QA, responsive layout and HTML export.

## Next Concrete Tasks

1. Wire provider selection into the studio/job layer.
2. Add page/panel editor and scoped regeneration.
3. Add character assets/reference lifecycle and consistency checks.
4. Add integration/API/provider failure tests.
5. Run browser E2E and repair every failure.
6. Sync release documentation and perform V1.0 acceptance.

## Agentic Repair Rule

When a check fails, continue the engineering loop: inspect the actual failure, identify the smallest coherent fix, implement it, rerun the failed check, and continue. Do not claim completion from documentation alone.

## Handoff

Any LLM continuing this project must read `AGENTS.md`, this file, and `planning/CURRENT_TASK.md` before coding. Never infer project progress from conversation history.
