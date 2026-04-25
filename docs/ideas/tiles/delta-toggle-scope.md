# Count/% toggle scope — global behaviour change

**Date:** 2026-04-25
**Affects:** `useFormatCount`, `DeltaChip`, `DeltaChipPct` (in `common.tsx`)
**Touched call sites:** 11 tile variants (every front-tier tile in V5)

## Problem

Original `useFormatCount` reformatted ALL count numbers when the toggle
flipped to `%`: «Rolex 58 novelties» became «Rolex 12.1%». Oleg, three
times: «значение не меняем — Rolex как было 58 моделей, так и осталось 58 в
этом году. Меняем переключение штуки/проценты ТОЛЬКО в дельтах».

Semantic distinction:
- **Count** is an absolute (Rolex made 58 models in 2026).
- **Delta** is a difference (Rolex made 8 more than in 2025).
- The Δ has two equivalent representations: «+8 novelties» (count delta) or
  «+16% growth» (relative %). The toggle picks between them.
- The count itself has no equivalent percentage rendering — % of what?
  478 (total novelties)? 60 (brand count)? Different denominators per tile.
  Switching to «12.1%» loses the sense of scale and means different things
  in different tiles. Confusing.

## Decided

- **`useFormatCount`** always returns the raw count, regardless of toggle
  mode. Kept as a hook (not a plain `String()` call) to preserve every call
  site and leave a single place to revisit if a future viz needs share-of-
  total again. The `total` parameter is now ignored.

- **`DeltaChip({ delta, count? })`** is reactive to ViewMode:
  - `count` mode → renders absolute «+8» (current behavior)
  - `pct` mode + `count` provided → computes `delta / (count - delta) × 100`,
    renders «+16%»
  - `pct` mode + no `count` → graceful fallback to «+8»

- **`DeltaChipPct({ pct, absDelta? })`** mirror image:
  - `pct` mode → renders «+12%» (current behavior)
  - `count` mode + `absDelta` provided → renders «+8» (raw count delta)
  - `count` mode + no `absDelta` → graceful fallback to «+12%»

## Call sites updated

Every front-tier tile in V5 was updated to pass the additional prop. Tiles
that don't receive count/absDelta keep their pre-existing behavior — no
breakage, just no toggle reactivity until backfilled.

| Tile | Component | Prop added |
|---|---|---|
| Top brands       | BrandsTileD       | `count={b.count}`  |
| Top collections  | CollectionsTileB  | `count={c.count}`  |
| Dial colours     | DialsTileF        | `count={d.count}`  |
| Strap materials  | StrapsTileC       | `count={s.count}`  |
| Complications    | FunctionsTileB    | `count={f.count}`  |
| Case materials   | MaterialsTileB    | `count={m.count}`  |
| Case heights     | HeightsTileB      | `count={h.count}`  |
| Movements        | MovementTileF     | `count={m.count}`  |
| Editions         | EditionsTileD     | `count={e.count}`  |
| Price ranges     | PriceTileD        | `absDelta={counts26[i] - counts25[i]}` |
| Diameters        | DiameterTileD     | `absDelta={counts26[i] - counts25[i]}` |

## Why this works

The toggle is now a meaningful UX choice: «show me the change in absolute
units OR in percent growth». Both are first-class deltas. Counts stay
counts. No more «what does 12.1% mean here?» moments.

## Open issues

- **Sandbox tile variants** (BrandsTileE, MovementTileC, etc. — older
  variants accessed only through tile drill-down) still use the
  count-only delta. Toggle won't affect them. Low priority — they're
  rendered only when actively browsing the sandbox.
- **Hero KPI deltas** (`HeroDeltaPct` in App.tsx and V4/V5.tsx) currently
  show only %. Could be made reactive too, but they live in a different
  component family and HERO_DELTAS only stores % values — would need raw
  hero count deltas added to data. Defer.
