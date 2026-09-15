# 🦖 OpenStory Children

**Open-source AI Children's Comic Book Generator**

OpenStory Children turns a simple idea into a structured children's comic: story, characters, pages, panels, QA, layout and export. The architecture is agentic and provider-neutral rather than chatbot-first.

## Current verified state

**Phase 11 — Web Product / V1 Core — IN PROGRESS**

The repository currently contains a runnable local-first vertical slice with:

- deterministic story generation;
- age bands 2–3, 4–5, 6–8 and 9–12;
- Persian RTL-first UI;
- canonical Zod book model;
- child-safety/continuity QA and repair;
- HTML/print renderer;
- persistent filesystem project storage;
- `/api/books` and `/api/books/[id]` project APIs;
- Studio project library with load/delete;
- Ollama structured-output adapter;
- LM Studio/OpenAI-compatible adapter;
- ComfyUI image adapter;
- server/browser separation for filesystem persistence.

V1.0 is **not** claimed yet. Provider wiring into the generation job, page/panel editing, character-reference enforcement, integration tests and browser E2E verification remain before release.

## Quick start

Requirements: Node.js 20+ and pnpm 10+.

```bash
pnpm install
pnpm --filter @openstory/web dev
```

Open:

`http://localhost:3000/studio`

Create a book, inspect QA, reopen it from the project library, delete projects and export HTML. Browser Print can be used to create a PDF.

No API key is required for the deterministic fallback.

## Local AI

OpenStory is provider-neutral:

- Ollama: `http://localhost:11434`
- LM Studio/OpenAI-compatible: `http://localhost:1234/v1`
- ComfyUI: `http://localhost:8188`

See `docs/LOCAL_AI.md`.

## Engineering loop

```text
READ STATE
  ↓
INSPECT CODE + TESTS
  ↓
IMPLEMENT SMALLEST COHERENT CHANGE
  ↓
TEST / BUILD / BROWSER VERIFY
  ↓
IF FAILURE → INSPECT → REPAIR → RERUN
  ↓
UPDATE STATUS + TASKS
  ↓
COMMIT
  ↓
NEXT TASK
```

The repository is the durable project memory. Never restart the project from scratch. Read `AGENTS.md`, `docs/PROJECT_STATUS.md` and `planning/CURRENT_TASK.md` before continuing work.

## Repository map

```text
apps/web/                 Next.js Studio + API
packages/core/            domain model, story engine, QA, providers, renderer
packages/core/src/server.ts  server-only persistence entry
packages/core/src/file-book-store.ts  durable local projects
docs/                     architecture, roadmap, status and local AI docs
planning/CURRENT_TASK.md  exact next engineering tasks
AGENTS.md                 AI agent operating protocol
```

## Verification

```bash
pnpm check
pnpm --filter @openstory/web build
pnpm --filter @openstory/web dev
```

Then verify `/studio` in a real browser. A V1 release requires these checks to actually pass; documentation alone never marks a phase complete.

## Product pipeline

```text
Idea
 ↓
Story / Characters
 ↓
Pages / Panels
 ↓
Images
 ↓
QA + Repair
 ↓
Layout
 ↓
Book
 ↓
Web / HTML / Print / PDF path
```

Future milestones include stronger multi-agent orchestration, visual character consistency, asset management, audio/motion and production deployment.

## License

MIT. See `LICENSE`.
