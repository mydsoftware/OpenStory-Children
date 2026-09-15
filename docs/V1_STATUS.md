# V1 Implementation Status

## Current state

The repository now contains a usable end-to-end local-first core vertical slice:

- Structured story planning and deterministic generation
- Persistent character identity in the canonical book model
- Age-band aware Persian generation
- Page/panel/dialogue structure
- Child-safety and continuity QA with scoring
- Repair helper for page numbering
- Provider-neutral contracts
- Local provider configuration for Ollama, LM Studio/OpenAI-compatible servers and ComfyUI
- Portable HTML comic renderer with print CSS
- Browser story studio at `/studio`
- HTML export from the studio
- Core QA tests

## Architecture boundary

The domain model remains provider-independent. Expensive generation is optional; the deterministic engine is the zero-dependency fallback that makes the product usable without an API key.

## V1 limitations that remain intentionally extensible

- Real image generation adapters are contracts/configuration only; they are not silently tied to a vendor API.
- PDF generation is delegated to browser print from the portable HTML output.
- Server-side database, authentication and multi-user collaboration are deployment concerns rather than requirements for the local-first core.
- Audio/video are extension points, not required for the children's comic V1 core.

## Verification target

Before tagging a release, run:

```bash
pnpm install
pnpm check
pnpm --filter @openstory/web build
```

Then open `/studio` and verify story generation, QA status and HTML export.
