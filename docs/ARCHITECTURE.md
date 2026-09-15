# Architecture

## Target Architecture

OpenStory Children is a modular AI application. The domain layer must not depend directly on a specific LLM, image model, storage vendor, or deployment platform.

```text
User
  ↓
Web/App UI
  ↓
Application Services
  ↓
Orchestrator / Jobs
  ↓
Domain Engines
  ├── Story Engine
  ├── Character Engine
  ├── Scene Engine
  ├── Comic Engine
  ├── Book Renderer
  └── QA Engine
       ↓
Provider Interfaces
  ├── LLM
  ├── Image
  ├── Audio
  └── Storage
       ↓
Local / Cloud Implementations
```

## Core Domain Objects

- Project
- Book
- Chapter
- Page
- Panel
- Character
- Location
- Scene
- Dialogue
- Asset
- GenerationJob
- Provider
- Review

## Architectural Rules

1. Domain models remain provider-neutral.
2. AI output is validated before entering the canonical book model.
3. Generation is asynchronous where work may be expensive.
4. Every generated artifact should have provenance metadata where practical.
5. Regeneration must not silently destroy the previous version.
6. Character identity is versioned and reusable.
7. Rendering is deterministic from a valid book model as far as possible.
8. UI must consume application APIs rather than bypassing domain rules.
9. Local AI and cloud AI use the same logical provider contracts.

## Provider Abstraction

Example conceptual interfaces:

```text
LLMProvider.generateStructured(...)
ImageProvider.generate(...)
AudioProvider.synthesize(...)
StorageProvider.put/get/delete(...)
```

Exact interfaces are to be finalized during Phase 02 after evaluating implementation constraints.

## Generation Pipeline

```text
request
→ normalize
→ plan
→ generate structured artifacts
→ validate
→ persist version
→ enqueue expensive generation
→ generate media
→ QA
→ repair/regenerate if needed
→ render
→ export
```

## Human Approval

The product may automatically generate proposals, but destructive or externally visible actions should have explicit review controls. Generated story text, images, and layouts must remain editable.
