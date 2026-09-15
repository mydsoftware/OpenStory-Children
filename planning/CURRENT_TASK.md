# Current Task

## Active Phase

**Phase 11 — Web Product / V1 Core**

## Objective

Complete the local-first executable studio vertical slice: persistent projects, provider adapters, project API, library/editor workflow, regeneration, QA and browser verification.

## Completed In This Loop

- [x] Durable filesystem `BookStore`.
- [x] Ollama structured-output adapter.
- [x] LM Studio/OpenAI-compatible structured-output adapter.
- [x] ComfyUI image adapter with polling and output mapping.
- [x] Public core exports for stores and adapters.
- [x] Persistent `/api/books` create/list endpoint.
- [x] Persistent `/api/books/[id]` load/delete endpoint.
- [x] Studio connected to the persistent project API.
- [x] Project library with load/delete actions.

## Remaining Execution Tasks

- [ ] Add provider selection/configuration to the studio and route generation through the selected provider.
- [ ] Add page/panel editing and scoped regeneration.
- [ ] Add character reference/asset lifecycle and consistency enforcement.
- [ ] Add provider health checks, retries and structured error states.
- [ ] Add integration tests for API and provider failure paths.
- [ ] Run `pnpm check` and web production build in a network-enabled environment.
- [ ] Run browser E2E/visual verification against `/studio`.
- [ ] Repair every discovered failure until the verification loop is green.
- [ ] Sync README, roadmap, status and decisions with verified implementation.
- [ ] Add license/contribution/release documentation.
- [ ] Only then mark V1.0 release-ready.

## Agentic Repair Rule

After every implementation increment, run the available tests/build/browser checks. If any check fails, inspect the actual failure, make the smallest coherent fix, rerun the failed check, and continue the loop. Do not stop for user approval unless a destructive, security-sensitive, or fundamentally ambiguous product decision is unavoidable.

## Acceptance Criteria

The project must provide a usable local-first workflow in which a user can create a book, persist it, reopen it, inspect QA, export it, and manage projects from the studio. AI providers must remain optional and vendor-neutral. No V1.0 claim is allowed until automated and browser verification has actually passed.
