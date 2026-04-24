# Adaptive list-tiles — deferred plan

**Status:** deferred. Execute after all 11 desktop tiles are in final form.
**Why deferred:** visual grammar still changing (rename, typographic rhythm,
delta conventions). Freezing breakpoint classes per-tile while grammar
shifts = double work. One sweep at the end is cheaper.

## Problem

List-tiles (brands, collections, straps, later functions/materials/heights)
have 5 columns: rank, logo/swatch, name+bar, count, delta. When the tile
gets narrow (≈ 220–300px), bars squeeze and the row becomes unreadable.
Today the layout just accepts bad look or relies on viewport media queries.

## Behavior we want

Progressive column drop based on the **tile's own width** (container
queries, not viewport). Reflow (tile jumps to its own row) is the LAST
step, not the first.

Priority order (first to go → last to go):

1. **Rank (01/02/03)** — redundant with list position. First out.
2. **Logo / swatch** — nice-to-have anchor, not essential. Second out.
3. Reflow — tile goes full-width via grid-cols-1 on its parent.

## Breakpoints (provisional)

| Tile width | Columns |
|---|---|
| ≥ 300px | rank · logo · name+bar · count · delta |
| 260–299px | logo · name+bar · count · delta |
| 220–259px | name+bar · count · delta |
| < 220px | reflow (tile takes full row) |

Refine after first implementation — breakpoint numbers are guesses
until we see it in browser.

## Technical plan

1. Install `@tailwindcss/container-queries` plugin; register in
   `tailwind.config.js`.
2. Add `@container` to `<article>` of each list-tile.
3. Switch grid template + hide cells with `@[260px]:` and `@[220px]:`
   utilities.
4. Apply to: BrandsTileD, BrandsTileD₁, CollectionsTileB, StrapsTileB,
   and any list-tiles built after (functions, materials, heights).
5. Non-list tiles (dials histogram, diameter, price histogram, editions
   cards) have their own adaptive story — out of scope here.

## When to execute

Trigger: all 11 tiles have a picked winner in their production form.
Sweep in one PR: plugin install + config + class edits across every
list-tile. No partial rollout — we want uniform behavior.
