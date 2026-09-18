# Release Process

## Pre-release gate

1. Run `pnpm check`.
2. Run `pnpm --filter @openstory/web build`.
3. Start the web app and perform browser verification of `/studio`.
4. Verify generation, QA, provider controls, project library, load/delete, editing, scoped panel regeneration and HTML export.
5. Repair failures and rerun the affected checks.
6. Sync `docs/PROJECT_STATUS.md`, `docs/V1_STATUS.md` and `planning/CURRENT_TASK.md`.

## V1.0

Do not create the `v1.0.0` tag until automated CI and browser verification both pass.

## Release notes

Record the commit SHA, CI run, user-visible features, provider requirements, known limitations and verification evidence.