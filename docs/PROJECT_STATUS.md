# Project Status

## Current State

- **Phase:** 12 — Production Image Pipeline / Character Consistency
- **Milestone:** Local-first executable children's comic studio
- **Status:** IN_PROGRESS — implementation gates green
- **Last repository review:** 2026-09-21

## Verified Implemented

- TypeScript + pnpm monorepo.
- Canonical Zod book model with character reference, visual style, page/panel generation metadata and seeds.
- Deterministic story engine and optional local LLM generation.
- Ollama and LM Studio/OpenAI-compatible providers.
- Provider-neutral image contract.
- ComfyUI provider with health check, retry, API workflow submission and history polling.
- File-based ComfyUI workflow loading with legacy JSON environment fallback.
- Real reference upload to ComfyUI `/upload/image`.
- SD 1.5 + IPAdapter Plus workflow committed in `workflows/comfyui/storybook-ipadapter-sd15.json`, aligned with StorybookRedmond + `ip-adapter-plus_sd15.safetensors` + ViT-H.
- Automatic character reference generation and page/panel reference mapping.
- Deterministic panel seeds and 512×512 low-VRAM defaults.
- Image generation status/error state and one repair pass.
- Continuity QA for character IDs, references and generated output metadata.
- Persistent filesystem book storage.
- Studio project library, editing, scoped panel regeneration and HTML export.
- Browser E2E coverage for Studio.
- CI configuration for typecheck, tests and production build.
- Windows local AI documentation and `.env.example`.

## Important Limitations

- The committed workflow depends on ComfyUI IPAdapter Plus custom nodes and the specified StorybookRedmond/CLIP Vision/IPAdapter model files; binaries are not committed.
- V1 currently sends the first available character reference to the ComfyUI IPAdapter pipeline when a panel has multiple characters. The interface is ready for true multi-reference workflows.
- Native server-side PDF generation is not included; browser print remains the PDF path.
- Durable background job infrastructure is still a future scaling concern; local generation is request-scoped.

## Verification Contract

```bash
pnpm install
pnpm check
pnpm --filter @openstory/web build
```

Browser E2E is required before release. CI should be the authoritative verification for repository changes.

## Next Concrete Task

CI run #173 and Browser E2E run #56 are green for the production image pipeline. Remaining release limitations are real ComfyUI runtime smoke testing and visual verification with agent-browser; do not tag V1 until those gates are actually verified.
