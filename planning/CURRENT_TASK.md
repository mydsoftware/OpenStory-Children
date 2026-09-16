# Current Task

## Active Phase

**Phase 11 — Web Product / V1 Core**

## Objective

Complete the local-first executable studio vertical slice and release gate without breaking the verified baseline.

## Completed In This Loop

- [x] Durable filesystem `BookStore`.
- [x] Ollama structured-output adapter.
- [x] LM Studio/OpenAI-compatible structured-output adapter.
- [x] ComfyUI image adapter with polling and output mapping.
- [x] Validated LLM story generation with deterministic fallback.
- [x] Environment-driven server LLM provider selection.
- [x] Persistent `/api/books` create/list endpoint.
- [x] Persistent `/api/books/[id]` load/delete endpoint.
- [x] Studio connected to the persistent project API.
- [x] Project library with load/delete actions.
- [x] Browser-safe/server-only core package entrypoints.
- [x] Automated CI typecheck, tests and web production build.
- [x] Agentic repair loop completed multiple CI failures until green.
- [x] README, status and usage documentation synchronized.
- [x] MIT license committed.
- [x] Persistent local provider configuration API with Ollama/LM Studio selection.
- [x] Provider health status endpoint and Studio controls.
- [x] Validated book PATCH API for safe edits.
- [x] Studio page/panel text editing with explicit save.

## Remaining Release-Gate Tasks

- [ ] Add scoped page/panel regeneration through the agent pipeline.
- [ ] Add character reference/asset lifecycle and consistency enforcement.
- [ ] Wire ComfyUI image generation into the production generation job.
- [ ] Add provider health checks, retries and structured job error states.
- [ ] Add API/provider failure integration tests.
- [ ] Add browser E2E/visual verification against `/studio`.
- [ ] Repair every browser failure until the release verification loop is green.
- [ ] Add contribution/release documentation.
- [ ] Only then mark V1.0 release-ready and tag the release.

## Agentic Repair Rule

After every implementation increment, run the available tests/build/browser checks. If any check fails, inspect the actual failure, make the smallest coherent fix, rerun the failed check, and continue the loop. Do not stop for user approval unless a destructive, security-sensitive, or fundamentally ambiguous product decision is unavoidable.

## Acceptance Criteria

The project must provide a usable local-first workflow in which a user can create a book, optionally use a local LLM, persist it, reopen it, inspect QA, edit pages/panels, export it, and manage projects from the studio. AI providers remain optional and vendor-neutral. No V1.0 claim is allowed until automated and browser verification has actually passed.
