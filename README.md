# OpenStory Children

Open-source AI platform for generating personalized children's comic books.

> **Project state:** Foundation / Planning
>
> This repository is designed to be a persistent handoff point for humans and AI coding agents. Any capable LLM should be able to read the project state, verify the implementation, and continue from the current task without restarting the project.

## Start Here for Any AI Agent

1. Read `AGENTS.md`.
2. Read `docs/PROJECT_STATUS.md`.
3. Read `planning/CURRENT_TASK.md`.
4. Read `docs/ROADMAP.md`.
5. Inspect the existing code and tests before making assumptions.
6. Continue from the first incomplete task.
7. Update project state and documentation after every meaningful implementation step.

## Vision

Turn a simple child-friendly idea into a complete illustrated comic book: story, characters, scenes, panels, dialogue, images, layout, quality checks, and export.

Example input:

> Create a 10-page Persian comic for a 4-year-old about a cute dinosaur named Dino who searches for his lost friend.

Target pipeline:

`Idea → Story Bible → Characters → Story → Pages → Panels → Images → Dialogue → Consistency QA → Layout → Book → Export`

## Product Principles

- Child-safe by design.
- Persian/RTL is a first-class experience.
- Local-first and provider-agnostic AI architecture.
- No hard dependency on one LLM or image model.
- Character and visual consistency are core requirements.
- Every generated artifact must be inspectable and reproducible where possible.
- AI agents must preserve project state for future agents.
- Prefer working software and tests over documentation-only completion.

## Planned Outputs

- Web comic reader
- PDF book
- Print-ready book
- EPUB/structured book where practical
- Optional narration/audio
- Optional animated/video story

## Roadmap

See `docs/ROADMAP.md` for the complete phased plan from zero to V1.0.

## Current Status

See `docs/PROJECT_STATUS.md` and `planning/CURRENT_TASK.md`. These files are the source of truth for continuation.

## License

License will be finalized before the first public release milestone.
