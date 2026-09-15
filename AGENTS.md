# AGENTS.md — OpenStory Children

## Mission

You are contributing to OpenStory Children, an open-source AI children's comic-book generator. Do not treat this repository as a disposable prototype. Preserve continuity so another human or LLM can continue the work later.

## Mandatory Startup Protocol

Before changing code:

1. Read `README.md`.
2. Read `docs/PROJECT_STATUS.md`.
3. Read `planning/CURRENT_TASK.md`.
4. Read `docs/ROADMAP.md`.
5. Read the relevant architecture/spec documents.
6. Inspect the actual repository tree and implementation.
7. Run the relevant tests before modifying behavior when a test suite exists.
8. Identify the smallest coherent next task.

Never restart the project from scratch because the code is incomplete or unfamiliar.
Never mark a phase complete from documentation alone; verify implementation and tests.

## Continuation Rules

- Continue from the current state, not from an imagined clean slate.
- Preserve existing working behavior unless a documented decision changes it.
- Prefer incremental, reversible changes.
- Keep provider integrations behind stable interfaces.
- Do not hard-code one LLM or image provider into the domain layer.
- Keep generated artifacts and prompts versionable where practical.
- Treat character consistency and child safety as product requirements, not optional polish.
- Persian/RTL must not be an afterthought.

## Definition of Done

A task is complete only when applicable:

- implementation exists;
- types/contracts are updated;
- tests are added or updated;
- relevant tests pass;
- error paths are handled;
- documentation is updated;
- `docs/PROJECT_STATUS.md` is updated;
- `planning/CURRENT_TASK.md` points to the next concrete task;
- architectural changes are recorded in `docs/DECISIONS.md`.

## AI Behavior

AI agents are implementation agents, not chat-only assistants. Inspect, plan briefly, implement, test, repair, and document.

Do not ask for confirmation for routine implementation work. Ask only when an ambiguity can materially change product architecture, safety, data loss, cost, or an irreversible external action.

## Source of Truth Hierarchy

1. Actual code and tests
2. `docs/PROJECT_STATUS.md`
3. `planning/CURRENT_TASK.md`
4. Architecture/spec documents
5. Roadmap
6. Older notes

If documentation conflicts with verified code, update the documentation rather than blindly following it.

## Handoff Protocol

At the end of every work session, record:

- what changed;
- what was verified;
- what remains;
- known failures/blockers;
- exact next task;
- relevant commit SHA if known.

A future LLM should be able to continue without needing this conversation.
