# OpenStory Children — Zero to V1.0 Roadmap

This roadmap is the long-lived execution plan. A phase is complete only when its implementation, tests, documentation, and acceptance criteria are verified.

## Phase 00 — Foundation
- Repository governance
- AI handoff protocol
- Product specification
- Architecture specification
- Initial stack decision
- Development/test baseline

## Phase 01 — Product Definition
- Personas and age bands
- Book creation flow
- Story types and safety boundaries
- Comic formats
- Localization and RTL requirements
- Non-functional requirements

## Phase 02 — Core Architecture
- Monorepo/package boundaries
- Domain model
- Book/Chapter/Page/Panel contracts
- Event and job model
- Provider interfaces
- Storage abstraction
- Configuration system

## Phase 03 — Core Book Engine
- Book lifecycle
- Versioning
- Draft/revision model
- Structured story representation
- Scene and panel representation
- Deterministic serialization

## Phase 04 — Story Engine
- Story planner
- Story bible
- Age-aware language
- Narrative constraints
- Educational/story templates
- LLM provider abstraction
- Structured output validation

## Phase 05 — Character Engine
- Character profiles
- Visual identity
- Character sheets
- Reference assets
- Consistency metadata
- Character versioning

## Phase 06 — Image Generation Engine
- Image provider abstraction
- ComfyUI/local provider
- OpenAI-compatible/provider adapters where appropriate
- Prompt construction
- Seeds/settings
- Reference-image workflows
- Queue/retry/error handling

## Phase 07 — Comic Engine
- Page planning
- Panel planning
- Camera/composition metadata
- Speech bubbles
- Captions
- SFX
- Layout templates
- RTL/LTR layout

## Phase 08 — Consistency & Quality Engine
- Character consistency checks
- Scene continuity checks
- Text overflow checks
- Age appropriateness checks
- Safety checks
- Image quality checks
- Regeneration workflow

## Phase 09 — Book Renderer & Export
- Web reader
- PDF
- Print layout
- EPUB/structured export if justified
- Asset packaging
- Book metadata

## Phase 10 — AI Agent Orchestration
- Story Agent
- Character Agent
- Scene Agent
- Image Agent
- Layout Agent
- QA Agent
- Repair loop
- Job orchestration
- Human approval checkpoints

## Phase 11 — Web Product
- Create-book wizard
- Project dashboard
- Character library
- Book editor
- Page editor
- Regenerate/edit controls
- Preview
- Export UI

## Phase 12 — Local AI
- Ollama provider
- LM Studio/OpenAI-compatible provider
- llama.cpp-compatible path where practical
- ComfyUI integration
- Local configuration UX
- Offline/local-first mode

## Phase 13 — Personalization
- Child profile
- Custom protagonist
- Persistent character identity
- Series continuity
- Favorite worlds
- Family-owned story library

## Phase 14 — Audio & Motion
- Narration
- Character voices
- Music/SFX
- Read-aloud mode
- Optional panel animation
- Optional video export

## Phase 15 — Security & Privacy
- Safe content policy
- Child privacy
- Data minimization
- Secure asset handling
- Secrets management
- Abuse prevention
- Export/delete controls

## Phase 16 — Testing & Reliability
- Unit tests
- Integration tests
- E2E tests
- Visual regression
- Golden-book fixtures
- Provider contract tests
- Failure injection
- Performance testing

## Phase 17 — Production
- Observability
- Queues/background jobs
- Storage scaling
- Caching
- Deployment
- CI/CD
- Release automation
- Backups/recovery

## Phase 18 — Open-Source Release
- License finalized
- Contribution guide
- Development guide
- Provider documentation
- Example books
- Demo environment
- Issue templates
- Release checklist

## Phase 19 — V1.0

V1.0 is complete only when a user can:

1. Create a child-friendly book project.
2. Describe an idea in natural language.
3. Generate a structured story.
4. Generate reusable characters.
5. Generate pages and comic panels.
6. Review and regenerate individual artifacts.
7. Preserve character consistency across the book.
8. Render a complete book.
9. Export it.
10. Reopen the project later and continue editing.

## Phase Status Rule

Use these states only:

`NOT_STARTED` → `IN_PROGRESS` → `BLOCKED` → `VERIFYING` → `COMPLETED`

Never skip `VERIFYING` for a phase with implementation.
