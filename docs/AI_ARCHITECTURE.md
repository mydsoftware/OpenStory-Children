# AI Architecture

## Principle

OpenStory is an agentic generation pipeline, not a chatbot. The user expresses intent; specialized components produce and validate artifacts.

```text
User Intent
   ↓
Book Planner
   ↓
Story Agent
   ↓
Character Agent
   ↓
Scene/Page Agent
   ↓
Image Agent
   ↓
Layout Agent
   ↓
QA Agent
   ↓
Repair / Regenerate
   ↓
Book
```

## Agent Responsibilities

### Story Agent
Creates age-appropriate structured narrative and story beats.

### Character Agent
Creates character definitions, relationships, visual traits, and reusable references.

### Scene/Page Agent
Turns story beats into page and panel plans.

### Image Agent
Creates or requests visual assets through the configured image provider.

### Layout Agent
Places panels, captions, speech bubbles, and other book elements.

### QA Agent
Checks schema validity, continuity, age suitability, text overflow, and available visual consistency signals.

## Agent Contract

Every agent should have:

- explicit input schema;
- explicit output schema;
- deterministic validation;
- bounded responsibilities;
- retry/error behavior;
- provenance metadata;
- tests using fixtures.

## Structured Output

Free-form LLM text must not be the canonical state of the book. Convert model output into validated structured objects before persistence.

## Provider Independence

LLMs are accessed through a provider abstraction. Local providers such as Ollama/LM Studio and compatible cloud APIs can implement the same logical contract.
