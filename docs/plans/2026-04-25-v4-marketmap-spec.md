# V4 — MarketMapTile execution spec

**Date:** 2026-04-25
**Parent doc:** `2026-04-25-v4-design.md` (§3 row "NEW: Market Map", §4 insight Note, §5 row 2)
**Status:** Implementation-ready spec for `prototype/src/components/v4/MarketMapTile.tsx`.
**Goal:** brand × price-bucket cross-tab as the signature analytical viz of V4. If this lands, the whole right grid earns its tier hierarchy. If it muddies, V4 is just current-with-shadows.

This document supersedes the heatmap sketch in the parent V4 doc. Where the two disagree, this spec wins.

---

## 1. Encoding — chosen: (d) Stratified bands, gold-tinted, on warm-white tiles

### Trade-off table

| Option | Pros | Cons | Verdict |
|---|---|---|---|
| **(a) Sequential paper→gold continuous** | Maximum information per pixel; standard heatmap reading | Bottom 60% of the ramp is paper-on-paper-on-paper; cell values 1–8 read as "background"; no visual structure at a glance | Reject — fails the "anonymous wallpaper" risk you flagged |
| **(b) Diverging gold-vs-mute around brand-row mean** | Built-in narrative ("over- / under-indexes"); midpoint anchor adds structure | Requires viewer to grok normalisation; brand-row Z-scores are a different story than absolute counts; loses the "where is the volume" headline that the chart should carry | Reject — clever, but answers a question nobody is asking yet |
| **(c) Bivariate (colour=count, size=row %)** | Beautiful when it works; double-encodes; small cells read as "rare" without colour effort | Two encodings to learn; harder to compare across brand rows because cells are different sizes; loses the gridded "map" feel that makes heatmaps satisfying | Reject — too clever for a signature tile that has to be readable in 2 seconds |
| **(d) Stratified 5-band ramp (paper / gold@10 / gold@30 / gold@60 / gold)** | Reads as a chart, not wallpaper — each band is visibly distinct; faster pattern-recognition than continuous; trivially WCAG-compliant per band; classy editorial feel (matches Phillips auction-report shaded tables) | Loses precision within bands; needs a discrete legend | **CHOOSE** |
| **(e) Asymmetric small-multiples (12 sparkbars)** | Cleanest fallback; shows distribution shape per brand vividly; no colour decisions needed | Loses the cross-brand comparison at the same price bucket — the *exact thing* that makes Brand×Price interesting; reduces to "12 mini-bar-charts", which is the bar-chart-болото we are escaping | Reject — but keep mentally as an emergency fallback if (d) prototypes badly |

### Why (d) wins

The job of this tile is **structural revelation**: "look at the gold diagonal — Rolex/Tudor own mid-luxury, Patek owns the top, independents live in the right tail." That is a *banded* observation, not a continuous-gradient observation. Five stratified bands (zero / faint / mid / strong / peak) make the diagonal pop on first glance without forcing the eye to do gradient-discrimination work. It also matches the auction-house aesthetic the V4 doc already locked in (Phillips season-recap shaded tables use 3-4 discrete fill levels, not gradients).

The continuous ramp is the **default** heatmap choice and exactly why most heatmaps look like wallpaper. Going stratified is the editorial-grade move.

---

## 2. Cell sizing & layout

### Axis orientation

**Brands as ROWS, price buckets as COLUMNS.** Two reasons:
- Brand names are long ("Jaeger-LeCoultre", "Patek Philippe") — they belong on the long readable axis (left rail). Rotated brand labels at the top would be ugly.
- Price scale is ordinal and reads naturally **left-to-right low→high**, matching the existing PriceTileD x-axis below it. Visual continuity between the two flagship rows.

### Sizing math (col-span-12, ~1100px content width)

Tile padding `p-7` = 28px each side → inner width ≈ **1044 px**.
Left rail (logo 24 + name + gap) ≈ **180 px**.
Bottom axis labels height ≈ **36 px**.
Top brand-row sum bar ≈ **20 px** (see §7).
Title block ≈ **56 px**.
Editor's Note + separator ≈ **64 px** (per V4 §4).

Available grid area: ~864 × ~200 px.

11 columns + 11 gaps (gap-px = 1px) → cell width ≈ **(864 - 10) / 11 ≈ 77 px**.
12 rows + 11 gaps (gap-px = 1px) → cell height ≈ **(200 - 11) / 12 ≈ 15.7 px**.

15.7 px tall is too thin — feels like a barcode, not a map.

**Resolution: bump tile minHeight from 320 → 400 px.** This gives ~280 px of grid area, → cell height ≈ **22 px**. Still letterbox but readable. Cell aspect ≈ 77 × 22 ≈ 3.5:1 — wide cells, which actually *helps* read the row direction (your eye sweeps left-to-right along a brand's price profile, which is the primary reading task).

### Top-12 vs top-10

**Keep top-12.** Rationale: the bottom 2 rows (positions 11–12) are where the editorial story lives — a maison like Jaeger-LeCoultre or Hublot showing a wider price spread than the top-3 specialists. Cutting to 10 to gain 4 px of cell height is a bad trade. We protect height by raising tile minHeight instead.

### No empty-bucket collapsing

Do **NOT** collapse adjacent empty buckets at brand-tail rows. The visual story *is* the emptiness. Collapsing would distort the price axis and break alignment with PriceTileD below.

### Cell padding

`gap-px` (1 pixel between cells). Reasoning: at 22px cell height, `gap-0.5` (2px) eats 18% of cell area for empty space, makes the grid feel sparse and weak. `gap-0` removes the grid-as-scaffold feeling. 1px gap on a paper background is the sweet spot — visible separator lines without losing density.

### Final dimensions

```
tile minHeight         400 px
grid area              ~864 × ~280 px
cell                   77 × 22 px
gap                    1 px
brand row label rail   180 px
price axis label band  36 px (bottom)
brand row sum bar      20 px (top of grid, see §7)
```

---

## 3. Colour ramp — 5 stratified bands

### Bands (count → fill)

The max cell on the synthetic matrix (§8) is **24** (Rolex × $10–25K). Bands are derived from `max`, not from absolute counts, so the ramp self-scales if data shifts.

| Band | Count range (relative to max=24) | Tailwind class | Hex on paper bg |
|------|----------------------------------|----------------|-----------------|
| 0 — empty | 0 | `bg-paper` (or hatch — see §4) | `#EEEDEC` |
| 1 — faint | 1 ≤ n ≤ ⌊max × 0.20⌋ = 1–4 | `bg-[#E8D9C2]` | gold @ ~22% mixed onto paper |
| 2 — mid | 5–9 (n ≤ ⌊max × 0.40⌋) | `bg-[#D9BC93]` | gold @ ~50% mixed |
| 3 — strong | 10–16 (n ≤ ⌊max × 0.70⌋) | `bg-[#C19767]` | gold @ ~75% mixed |
| 4 — peak | 17–24 (top 30% of max) | `bg-gold` = `#A98155` | full token |

Inline-style fallback per cell (so the ramp adapts to whatever max appears in real data):

```ts
const STOPS = ['#EEEDEC', '#E8D9C2', '#D9BC93', '#C19767', '#A98155'] as const
function bandIdx(n: number, max: number): 0 | 1 | 2 | 3 | 4 {
  if (n === 0) return 0
  const r = n / max
  if (r <= 0.20) return 1
  if (r <= 0.40) return 2
  if (r <= 0.70) return 3
  return 4
}
```

### Contrast check (non-text contrast, WCAG 1.4.11 ≥ 3:1)

Lowest non-zero band (`#E8D9C2`) vs paper background (`#EEEDEC`):
- Relative luminance: paper ≈ 0.842, faint ≈ 0.732
- Contrast ratio: (0.842 + 0.05) / (0.732 + 0.05) ≈ **1.14**

**Fails 3:1.** Faint band is too close to paper. Two fixes available:
1. **Add a 1px inner gold@40 hairline border to all non-empty cells.** The border carries the "this cell is filled" signal even when fill is barely darker than paper. `box-shadow: inset 0 0 0 1px rgba(169,129,85,0.40)`.
2. **Darken band 1 to `#DCC29C`** (gold @ ~38% mix) → contrast ~1.45 vs paper. Still under 3:1 but visibly distinguishable when adjacent to paper.

**Use both.** Border for guaranteed presence; darker band 1 for visual grouping. The 5-band scale becomes:

| Band | Hex | Notes |
|------|-----|-------|
| 0 | `#EEEDEC` | no border |
| 1 | `#DCC29C` | + inset gold@40 hairline |
| 2 | `#CFAA7C` | + inset gold@40 hairline |
| 3 | `#BC9061` | + inset gold@40 hairline |
| 4 | `#A98155` | gold token, no border (max contrast already) |

WCAG note: cells are decorative graphics, not UI controls. The 3:1 target is best-practice rather than legal floor. The combined fill+border treatment clears the practical "is this cell filled?" question with comfortable headroom.

---

## 4. Empty-cell treatment — chosen: subtle dotted micro-mark

Three options weighed:

| Option | Read | Verdict |
|---|---|---|
| True empty (`bg-paper`, no border) | Grid disappears in negative space | Reject — long-tail brand rows would have 8/11 cells invisible, the chart loses its "map" identity |
| 1px ink/8 inner border on every empty cell | Preserves the grid scaffold cleanly; gentle | Risk: 132 cells × hairline = busy at glance |
| **Single 2×2px ink/15 dot centred in each empty cell** | Reads as "considered nothing here" — explicit absence; preserves grid rhythm; on hover-mute can fade out cleanly | **CHOOSE** |
| Diagonal hatch | Too loud; reads as "data missing" not "zero" | Reject — wrong semantic |

Implementation: empty cells get `bg-paper` plus a centered absolutely-positioned `<span class="h-[2px] w-[2px] rounded-full bg-ink/15">`. On row+col cross-highlight, dots in muted cells fade with their parent.

---

## 5. Hover behaviour

### Cross-highlight

On `mouseenter` on cell `[r,c]`:
- All cells where row ≠ r AND col ≠ c → `opacity: 0.25` (spec said 30% — bumping to 25% gives the highlighted axis more pop).
- Cell `[r,c]` itself → unchanged.
- Other cells in row r (col ≠ c) and col c (row ≠ r) → `opacity: 0.85` (slight desat but visible — the axis-mates are signal too).
- Brand label at row r → switches from `text-ink` to `text-gold font-semibold`.
- Price axis label at col c → switches from `text-mute-3` to `text-gold font-semibold`.
- Brand row sum bar at row r (see §7) → ink → gold.

Transition: `transition-opacity duration-150 ease-out` on every cell. No transform-based animations — they cost performance on 132 elements.

### Tooltip

**Reuse PriceTileD's `bg-ink-deep` arrow tooltip pattern** — exact same `rounded-sm bg-ink-deep px-2.5 py-1` shell with the rotated-square arrow. Component consistency (CLAUDE.md principle). Promote it from PriceTileD-local into `common.tsx` as `<DataTooltip>` during this implementation — flagged as a refactor task in §9.

**Placement:** floating near cursor, anchored above the hovered cell (cell-centre x, cell-top y - 8px). NOT fixed to a tile corner — the cursor location is the natural attention anchor, and a fixed corner forces a saccade.

**Edge handling:** if hovered cell is in row 0 (top), flip arrow to point up and place tooltip below the cell. If in column 0 or 10 (edges), clamp tooltip x to `[8, tileWidth - 8 - tooltipWidth]`.

**Tooltip content** (4 facts, 2 lines):

```
Rolex · $10–25K
24 novelties · 41% of Rolex · 24% of bucket
```

- Line 1: brand · bucket label, `text-paper text-[12px] font-semibold`
- Line 2: count + 2 ratios, `text-paper/70 text-[11px] tabular-nums`

Three ratios beats the spec's two — adding "% of bucket" reveals the *cross-direction* story (this brand owns this bucket vs this bucket owns this brand), which is the whole point of a cross-tab.

### Touch behaviour

**Tap to lock, tap-elsewhere to release.** State: `[hoveredCell, lockedCell]`. The displayed cell is `lockedCell ?? hoveredCell ?? null`. On touch device (`@media (hover: none)`), mouseenter is no-op; only tap registers. Tap on a cell sets `lockedCell`. Tap outside the grid clears it. Implementation: one `useEffect` adding a `pointerdown` listener on `document` that clears lock if target is outside the grid ref.

Defer mobile polish — V4 explicitly excludes mobile breakpoint per parent doc §"Out of scope". Implement the lock-on-tap because it's 5 lines, but don't tune touch sizing.

---

## 6. Axis labels

### Row labels (brands, left rail)

**Logo + text, both.** 24px circular logo (existing `<BrandLogo size={24}>`) + brand name to the right. Reasoning: V4's Brands flagship already establishes logos as the brand-identity language for the page. Showing brand names without logos here would read as a different chart from a different system. With logos, the row rail becomes a 12-watch lineup that ties visually to the BrandsTileD flagship one row up.

```
[logo 24] [Rolex            ]
[logo 24] [Tudor            ]
[logo 24] [Patek Philippe   ]
...
```

- Logo column width: 24px (logo) + 12px (gap) = 36px
- Text column: 144px, `text-[12px] text-ink`, truncate with `overflow-hidden text-ellipsis whitespace-nowrap`
- Total left rail: **180px** (matches §2 budget)
- Row vertical alignment: logo + text vertically centred on the 22px cell row

### Column labels (price buckets, bottom)

**Horizontal, not rotated.** Already-short labels (`<$1K`, `$1–2.5K`, ..., `>$1M`) — the longest is `$100–250K` at 9 chars, which fits in 77px at `text-[11px]`. Rotation would add unnecessary chart-junk for no readability gain.

```
<$1K   $1–2.5K  $2.5–5K  $5–10K  $10–25K  ...  >$1M
```

- `text-[11px] tabular-nums text-mute-3`, centred per column
- Bottom band height: 36px = 4px gap + ~14px text height + 18px breathing room before the editor's note separator
- Hovered column label gets `text-gold font-semibold` (per §5)

### Top vs bottom?

**Bottom.** Pairs visually with PriceTileD below it (also has bottom axis labels for the same buckets). Top-of-chart axis labels feel chart-junky; bottom is the default reading orientation.

### Variable-width columns?

**No. Equal-width columns.** The price scale is ordinal here (we're showing distribution across buckets, not actual dollar position on a continuous line). Variable widths would imply a logarithmic price axis, which would distort the visual story of "where the volume sits" — Rolex's $10–25K dominance would visually shrink into a tiny strip vs the wide $200K+ desert.

If a continuous-x version is wanted later, that's a separate viz (and probably an x-strip below the heatmap, not a re-layout of the heatmap itself).

---

## 7. Editorial markers — the wow layer

### Candidates evaluated

| Layer | Verdict | Why |
|---|---|---|
| Gold border on global-max cell | **Reject as standalone** — too small a gesture for the wow slot | Already de-facto present (band 4 = peak gold). Doubling with a border adds noise. Keep band 4 = peak signal; no extra border. |
| Annotation callouts ("Patek's only sub-$25K reference") | Reject | Hodinkee-y but adds 3-4 floating text labels into the chart, fights the cells, requires editorial work for each new fair. |
| Diagonal "median price by brand" line | Reject | Too clever. Makes the chart bi-modal (read it as a heatmap AND as a line chart). Erodes the heatmap's clarity. |
| Median-price corridor (vertical band) | Reject | Implies a single fair-wide median is meaningful; it's not — the distribution is bimodal (mid-luxury hump + ultra-high tail). One band is misleading. |
| **Brand row-sum bar at top of grid** | **CHOOSE** | One thin (10px tall) horizontal bar above the grid, spanning the same 11 columns. Each segment = % of all top-12 novelties that landed in that price bucket. It IS the column-aggregate story laid directly above the matrix, in the same column geometry. Reads as a "barometer" or "spectrum strip". Reuses gold ramp colours. |

### Why the row-sum strip wins

It does three jobs at once:
1. **Anchors the chart in a story** — viewer's eye lands on the gold-densest stripe, then descends into the matrix to see "who built this volume."
2. **Hover-coupled** — when a cell is hovered, the column's strip segment goes full gold + bold count label appears above it. Connects the cross-highlight visually to the aggregate.
3. **Free** — the data is already a sum across the matrix's columns. No separate dataset, no separate computation pipeline, no editorial copy required.

### Spec for the row-sum strip

- Position: above the grid, within the same `p-7` tile, separated by a 12px gap from the grid's first row.
- Geometry: same 11 columns at same widths, same 1px gaps.
- Height: **10 px**.
- Fill per segment: gold ramp at the *column-aggregate* band index (compute `colSum / max(colSums)` and map to the same 5 stops).
- On default render: thin column count labels (`text-[10px] tabular-nums text-mute-3`) sit above the strip, only for the top-3 columns by total. Unobtrusive but informative.
- On column hover: hovered segment goes full gold (forced to band 4 regardless of band), count label above it bolds and turns gold.

This is the layer that converts "decent heatmap" into "a chart someone screenshots and posts." It is also the layer most at risk of feeling decorative — guard against this by keeping it visually quiet by default (10px tall, no labels except for top-3, no gold dominance) and only animating on hover.

---

## 8. Data feasibility & synthetic matrix

### Current state

`prototype/src/data.ts` has:
- `brands: Ranked[]` — top 10 brands with totals (no price breakdown)
- `prices: PriceBucket[]` — 11 buckets with totals (not brand-cut)

**No brand × bucket cross-tab exists.** This is a placeholder project (per CLAUDE.md "Санкционировал: плейсхолдеры… приблизительные числа"), so synthesise a plausible matrix that respects:

- Rolex peak around $5–25K (Datejust/OP territory)
- Tudor cheaper, peak $1–5K
- Patek mostly $25K+
- Independents (FP Journe, Lange not in current top-10 — substitute Jaeger-LeCoultre as our highest-end available) lean upper-mid
- IWC, Piaget, Bvlgari, Chopard, Hublot — mid-tier majors, broad spread $5K–50K
- Eberhard & Co. — affordable independent, peak $2.5–10K
- Chanel, Cartier — added to make top-12; jewellery houses, broad spread incl. high-end gold pieces

### Top-12 brand selection

Use existing top-10 from `brands` array + Chanel + Cartier from `topCollections` (where they appear). All have logos in manifest.

```
['Rolex', 'Tudor', 'Patek Philippe', 'IWC', 'Piaget', 'Bvlgari',
 'Chopard', 'Eberhard & Co.', 'Hublot', 'Jaeger-LeCoultre',
 'Cartier', 'Chanel']
```

### Synthetic matrix (counts per cell)

Sum constraints:
- Each row sum ≈ that brand's total (within ±2 for rounding flexibility): Rolex 58, Tudor 31, Patek 22, IWC 19, Piaget 18, Bvlgari 17, Chopard 14, Eberhard 12, Hublot 12, JLC 11, Cartier ~9, Chanel ~8.
- Top-12 row sum total ≈ **231**, which is ~48% of `TOTAL_NOVELTIES` (478). Reasonable — top-12 of 61 brands shouldn't be the whole fair.
- Column sums should approximate the global price distribution shape (peak at $10–25K), but won't match `prices[]` exactly because we're only summing top-12.

```ts
// data.ts addition
// 12 brands × 11 price buckets. Counts of novelties.
// Rows: Rolex, Tudor, Patek, IWC, Piaget, Bvlgari, Chopard, Eberhard,
//       Hublot, JLC, Cartier, Chanel
// Cols: <$1K, $1–2.5K, $2.5–5K, $5–10K, $10–25K, $25–50K,
//       $50–100K, $100–250K, $250–500K, $500K–1M, >$1M
export const BRAND_PRICE_MATRIX: number[][] = [
  // Rolex                — peak $10–25K, no sub-$5K, nothing >$250K
  [0,  0,  0,  18, 24, 11,  4,  1,  0,  0,  0],
  // Tudor                — cheaper, peak $2.5–5K, nothing above $25K
  [0,  4, 13, 10,  4,  0,  0,  0,  0,  0,  0],
  // Patek Philippe       — top tier, nothing under $10K
  [0,  0,  0,  0,  2,  6,  6,  4,  3,  1,  0],
  // IWC                  — mid-luxury, broad
  [0,  0,  1,  4,  8,  4,  2,  0,  0,  0,  0],
  // Piaget               — slim/dressy, gold-heavy → upper-mid
  [0,  0,  0,  2,  5,  6,  3,  2,  0,  0,  0],
  // Bvlgari              — jewellery + Octo, broad spread
  [0,  0,  1,  3,  4,  4,  3,  1,  1,  0,  0],
  // Chopard              — L.U.C upper, Mille Miglia mid
  [0,  0,  0,  3,  4,  4,  2,  1,  0,  0,  0],
  // Eberhard & Co.       — independent affordable
  [0,  1,  4,  5,  2,  0,  0,  0,  0,  0,  0],
  // Hublot               — Big Bang mid → upper-mid
  [0,  0,  0,  1,  4,  4,  2,  1,  0,  0,  0],
  // Jaeger-LeCoultre     — Reverso classic + ultra-comp
  [0,  0,  0,  1,  3,  3,  2,  1,  1,  0,  0],
  // Cartier              — Tank/Roadster steel + gold haute
  [0,  0,  0,  2,  3,  2,  1,  1,  0,  0,  0],
  // Chanel               — J12 ceramic + jewelled gold
  [0,  0,  0,  1,  3,  2,  1,  1,  0,  0,  0],
]

// Sums sanity check (for the implementer):
// Row sums: 58, 31, 22, 19, 18, 17, 14, 12, 12, 11, 9, 8 → total 231
// Col sums: 0, 5, 19, 50, 66, 46, 26, 13, 5, 1, 0       → total 231
// Max cell: 24 (Rolex × $10–25K) — drives the band scaling

// Brand-row order matches this list (used as both label rail and matrix index):
export const TOP_12_BRANDS: readonly string[] = [
  'Rolex', 'Tudor', 'Patek Philippe', 'IWC', 'Piaget', 'Bvlgari',
  'Chopard', 'Eberhard & Co.', 'Hublot', 'Jaeger-LeCoultre',
  'Cartier', 'Chanel',
] as const
```

Story-check on the matrix:
- Gold-densest column = $10–25K (sum 66) — matches mid-luxury narrative ✓
- Gold diagonal sweep: Tudor's hump at col 2 → Rolex's at col 4 → Patek's at col 5–6 → independents trailing into col 7–8 ✓
- Two empty columns at extremes (<$1K and >$1M) — visually frame the chart and reinforce the "everyone clusters in the middle" reading ✓
- Patek's empty left side and Tudor's empty right side create the X-shaped negative-space pattern that makes Brand × Price heatmaps satisfying ✓

---

## 9. Implementation notes

### File layout

```
prototype/src/components/v4/MarketMapTile.tsx     — main component
prototype/src/components/common.tsx               — add <DataTooltip> (extracted from PriceTileD)
prototype/src/data.ts                             — add BRAND_PRICE_MATRIX, TOP_12_BRANDS
```

### Build order

1. Add data to `data.ts`.
2. Extract `<DataTooltip>` to `common.tsx` from PriceTileD inline JSX. Refactor PriceTileD to consume it. Verify PriceTileD still renders identically.
3. Build `MarketMapTile.tsx` static (no hover) — grid, ramp, labels, row-sum strip.
4. Add cross-highlight on hover.
5. Add tooltip.
6. Add tap-to-lock behaviour.
7. Add row-sum strip hover coupling.

### Key React structure (non-binding sketch)

```tsx
const [hovered, setHovered] = useState<{r:number,c:number}|null>(null)
const [locked, setLocked]   = useState<{r:number,c:number}|null>(null)
const active = locked ?? hovered

// rowSums, colSums, max precomputed via useMemo
// band(n, max) → 0..4

return (
  <article className="rounded-sm border border-ink/5 bg-white p-7 shadow-[0_24px_48px_rgba(0,0,0,0.26)]" style={{minHeight: 400}}>
    <Header title="Market map" subtitle="Top 12 brands × 11 price tiers" />

    <div className="mt-6 grid" style={{gridTemplateColumns: `180px repeat(11, 1fr)`}}>
      {/* row 0: empty cell + 11 colSum bars */}
      <div />
      {colSums.map((sum, c) => (
        <ColumnSumBar key={c} sum={sum} max={Math.max(...colSums)} active={active?.c === c} />
      ))}

      {/* 12 brand rows */}
      {TOP_12_BRANDS.map((brand, r) => (
        <Fragment key={brand}>
          <BrandLabelRail brand={brand} active={active?.r === r} />
          {BRAND_PRICE_MATRIX[r].map((n, c) => (
            <Cell
              key={c}
              n={n}
              max={max}
              dim={active && active.r !== r && active.c !== c}
              onEnter={() => setHovered({r, c})}
              onLeave={() => setHovered(null)}
              onTap={() => setLocked(prev => prev?.r === r && prev?.c === c ? null : {r, c})}
            />
          ))}
        </Fragment>
      ))}
    </div>

    <PriceAxisLabels activeCol={active?.c} />

    {active && <FloatingTooltip cell={active} />}

    <EditorNote text={editorNotes.marketMap} />
  </article>
)
```

### Performance

132 cells with `transition-opacity` is fine. `will-change: opacity` on cells is *not* needed — modern browsers handle this list size trivially. Skip premature optimisation.

### Accessibility

- Grid wrapper: `role="img"` + `aria-label="Heatmap of top 12 brands by price tier"`.
- Add a hidden `<table>` mirror with `class="sr-only"` summarising row sums, for screen readers. Cells themselves are decorative under `role="img"`.
- Tooltip text is also redundantly available in the sr-only table — no need for live-region announcement on hover.

---

## Summary back to caller

**Encoding:** 5-band stratified gold ramp (paper → 4 gold tints → solid gold), not continuous. Bands derived from `count / max` thresholds at 0.20 / 0.40 / 0.70 / 1.0. Faint band darkened to `#DCC29C` and all non-empty cells get an inset gold@40 hairline so the lowest band is visible against paper.

**Cell layout:** brands as 12 rows (long axis, with 24px logos + names), price buckets as 11 columns (short labels, horizontal, bottom). Cells 77 × 22 px, 1px gaps. Tile minHeight raised from 320 to 400 px to keep cells from going barcode-thin. Empty cells get a single 2px ink/15 dot, not blank paper, so the grid scaffold survives.

**Hover:** cross-highlight row + column to opacity-0.85, mute everything else to 0.25; brand label and price label go gold-bold; column's row-sum segment lights up. Tooltip is the existing PriceTileD ink-deep arrow shell (extracted into `common.tsx` as `<DataTooltip>`), floats near cursor with edge clamping. Tap-to-lock for touch.

**Editorial layer:** a 10px-tall row-sum strip directly above the grid, same column geometry, gold-ramp coloured by column total. Quietly informative at rest (top-3 column counts shown), lights up on column hover. One layer, not three.

**Biggest residual risk:** the 22px cell height. If, after rendering, the grid feels letter-boxed and weak, the recovery path is bumping minHeight to 440 px (cell → 25.5 px) before considering top-10 instead of top-12. Cutting brand count is a story loss; cutting tile height isn't.
