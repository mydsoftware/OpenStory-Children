# Contributing to OpenStory Children

## Development

Requirements: Node.js 20+, pnpm 10.15.1.

```bash
pnpm install
pnpm check
pnpm --filter @openstory/web build
```

## Architecture rules

- Keep the canonical book model provider-neutral.
- Prefer deterministic fallback behavior when optional AI providers are unavailable.
- Keep server-only filesystem/provider code out of browser bundles.
- Add or update tests with every behavioral change.
- Do not mark a release gate complete from documentation alone.

## Pull requests

Describe the user-visible behavior, tests run, provider assumptions, and known limitations. Keep changes focused and preserve the verified baseline.
