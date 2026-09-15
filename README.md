# 🦖 OpenStory Children

**Open-source AI Children's Comic Book Generator**

OpenStory Children turns a simple idea into a complete, editable children's comic book: story, characters, scenes, panels, dialogue, images, layout, QA, and export.

> **Current project state:** Phase 00 — Foundation / Planning
>
> This repository is intentionally designed as a **persistent engineering memory for humans and LLMs**. A future ChatGPT, Qwen, Claude, Gemini, OpenCode agent, or human developer should be able to clone this repository, read the control documents, verify the code, and continue the project without needing this conversation.

---

## 🤖 START HERE — FOR ANY AI AGENT

**Do not start coding immediately.** Follow this order:

```text
1. README.md
       ↓
2. AGENTS.md
       ↓
3. docs/PROJECT_STATUS.md
       ↓
4. planning/CURRENT_TASK.md
       ↓
5. docs/ROADMAP.md
       ↓
6. relevant architecture/spec documents
       ↓
7. inspect actual code + tests
       ↓
8. implement the next incomplete task
       ↓
9. test / verify
       ↓
10. update project state
```

### Golden Rule

> **Never restart the project from scratch. Continue from the verified repository state.**

If documentation and code disagree, trust verified code/tests first and repair the documentation.

---

# 🎯 Product Vision

A parent, child, teacher, or creator should be able to say:

> **«برای یک کودک ۴ ساله یک کمیک ۱۰ صفحه‌ای درباره یک داینوسور کوچولو به نام دینو بساز که دوستش را گم کرده.»**

OpenStory should produce:

```text
Idea
 ↓
Story Bible
 ↓
Characters
 ↓
Story
 ↓
Scenes
 ↓
Pages
 ↓
Panels
 ↓
Images
 ↓
Dialogue / Captions
 ↓
Consistency QA
 ↓
Layout
 ↓
Complete Book
 ↓
PDF / Web / Print / Future Audio & Video
```

This is **not primarily a chatbot**. It is an agentic production system.

---

# 🧠 Core Product Principles

- Child-safe by design.
- Persian/RTL is first-class.
- Local-first and provider-agnostic AI architecture.
- No hard dependency on one LLM or image model.
- Character and visual consistency are core requirements.
- Generated artifacts remain editable.
- Regeneration should work at book/page/panel/asset level.
- Previous versions must not be silently destroyed.
- Expensive generation should be observable and resumable.
- Every important generated artifact should have provenance metadata.
- Documentation is part of the product because AI agents must be able to continue the project.

---

# 🏗️ Target Architecture

```text
                         OPENSTORY
                            │
                         User Intent
                            │
                     Creation Interface
                            │
                    Application Services
                            │
                    Agent / Job Layer
                            │
       ┌────────────────────┼────────────────────┐
       │                    │                    │
 Story Agent          Character Agent       Page Agent
       │                    │                    │
       └────────────────────┼────────────────────┘
                            │
                     Image / Layout
                            │
                        QA / Repair
                            │
                    Canonical Book Model
                            │
                      Book Renderer
                            │
          ┌─────────────────┼─────────────────┐
          ↓                 ↓                 ↓
         Web               PDF              Print
```

Provider implementations sit behind stable interfaces:

```text
LLM Provider
├── Ollama
├── LM Studio / OpenAI-compatible
├── llama.cpp-compatible
└── Cloud providers

Image Provider
├── ComfyUI
├── Local diffusion/compatible engines
└── Cloud providers
```

The domain layer must never depend directly on one vendor.

---

# 📚 Zero → 100 Roadmap

A phase is **not complete** because someone wrote documentation for it. It is complete only after implementation, tests, verification, and handoff state are updated.

| Phase | Name | Goal | Status |
|---:|---|---|---|
| 00 | Foundation | Repository + AI continuity + specs | 🟡 IN PROGRESS |
| 01 | Product Definition | Product rules, users, age bands, UX | ⬜ |
| 02 | Core Architecture | Domain model, packages, provider contracts | ⬜ |
| 03 | Book Engine | Projects, books, pages, panels, versions | ⬜ |
| 04 | Story Engine | Story planning and structured generation | ⬜ |
| 05 | Character Engine | Persistent character identity | ⬜ |
| 06 | Image Engine | Local/cloud image generation | ⬜ |
| 07 | Comic Engine | Panels, bubbles, captions, layouts | ⬜ |
| 08 | Consistency & QA | Continuity, safety, visual/text QA | ⬜ |
| 09 | Renderer & Export | Web, PDF, print and structured export | ⬜ |
| 10 | Agent Orchestration | Multi-agent generation + repair loop | ⬜ |
| 11 | Web Product | Complete creation/editing interface | ⬜ |
| 12 | Local AI | Ollama, LM Studio, ComfyUI/local mode | ⬜ |
| 13 | Personalization | Child profiles + recurring characters | ⬜ |
| 14 | Audio & Motion | Narration, SFX, optional animation | ⬜ |
| 15 | Security & Privacy | Child safety, privacy, secure assets | ⬜ |
| 16 | Testing & Reliability | Unit, integration, E2E, visual tests | ⬜ |
| 17 | Production | Deployment, queues, observability, recovery | ⬜ |
| 18 | Open Source Release | Docs, examples, contribution, release | ⬜ |
| 19 | V1.0 | Complete usable open-source product | ⬜ |

**Detailed execution plan:** `docs/ROADMAP.md`

---

# 🧩 Repository Structure

```text
OpenStory-Children/
│
├── README.md                 ← project entry point for humans + LLMs
├── AGENTS.md                 ← mandatory AI coding protocol
│
├── docs/
│   ├── PROJECT_STATUS.md     ← current verified state
│   ├── ROADMAP.md            ← zero → V1 execution plan
│   ├── PRODUCT_SPEC.md       ← product requirements
│   ├── ARCHITECTURE.md       ← technical architecture
│   ├── AI_ARCHITECTURE.md    ← agent/AI architecture
│   ├── DATA_MODEL.md         ← domain/data model
│   ├── CHARACTER_CONSISTENCY.md
│   └── DECISIONS.md          ← architectural decisions
│
├── planning/
│   └── CURRENT_TASK.md       ← exact task the next agent should do
│
├── apps/                     ← applications
├── packages/                 ← shared packages
├── services/                 ← backend/worker services
├── providers/                ← AI/storage provider implementations
├── prompts/                  ← versioned prompt assets
├── models/                   ← schemas/model definitions
├── tests/                    ← test suites and fixtures
├── examples/                 ← example books/projects
└── scripts/                  ← development/automation scripts
```

Directories may be added as implementation requires them; the control documents must remain stable.

---

# 🔄 AI Engineering Loop

Every implementation task follows:

```text
READ STATE
   ↓
UNDERSTAND EXISTING CODE
   ↓
PLAN SMALLEST COHERENT CHANGE
   ↓
IMPLEMENT
   ↓
TEST
   ↓
REPAIR
   ↓
VERIFY
   ↓
UPDATE DOCS / STATUS
   ↓
COMMIT
   ↓
NEXT TASK
```

The loop must be resumable after an interrupted session.

---

# 🧪 Definition of Done

A feature is done only when applicable:

- [ ] Implementation exists.
- [ ] Types/contracts are correct.
- [ ] Tests exist.
- [ ] Tests pass.
- [ ] Error paths are handled.
- [ ] UI behavior is verified where applicable.
- [ ] Documentation is updated.
- [ ] `PROJECT_STATUS.md` is updated.
- [ ] `CURRENT_TASK.md` points to the next task.
- [ ] Architectural decisions are recorded when needed.

A phase additionally requires its acceptance criteria to be verified.

---

# 👶 Child Safety

The product is intended for children. Safety requirements are architectural:

- age-aware generation;
- safe-content constraints;
- no unnecessary child data collection;
- explicit handling of user-provided images/data;
- safe defaults;
- parent/guardian-oriented controls where appropriate;
- no claim of safety verification unless actually implemented and tested.

Detailed policy and implementation requirements will be expanded before production release.

---

# 🌍 Localization

Persian/RTL is a first-class target.

The system must support:

- Persian text generation;
- RTL book layouts;
- Persian typography;
- localized numbers where required;
- LTR/RTL mixed content;
- additional languages without redesigning the domain model.

---

# 🚀 Current Task

Read:

- `docs/PROJECT_STATUS.md`
- `planning/CURRENT_TASK.md`

The current goal is to complete the foundation specification and then build the first executable vertical slice.

---

# 📖 Documentation Map

| Document | Purpose |
|---|---|
| `AGENTS.md` | How an AI agent must work |
| `docs/PROJECT_STATUS.md` | Verified current state |
| `planning/CURRENT_TASK.md` | Exact next task |
| `docs/ROADMAP.md` | Full roadmap |
| `docs/PRODUCT_SPEC.md` | Product behavior |
| `docs/ARCHITECTURE.md` | Technical design |
| `docs/AI_ARCHITECTURE.md` | AI/agent design |
| `docs/DATA_MODEL.md` | Data/domain model |
| `docs/CHARACTER_CONSISTENCY.md` | Character identity strategy |
| `docs/DECISIONS.md` | Long-lived architectural decisions |

---

# 🤝 Continuity Promise

**If one LLM stops working on this repository, another LLM should be able to continue.**

Do not rely on hidden conversation memory. The repository is the project's durable memory.

---

# 📄 License

License will be selected and committed before the public V1 release milestone.
