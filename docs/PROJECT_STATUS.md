# Project Status

## Current State

- **Phase:** 11 — Web Product / V1 Core
- **Milestone:** Local-first executable comic-book studio
- **Status:** IN_PROGRESS
- **Implementation maturity:** Usable V1 core with deterministic generation, optional local LLM generation, QA, renderer, provider adapters, durable persistence, project API, scoped editing/regeneration, character asset references and unified orchestration.
- **Last repository review:** 2026-09-18 (CI run #112 green).

## Verified Implemented

- TypeScript + pnpm monorepo.
- Zod canonical book model.
- Deterministic story engine and fallback generation.
- Age-band-aware Persian generation.
- Versioned character identity and asset reference fields.
- Page/panel/dialogue model.
- Child-safety and continuity QA with scoring.
- Repair helper and scoped panel regeneration.
- Provider-neutral LLM/Image contracts.
- Ollama and LM Studio/OpenAI-compatible structured-output adapters.
- ComfyUI image generation adapter with workflow submission and polling.
- Persistent provider configuration and health API.
- Provider retry policy and structured generation job errors.
- Portable RTL HTML comic renderer with print CSS.
- /studio browser creation flow.
- Persistent filesystem FileBookStore.
- /api/books create/list and /api/books/[id] load/delete/PATCH.
- /api/books/[id]/regenerate scoped panel regeneration.
- Studio project library, load/delete, page/panel editing, regeneration and HTML export.
- Character reference/asset consistency enforcement in QA.
- Unified BookOrchestrator generation → image → QA → persistence pipeline.
- Automated GitHub CI for typecheck, tests and production build.
- CI run #112 verified green on commit 996899f9fbf774346c58575fff71ea2069463788.

## Current Release-Gate Limitations

- Browser E2E/visual verification has not yet been executed in the available tool environment.
- Native server-side PDF generation is not included; browser print remains the PDF path.
- Audio/video are extension points, not part of the V1 core release gate.
- The orchestrator currently executes image generation request-scoped; durable background job infrastructure is a future scaling concern, not a blocker for the local-first vertical slice.

## Verification Contract

```bash
pnpm install
pnpm check
pnpm --filter @openstory/web build
pnpm --filter @openstory/web dev
```

CI has verified pnpm check and the web production build. A local browser pass is still required for the final release gate.

## Next Concrete Tasks

1. Run browser E2E/visual verification against /studio.
2. Repair every browser failure and rerun verification.
3. Complete any missing API/provider integration coverage supported by the repository test harness.
4. Add release/contribution documentation.
5. Final CI and V1.0 acceptance.
6. Tag v1.0.0 only after all gates pass.

## Agentic Repair Rule

When a check fails, continue the engineering loop: inspect the actual failure, identify the smallest coherent fix, implement it, rerun the failed check, and continue. Do not claim completion from documentation alone.

## Handoff

Any LLM continuing this project must read AGENTS.md, this file, and planning/CURRENT_TASK.md before coding. Never infer project progress from conversation history.
