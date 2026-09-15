# Data Model

Initial conceptual model. Exact database schema is a Phase 02 deliverable.

```text
Project
 └── Book
      ├── Characters
      ├── Locations
      ├── Chapters
      │    └── Pages
      │         └── Panels
      │              ├── Dialogue
      │              ├── Caption
      │              └── Assets
      ├── GenerationJobs
      └── Versions
```

## Required Properties

Every persisted generated artifact should be traceable to:

- project/book id;
- version;
- creation timestamp;
- source input or parent artifact;
- model/provider metadata when applicable;
- prompt/template version when applicable;
- generation parameters when applicable;
- status;
- validation/QA status.

## Versioning

Editing or regenerating a page must not silently overwrite historical output. The model should support draft and published/export snapshots.
