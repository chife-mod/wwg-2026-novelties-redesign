# V4 — Bespoke Viz Spec (3 tiles)

**Date:** 2026-04-25
**Status:** Execution-ready spec. Companion to `2026-04-25-v4-design.md` §3.
**Scope:** Three non-standard visualizations: `MaterialsTileBubbles`, `MovementsAndComplicationsSunburst`, `HeightsProfileStrip`.
**Code home:** `prototype/src/components/v4/`.
**Design constraint reminder:** paper-light canvas, gold accent, no chart libs, hand-built SVG/CSS, Lato + Cormorant only, Tailwind tokens from `CLAUDE.md`.

---

## Tile 1 — `MaterialsTileBubbles`

Replaces `MaterialsTileB`. NobleFinance bubble-row chart adapted to brand × material cross-cut.

### Concept

One row per case material (8 rows). Within each row, a sequence of dots = brands using that material, dot diameter encodes count. Reader scans rows for "what material" and dots within a row for "who plays here." The cross-cut answers the editorially sharpest question: *which maison hangs its identity on which metal*.

### Rows and ordering

- **Material rows: 8 fixed**, in this order (top→bottom): Steel, Titanium, Rose Gold, White Gold, Yellow Gold, Ceramic, Platinum, Other (Carbon + Bronze + misc rolled up).
- Order = total count desc. Steel dominates (193) and anchors the top; "Other" sits at the bottom regardless of count to read as the catch-all.
- Row height: **34px**. 8 rows × 34 = 272px row stack. With 24px header + 16px footer stats ≈ 312px tile height. Slightly over the 220px target but that target is wrong for this density of info — request variance to **~320px** (still well under flagship 360px).

### Within-row dot ordering — the contentious choice

**Decision: sort dots descending by count, packed left-to-right with a 4px min gap.** Not aligned to a brand-axis. Not jittered.

Why not "x = avg price for that brand×material":
- We don't have brand×material price; faking it adds noise and a third dimension nobody asked for.
- Editorial reading is "Rolex owns steel, Patek owns platinum" — count rank is the story.

Why not centred/symmetric:
- Bubble rows are scanned like a sentence, left to right. Centred packing wastes the left edge and makes "who's biggest" require eye travel.

Why not bubble-pack (cluster):
- Cluster packing reads as "blob of dots" not "sorted ranking." We want the eye to land on the dominant brand first.

**Result:** the leftmost dot in each row is the dominant brand for that material, biggest dot. Reader sees "Steel: huge Rolex, big Tudor, then a tail" without a tooltip.

### Dot size scale

- **Sqrt scale** (area ∝ count) — linear-radius would let big counts blow up the row and tiny counts vanish. Sqrt is the standard for bubble encodings and we don't deviate.
- Diameter clamps: `min 6px, max 28px` (not 36 — 36 collides with 34px row height and bleeds into neighbouring rows).
- Reference: `d = clamp(6, 28, 28 * sqrt(count / globalMaxCount))` where `globalMaxCount` is Rolex×Steel = ~32. One scale across all rows so cross-row size comparison is meaningful.

### Dot colour — the second contentious choice

**Decision: monochrome ink-deep (`#1E1D19`) at 70% opacity, peak dot per row in gold (`#A98155`).**

Rejected alternatives:
- *Brand-coloured*: 60+ brands → palette chaos, loses the gold accent's editorial weight, and we don't have brand colours defined.
- *Material-coloured (steel = mute, gold = gold, ceramic = ink)*: tempting but the row label already carries the material identity. Colour-coding the dots duplicates that signal and forces us to invent yet more swatch decisions.
- *All gold*: prevents the per-row "winner" highlight from working.

Monochrome + one gold accent per row gives instant scan: gold dot = "this brand owns this material." Across 8 rows you get 8 gold dots that together tell the story (Rolex owns Steel, AP owns Ceramic, Patek owns Platinum, etc.).

### Row chrome

- **Material label**, left, **80px wide column**, right-aligned, `text-[12px] font-semibold uppercase tracking-eyebrow text-mute-3`. e.g. `STEEL`, `TITANIUM`, `ROSE GOLD`.
- **Bubble lane**, flex-1, dots packed from left.
- **Right-edge stats column**, **84px wide**, left-aligned: `text-[14px] tabular-nums text-ink` for count, `text-[11px] tabular-nums text-mute-3` for `% of all` underneath. e.g. `193` / `40%`.
- Row separator: hairline `border-b border-ink/[0.06]` between rows. No alternating tint — too much noise for 8 thin rows.
- Empty rows are not possible in this dataset; not engineering for them.

### Hover behaviour

- **Hover a dot**: tooltip card (`bg-ink-deep text-paper rounded-sm px-3 py-2 text-[12px]`, drop shadow) appears above-right of the dot. Three lines:
  - Line 1: `Rolex · Steel` (brand · material, Lato 13px)
  - Line 2: `32 novelties` (Lato 14px tabular-nums)
  - Line 3: `55% of Rolex` (Lato 11px mute, computed `count / brand_total`)
- **Other dots in same row dim to 30%**, hovered dot stays at 100%, gets `ring-1 ring-gold` overlay. Other rows untouched (we want to preserve the cross-row context — if you dim everything you lose the comparison).
- **Hover a material label** (left column): all dots in that row pulse to 100%, all other rows dim to 40%. Reads as "show me this material."
- **No hover on the right-edge total** — it's a static label.

### Tile chrome

- Header: `text-[16px] font-bold uppercase leading-[1.3] tracking-[0.01em] text-gold` — `Case materials`. Matches existing tiles.
- No subhead, no kicker, no insight footer (Materials does not get an editorial Note per V4 spec §4).
- Card: `rounded-sm border border-ink/5 bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.22)]`.
- col-span: **6** (mid-tier, half-width). Confirmed against §5.

### Synthetic data

We need a brand × material matrix. Not in `data.ts`. Propose adding to `data.ts`:

```ts
// Brand × material counts. Rows = top brands using each material.
// Numbers are placeholder, distributions match plausible WWG 2026 reality:
// Steel dominated by Rolex/Tudor; Rose Gold spread across Cartier/Piaget/Chopard;
// Platinum is a Patek-and-friends story; Ceramic is AP/Hublot/Chanel.
export type MaterialBrandCount = { brand: string; count: number }
export type MaterialBubbleRow = {
  material: string
  total: number   // for sanity vs caseMaterials[].count (small drift OK)
  brands: MaterialBrandCount[]
}

export const materialBubbles: MaterialBubbleRow[] = [
  { material: 'Steel',      total: 193, brands: [
    { brand: 'Rolex', count: 32 }, { brand: 'Tudor', count: 24 },
    { brand: 'Tissot', count: 14 }, { brand: 'IWC', count: 12 },
    { brand: 'Eberhard & Co.', count: 11 }, { brand: 'Hamilton', count: 10 },
    { brand: 'Longines', count: 9 }, { brand: 'Oris', count: 8 },
    { brand: 'TAG Heuer', count: 8 }, { brand: 'Zenith', count: 7 },
    { brand: 'Bulgari', count: 6 }, { brand: 'Chopard', count: 5 },
    { brand: 'Hublot', count: 4 }, { brand: 'Other (12)', count: 43 },
  ]},
  { material: 'Titanium',   total: 56,  brands: [
    { brand: 'IWC', count: 8 }, { brand: 'Tudor', count: 7 },
    { brand: 'Hublot', count: 6 }, { brand: 'Bvlgari', count: 5 },
    { brand: 'Panerai', count: 5 }, { brand: 'Zenith', count: 4 },
    { brand: 'Eberhard & Co.', count: 4 }, { brand: 'Other (9)', count: 17 },
  ]},
  { material: 'Rose Gold',  total: 53,  brands: [
    { brand: 'Cartier', count: 8 }, { brand: 'Piaget', count: 7 },
    { brand: 'Chopard', count: 6 }, { brand: 'Patek Philippe', count: 6 },
    { brand: 'Bvlgari', count: 5 }, { brand: 'Rolex', count: 4 },
    { brand: 'Vacheron Constantin', count: 4 }, { brand: 'Other (10)', count: 13 },
  ]},
  { material: 'White Gold', total: 35,  brands: [
    { brand: 'Patek Philippe', count: 6 }, { brand: 'Vacheron Constantin', count: 5 },
    { brand: 'A. Lange & Söhne', count: 4 }, { brand: 'Rolex', count: 4 },
    { brand: 'Piaget', count: 4 }, { brand: 'Audemars Piguet', count: 3 },
    { brand: 'Other (7)', count: 9 },
  ]},
  { material: 'Yellow Gold',total: 22,  brands: [
    { brand: 'Rolex', count: 5 }, { brand: 'Cartier', count: 4 },
    { brand: 'Bvlgari', count: 3 }, { brand: 'Piaget', count: 3 },
    { brand: 'Chopard', count: 2 }, { brand: 'Other (5)', count: 5 },
  ]},
  { material: 'Ceramic',    total: 24,  brands: [
    { brand: 'Hublot', count: 6 }, { brand: 'Audemars Piguet', count: 5 },
    { brand: 'Chanel', count: 4 }, { brand: 'Bvlgari', count: 3 },
    { brand: 'Rado', count: 3 }, { brand: 'Other (3)', count: 3 },
  ]},
  { material: 'Platinum',   total: 15,  brands: [
    { brand: 'Patek Philippe', count: 5 }, { brand: 'A. Lange & Söhne', count: 3 },
    { brand: 'Vacheron Constantin', count: 3 }, { brand: 'Audemars Piguet', count: 2 },
    { brand: 'Breguet', count: 2 },
  ]},
  { material: 'Other',      total: 20,  brands: [
    { brand: 'Hublot', count: 4 }, { brand: 'Richard Mille', count: 3 },
    { brand: 'Panerai', count: 3 }, { brand: 'Bvlgari', count: 2 },
    { brand: 'Bell & Ross', count: 2 }, { brand: 'Other (8)', count: 6 },
  ]},
]
```

Total novelties via materials = 418 (vs 478 fair total — gap absorbed by "Other" material × Other brand long tails). Acceptable for prototype.

### Implementation notes

- Render dots as `<svg>` per row, single `<svg>` per row keeps gap math trivial. Or pure HTML with `flex` + `gap` and circle `<div>`s — both work. Prefer SVG so we can do the ring overlay on hover cleanly.
- Hover state: `useState<{ row: number; idx: number } | null>(null)` at component root, conditional class on every dot. Tooltip is a single absolutely-positioned div, content driven by hover state.
- "% of brand" requires a `brandTotals` lookup — derive at module load from `brands` array (top 10) + fallback "rest of fair" for tail brands.

---

## Tile 2 — `MovementsAndComplicationsSunburst`

Replaces `FunctionsTileB` + `MovementTileF`. Two rings: inner movement family, outer top complications coloured by parent family.

### Concept

A single watch-mechanism diagram. Inner ring = mechanical foundation (Auto/Manual/Quartz). Outer ring = the complications that ride on top, coloured by which family they predominantly belong to. One viz absorbs two former tiles and adds a structural fact (chronograph is mostly automatic, moonphase is split).

### Plan-B check

The brief asks: if sunburst feels like every D3 example, propose a Marimekko alternative.

**Decision: build the sunburst, but with editorial restraint** — radial labels only for inner ring, outer ring labels go to a right-side legend strip with leader-coloured swatches. Reasoning:

- Marimekko is more legible for "what % of Auto is Date" but it loses the watch-mechanism-as-clockface metaphor that makes the sunburst feel native to the subject. We're a watch publication — circular = correct.
- The cliché-protection move is **NOT** to abandon the form but to strip the standard sunburst tells: no rainbow palette, no curved labels (which always look like Excel), no breadcrumbs on hover. Three colours, restrained tonal variation, hairline separators.
- If after build it still reads as D3-default, fall back to Marimekko (see §Plan B at end).

### Geometry

- **Outer diameter: 200px.** Centred, 240px tile height, 20px breathing above and below.
- **Inner ring (movements)**: outer-radius 70px, inner-radius 36px → ring thickness **34px**.
- **Outer ring (complications)**: outer-radius 100px, inner-radius 74px → ring thickness **26px**.
- **Gap between rings**: 4px (clean separation, not connected — they're related but distinct mechanical layers).
- **Centre disc**: filled `bg-white` (matches tile background, so reads as "hole"), diameter 72px. Inside it: see §Centre.
- **Segment gap (kerf)**: 1.5px stroke `paper` between adjacent segments — same trick as a printed pie diagram.

### Ring rotation and segment ordering

**Decision: outer segments are anchored to their parent inner segment, not free-sorted.**

Inner ring, 12 o'clock start, clockwise:
- Automatic 64% (302/478) — sweeps from 0° to 230°.
- Manual 26% (124/478) — 230° to 323°.
- Quartz 11% (52/478) — 323° to 360°.

Outer ring, each complication sits within the angular span of its parent movement:
- **Auto-family complications** sit in the 0°–230° arc: Date (auto share), Sweeping seconds, Hacking seconds, Chronograph, Power Reserve, Tourbillon, Day/Night.
- **Manual-family complications** sit in 230°–323°: Date (manual share), Tourbillon (manual share), Power Reserve (manual share).
- **Quartz-family**: just Date and a tiny "other" sliver.

Within each family arc, complications sorted by share desc clockwise from the inner-segment's start angle.

Why anchored not free-sorted:
- The whole reason for two rings instead of one outer-only chart is the parent-child relationship. If outer is sorted by total count regardless of parent, we lose the structural insight ("chronograph requires automatic"). The visual tax — outer arcs are uneven length — is the price of the insight.
- Reader can still rank complications by eyeballing arc length within and across families.

### Colour mapping

Three base colours, one per movement family:

- **Automatic** = gold `#A98155` (the dominant, the hero, gets the accent)
- **Manual** = ink-deep `#1E1D19` (dense, traditional, gets the gravitas)
- **Quartz** = mute `#C6C6C6` (neutral, supporting role)

Outer complication segments inherit parent at **62% opacity** (not 60, not 70 — 62 reads as "clearly tinted but recognizably same family" in our test). Implementation: `<rect>` or `<path>` with `fillOpacity="0.62"` over the same base hex.

This gives a 6-shade chart from 3 colours. Editorially restrained, no rainbow.

### Labels

Inner ring:
- Family name + count, rendered **horizontally inside the ring segment**, anchored at the segment's centroid. Lato 11px semibold uppercase tracking-eyebrow.
- Colour: Automatic label = `text-ink-deep` (gold bg, dark text); Manual = `text-paper` (dark bg, light text); Quartz = `text-ink` (mute bg, dark text).
- Format: two lines — `AUTO` / `302`. Skip if segment angular span < 30° (Quartz is borderline, force-show because it's only 3 categories).

Outer ring:
- **No on-segment labels.** Curved text always looks awkward at 26px ring thickness and small angular spans.
- Right-side legend strip, 110px wide column to the right of the chart, 2-column layout: swatch (8×8 rounded-sm) + complication name (Lato 12px) + count (Lato 12px tabular-nums right-aligned). Sorted by count desc. Top 6 complications listed; rest collapsed into "Other" row.

### Centre

**Decision: empty white disc with one number + one word.**

```
89%
mechanical
```

- `89%` rendered Lato 32px light tabular-nums, ink (not gold — gold is reserved for Automatic family in this tile, using it in centre would dilute).
- `mechanical` rendered Lato 9px semibold uppercase tracking-eyebrow mute-3.
- Centred horizontally, vertically positioned with the 89% on the geometric centre and "mechanical" below.

This carries forward the existing MovementTileF center treatment, which Oleg already approved. Continuity = good.

Rejected: "478 novelties" (already in hero), "WWG 2026" (already in eyebrow), blank (wastes the strongest pixel real estate on the page).

### Hover behaviour

- **Hover outer segment**: that segment goes to 100% opacity, parent inner segment also goes to 100%, all other segments dim to 25% opacity. Tooltip near cursor: `Date · Automatic family · 142 novelties · 30% of fair`. Legend row for that complication highlights with `bg-ink/5`.
- **Hover inner segment**: that family stays 100%, all child outer segments stay 62% (their normal), everything else dims to 25%. Tooltip: `Automatic · 302 novelties · 64% of fair`.
- **Hover legend row**: equivalent to hovering the outer segment.

Cross-highlight is the whole point of the two-ring form. Without it, the parent-child relationship requires careful eyeballing; with it, one hover tells the whole story.

### Tile chrome

- Header: `text-[16px] font-bold uppercase leading-[1.3] tracking-[0.01em] text-gold` — `Movement & complications`.
- Layout: header → 1fr row containing `<svg>` (left, 200px wide) + legend strip (right, ~110px). Total tile height ~240px.
- col-span: **6** (mid-tier).
- No insight Note (per V4 §4).

### Data prep

Existing `movements` and `functions` give totals but not the cross-tab. Add to `data.ts`:

```ts
// Movement family × complication crosstab. Counts may exceed novelty count
// because one watch can have multiple complications (date + chrono).
export type ComplicationByFamily = {
  name: string
  auto: number
  manual: number
  quartz: number
  total: number   // sum, also used for outer-ring sort
}

export const complicationsByMovement: ComplicationByFamily[] = [
  // Sweeping/Hacking/Date are quasi-base — included so the outer ring isn't sparse.
  { name: 'Date',                    auto: 142, manual: 48, quartz: 20, total: 210 },
  { name: 'Sweeping Seconds',        auto: 134, manual: 22, quartz: 0,  total: 156 },
  { name: 'Hacking Seconds',         auto: 38,  manual: 10, quartz: 0,  total: 48  },
  { name: 'Power Reserve',           auto: 11,  manual: 5,  quartz: 0,  total: 16  },
  { name: 'Chronograph',             auto: 14,  manual: 2,  quartz: 0,  total: 16  },
  { name: 'Moon Phase',              auto: 12,  manual: 6,  quartz: 0,  total: 18  },
  { name: 'Day/Night Indicator',     auto: 11,  manual: 2,  quartz: 0,  total: 13  },
  { name: 'Tourbillon',              auto: 7,   manual: 4,  quartz: 0,  total: 11  },
  { name: 'Flyback Chronograph',     auto: 6,   manual: 1,  quartz: 0,  total: 7   },
  { name: 'Calendar',                auto: 5,   manual: 1,  quartz: 0,  total: 6   },
]
```

For the outer ring, take top 6 by `total` (Date, Sweeping, Hacking, Moon, Power Reserve / Chronograph tied). Remaining → "Other" segment per family.

### Plan B (Marimekko) — decision rule

After first build, eyeball test:
- Does the sunburst read as "watch mechanism diagram" within 3 seconds? Ship.
- Does it read as "default D3 sunburst from a tutorial"? Reroute to Marimekko: stacked horizontal bar, full tile width, three rows = three movement families, segments within each row = complications. Same colour rules. Less photogenic but more legible.

Ship-first because the watch-as-clockface metaphor is genuinely native here, and the 3-colour restraint should differentiate it from D3 defaults.

---

## Tile 3 — `HeightsProfileStrip`

Replaces `HeightsTileB`. A row of horizontal watch-case silhouettes drawn at scale.

### Concept

Replace a list of millimetres with the actual mm. Six silhouettes left-to-right, each scaled to its mm bucket, labelled with count above. Reader sees the case-thickness distribution physically — slim wins instantly because the leftmost silhouette is visibly tiny.

### Buckets

`caseHeights` data has 10 entries from 6 mm to 15 mm. Compress to **6 buckets**:

| Bucket | mm range | midpoint mm | count (sum from data) |
|--------|----------|-------------|------------------------|
| Ultra-slim | 6–7 mm | 6.5 | 119 |
| Slim       | 8–9 mm | 8.5 | 90 |
| Standard   | 10–11 mm | 10.5 | 81 |
| Sport      | 12–13 mm | 12.5 | 62 |
| Chunky     | 14 mm | 14 | 29 |
| Extreme    | 15+ mm | 15.5 | 11 |

Total = 392 (close to fair total 478; gap = case heights not specified).

Six was chosen over five (loses the "Extreme" outlier story) and over four (loses the slim/standard/sport granularity that's the actual narrative — slim is destroying standard).

### Silhouette form

**Decision: simple horizontal puck with rounded ends — a 2D side-view of a watch case, no crown, no lugs.**

Geometry per silhouette (SVG):
- Width: **64px** (constant — see §Width).
- Height: scaled, see §Height.
- Top edge: convex curve (slight dome — `Q` Bezier with control point 4px above the rect top).
- Bottom edge: flat.
- Corner radius: 4px on top corners, 2px on bottom corners (case-back is flatter).

Rejected:
- *Pure rounded rectangle*: too generic, reads as "pill" not "watch case."
- *Realistic profile with crown notch + lugs*: at 64px wide and 6–15px tall, lugs vanish to 1px and the crown becomes a smudge. Bespoke detail that doesn't survive the scale. Save it for a hero illustration elsewhere.
- *Sapphire dome on top + flat caseback line*: tried mentally — adds nothing beyond the slight convex top curve already proposed.

The single design move (subtle dome on top edge) is what reads as "watch" vs "pill." That's enough.

### Width — same or encoded?

**Decision: all silhouettes same width (64px).** Width is reserved purely for tile rhythm. Encoding both width and height with the same variable (count) would be redundant and would make small-count buckets disappear visually.

If it later feels like the bucket counts need width emphasis — overlay a thin gold underline whose length = count proportion. Tested mentally; cluttered. Skip.

### Height encoding

- **Linear scale, mm-to-px ratio: 3.0**. So 6.5mm bucket = 19.5px tall, 15.5mm bucket = 46.5px tall. Range 19→47px is comfortably visible across tile compact height.
- Anchored to a common **baseline** (silhouettes sit on the same bottom line — `border-b border-ink/10` underneath).
- Tile internal vertical layout: top label band 18px → silhouette band 50px → baseline 1px → bottom label band 18px → 5px footer = ~92px content + p-5 padding (40px) ≈ 132px. Rounds to brief's 120px target ±10px.

If it doesn't fit in 120px on first build, drop bucket label band underneath (mm range only on hover) — saves 18px and gets us to 114px.

### Layout and rhythm

```
[ULTRA-SLIM] [SLIM] [STANDARD] [SPORT] [CHUNKY] [EXTREME]
   119         90      81        62      29       11        ← count labels (above)
   ▔▔▔▔▔   ▔▔▔▔▔  ▔▔▔▔▔▔   ▔▔▔▔▔   ▔▔▔▔   ▔▔
   ████    █████   ██████  ███████  ██████ ████        ← silhouettes (baseline-aligned)
   ─── baseline ───────────────────────────────
   6–7mm   8–9mm  10–11mm  12–13mm  14mm   15+mm        ← mm range (below, mute-3 11px)
```

- Six silhouettes spread with `flex justify-between`, container `px-2`.
- Each silhouette unit = 64px wide × full strip height; silhouette itself sits at the bottom of the unit.
- Count label: above silhouette, **Lato 14px tabular-nums ink**, with the peak bucket in **Lato 14px tabular-nums semibold gold**.
- mm range label: below baseline, **Lato 10px uppercase tracking-eyebrow mute-3**, peak in gold.
- Bucket name (`ULTRA-SLIM` etc.): NOT shown. Adds clutter for marginal info; the mm range is sufficient and the visual height already encodes the concept.

### Highlight

**Decision: peak bucket = solid gold fill. Others = ink-deep at 100%.**

Why not all the same:
- The story is "ultra-slim is the new dominant" — peak deserves visual privilege.
- A one-colour-pop accent is consistent with how PriceTileD and DiameterTileD treat their peaks. Cross-tile consistency.

No hover state. This is a compact tile in V4 §5 row 6, "no tooltips on tiles that don't need them" (V4 §7 anti-list item 4). Static labels do the work.

### Tile chrome

- Header: `text-[16px] font-bold uppercase leading-[1.3] tracking-[0.01em] text-gold` — `Case heights`.
- Card: `rounded-sm bg-paper/60 p-5 shadow-[0_8px_20px_rgba(0,0,0,0.14)]` — note `bg-paper/60` not white, per V4 §5 compact-row spec.
- col-span: **4**.
- Min-height: 120px target; spec lands at ~132px. Will request 132 or trim mm-range row to hit 120 exactly, depending on grid alignment with neighbours `StrapsCompact` and `EditionsTileD`.

### Data

Existing `caseHeights` in `data.ts` has 10 entries by exact mm. Add a derived view rather than mutating:

```ts
// Heights bucketed for the V4 profile strip. Sums of caseHeights[] entries.
export type HeightBucket = {
  key: string         // 'ultra-slim'
  mmLabel: string     // '6–7mm'
  mmMid: number       // for height encoding, px = mmMid * 3
  count: number
}

export const heightBuckets: HeightBucket[] = [
  { key: 'ultra-slim', mmLabel: '6–7mm',  mmMid: 6.5,  count: 119 },
  { key: 'slim',       mmLabel: '8–9mm',  mmMid: 8.5,  count: 90  },
  { key: 'standard',   mmLabel: '10–11mm',mmMid: 10.5, count: 81  },
  { key: 'sport',      mmLabel: '12–13mm',mmMid: 12.5, count: 62  },
  { key: 'chunky',     mmLabel: '14mm',   mmMid: 14,   count: 29  },
  { key: 'extreme',    mmLabel: '15+mm',  mmMid: 15.5, count: 11  },
]
```

Computed from existing `caseHeights` totals: 6mm(13)+7mm(106)=119; 8mm(50)+9mm(40)=90; 10mm(39)+11mm(42)=81; 12mm(35)+13mm(27)=62; 14mm(29)=29; 15mm(11)=11. Sums match exactly.

### Implementation notes

- One root `<svg width="100%" height="50">` for the silhouette band, six `<path>` elements positioned by x offset.
- Path template per bucket:
  ```
  M ${x} ${baseline}
  L ${x} ${baseline - h + 4}
  Q ${x} ${baseline - h}, ${x + 4} ${baseline - h}
  L ${x + 60} ${baseline - h}
  Q ${x + 64} ${baseline - h}, ${x + 64} ${baseline - h + 4}
  L ${x + 64} ${baseline}
  Z
  ```
  (The `Q` curves give the top corners; the slight dome we add by raising the midpoint of the top edge — extend with another mid-Q if the test build looks too rectangular.)
- Or, simpler: render as 6 separate divs, each `<div className="rounded-t-[6px] bg-ink-deep" style={{ height: `${mmMid * 3}px`, width: '64px' }}>`. CSS-only, no SVG. Lose the dome, but the prototype-grade silhouette still reads. **Recommend starting CSS-only**, upgrade to SVG path only if Oleg flags the rounded-rect as too "pill."

---

## Summary (≤ 200 words)

**MaterialsTileBubbles.** Eight rows = eight materials, dots = brands packed left-to-right by count desc, sqrt-scale, ink-deep with gold for the per-row leader. Right column shows total + share. Cross-cut "who owns which metal" earns the tile its keep. **Most contentious choice:** dot ordering (sort by count, not aligned to a brand-axis or jittered) — the editorial framing wants ranks, not a 2D scatter.

**MovementsAndComplicationsSunburst.** Two-ring chart, inner = movement family (gold/ink-deep/mute), outer = complications anchored within their parent family arc at 62% opacity. Centre carries `89% mechanical` from existing MovementTileF. Right-side legend instead of curved labels. **Most contentious choice:** anchoring outer segments to parent (uneven outer arc lengths) instead of free-sorting by total — preserves the parent-child story at the cost of one-glance ranking.

**HeightsProfileStrip.** Six height-scaled silhouettes (3px-per-mm), baseline-aligned, peak in gold. Subtle dome on top edge is the only "this is a watch" cue. **Most contentious choice:** constant width (64px), height-only encoding — refuses to double-encode count.

**Most likely to ship as designed:** HeightsProfileStrip — minimal complexity, single decisive metaphor, no hover state, concrete data.

**Most likely to need Plan B:** MovementsAndComplicationsSunburst — sunburst is genre-cliché; the 3-colour restraint and parent-anchored outer ring are bets that need eyeball confirmation. Marimekko fallback already specced.
