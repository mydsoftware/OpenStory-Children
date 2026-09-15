# Character Consistency

Character consistency is a core feature, not an optional image-generation enhancement.

## Character Identity

A character should have a stable canonical profile containing:

- name
- species/type
- age/category
- physical traits
- colors
- clothing/accessories
- personality
- relationships
- visual style
- reference assets
- version history

## Generation Strategy

The system should progressively support:

1. text-only identity constraints;
2. canonical character sheet;
3. reference images;
4. provider-specific reference/control mechanisms;
5. consistency QA;
6. regeneration of only the affected asset.

## Invariants

If a character is unchanged, subsequent pages should reuse the same canonical identity/version rather than silently inventing a new one.

## QA Signals

Where supported, compare generated output against reference metadata/assets. Never claim pixel-perfect identity unless the configured system can actually verify it.
