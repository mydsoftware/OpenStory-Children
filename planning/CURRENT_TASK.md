# Current Task

## Active Phase

**Phase 12 — Production Image Pipeline / Character Consistency**

## Objective

Turn the existing ComfyUI adapter into a real SD 1.5 + IPAdapter Plus children's book image pipeline while preserving the provider-neutral architecture.

## Completed In This Loop

- [x] ComfyUI workflow can be loaded from `COMFYUI_WORKFLOW_PATH`.
- [x] Legacy `COMFYUI_WORKFLOW_JSON` remains supported.
- [x] Committed SD 1.5 API-format IPAdapter workflow.
- [x] Dynamic prompt, negative prompt, seed, size, steps, CFG, sampler, scheduler, checkpoint and IPAdapter weight injection.
- [x] Real ComfyUI reference upload through `POST /upload/image`.
- [x] Character reference generation and persistent character reference asset mapping.
- [x] Automatic page/panel character → reference resolution.
- [x] Deterministic per-panel seeds.
- [x] Image generation status/error metadata.
- [x] Image failure repair pass before the job is failed.
- [x] Continuity QA for generated images and reference mappings.
- [x] Unit/integration-style tests for workflow mutation, reference upload/polling and character→page mapping.
- [x] Windows/local AI documentation and environment template.

## Verification Gate

The implementation must pass:

1. typecheck;
2. unit/integration tests;
3. production build;
4. Browser E2E;
5. CI.

A real ComfyUI runtime test is optional for CI because tests use a mock HTTP provider; local runtime verification requires installed SD 1.5/IPAdapter/CLIP Vision models.

## Next Concrete Tasks

1. Run the full repository check in GitHub Actions.
2. Repair every compile/test/build/browser failure.
3. Verify the final workflow JSON and local AI docs against the implemented provider.
4. Update release/status documentation after green verification.
5. Continue toward V1 release only after the complete verification gate passes.

## Agentic Repair Rule

After every implementation increment, run the available tests/build/browser checks. If any check fails, inspect the actual failure, make the smallest coherent fix, rerun the failed check, and continue without requesting routine approval.
