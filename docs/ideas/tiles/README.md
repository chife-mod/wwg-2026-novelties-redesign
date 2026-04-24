# Tile decision logs

Per-tile retrospective documentation for visual-hypothesis exploration.
Each file captures **problem → variants tried → winner → why**, written
**after** the choice is made.

See [`docs/principles/design-first-plus-decision-log.md`](../../principles/design-first-plus-decision-log.md)
for the workflow and template.

## File naming

One file per tile, named by its `id` in `prototype/src/components/current/tileRegistry.tsx`:

```
docs/ideas/tiles/
├── top-brands.md
├── top-collections.md
├── price.md
├── dials.md
├── straps.md
├── diameter.md
├── functions.md
├── materials.md
├── heights.md
├── movement.md
└── editions.md
```

Files appear here only once a tile has had its first hypothesis round —
we do not pre-seed empty stubs.

## Index

- [top-brands](top-brands.md) — 2026-04-24 — gold title, bare numbers, bigger logos (D)
- [top-collections](top-collections.md) — 2026-04-24 — gold title, brand logos, bare numbers (B)
- [price](price.md) — 2026-04-24 — YoY dot marker + gold hairline (D, production) · C used as sandbox research card
