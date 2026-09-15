# Implementation Stack

## Phase 00 baseline

- **Runtime:** Node.js 20+
- **Language:** TypeScript with strict mode
- **Package manager:** pnpm workspaces
- **Web:** Next.js App Router + React
- **Validation:** Zod
- **Unit tests:** Vitest
- **AI providers:** adapter interfaces; first implementations may target OpenAI-compatible HTTP, Ollama, and LM Studio
- **Image generation:** provider interface first; ComfyUI/local adapter planned
- **Persistence:** repository abstraction first; concrete database is selected in Phase 02
- **Rendering:** deterministic React/HTML rendering first; PDF/print adapters later

## Package boundaries

```text
apps/web        User-facing creation/review application
packages/core   Canonical schemas + domain pipeline + provider contracts
packages/*      Future isolated engines/adapters
```

The core package must remain independent of Next.js and browser APIs. Provider adapters must not leak vendor-specific request/response shapes into canonical domain models.

## Vertical slice

The current executable slice intentionally avoids external AI and image generation:

`story input → validation → deterministic book model → rendered web page`

This gives every future LLM a runnable baseline before expensive providers are introduced.
