# WWG 2026 Novelties — Redesign V1 Design Doc

**Date:** 2026-04-20
**Status:** V1 only (Cover Story / editorial report). V2–V3 deferred.

## Problem

Current live page (`/analytics/watch-fairs/watches-and-wonders-2026/novelties`) is 11 identical white tiles, each a top-10 ranked bar list. Symptoms:

- No hierarchy — `BRANDS [61]` looks identical to `MOVEMENT FUNCTIONS [3]`.
- No "so what" — page shows numbers, not the story of the fair.
- No watch imagery on a page about watches.
- Rank lists hide distribution shape (`$10K–$25K: 102` tells you nothing about the long tail).
- Zero visual identity of luxury/watch industry. Watch360's own rich design language (circular watch frames, black hero-stat tiles, delta chips, amber heatmaps, word clouds) isn't used here.

## Audience & Job-to-be-done

Editors, PR/marketing people, industry analysts. **JTBD:** "open page → in 10 seconds, feel the shape of WWG 2026 — leaders, dominant segments, signature aesthetic." Readable on screen, printable as PDF. Not a drill-down dashboard.

## Approach (V1 — "Cover Story")

Editorial report in three tiers of importance:

- **Tier 1 (hero, imagery):** Top Brands, Top Collections.
- **Tier 2 (mid, visual):** Price distribution, Dial palette, Diameter ruler.
- **Tier 3 (compact):** Materials, Functions, Straps, Heights, Movements, Editions.

Above the tiers: dark hero strip with fair title + 5 large stat tiles. Below hero: 5 pull-quote insight cards ("Blue is the colour of 2026 — 105 novelties"). Below tiers: methodology footer.

No drill-down. No filters in V1 (filters deferred). Hover highlights allowed.

## Page structure (top to bottom)

1. **Header** — Watch360 top nav (reuse live site's). Eyebrow + title "Watches and Wonders Geneva 2026 · Novelties".
2. **HeroStrip** (dark charcoal band, edge-to-edge)
   - Left: title + eyebrow date.
   - Right: 5 dark stat tiles — `562 Novelties`, `61 Brands`, `119 Collections`, `Blue leads (105)`, `52% sub-$50K`.
3. **HeadlineInsights** — 5 editorial pull-quote cards with big number + caption. Serif accent.
4. **TopBrands + TopCollections** — two rich cards side-by-side. Podium for top-3 (circular watch frame + gold arc + brand-logo chip + count + share bar), bar list 4–10 below.
5. **PriceCurve** — smooth distribution curve across 11 price buckets, filled with gold gradient, amber peak highlight on `$10K–$25K`. New viz, not in existing system.
6. **DialPalette** — colour palette strip where swatch width = share. Real colour swatches (blue, black, white, skeleton texture, grey…). New viz.
7. **DiameterRuler** — horizontal ruler 28mm → 50mm with vertical bars (height = count), amber highlight on 39mm. Inspired by Flight Traffic heatmap but treated as a ruler.
8. **ByTheNumbers** — compact grid of 6 small cards (Materials, Functions, Straps, Heights, Movements, Editions). Each shows top-3 inline, no top-10 list.
9. **FooterStrip** — methodology, data range, "Powered by Watch360 × Market360".

## Data

- Real category labels and top-N structure extracted from screenshots (`data/novelties.ts`).
- Where exact values unclear, plausible placeholders that match visible shape.
- No imagery. Watch photo slots rendered as placeholder circles with brand-logo monogram until assets land.

## Design tokens (from Figma)

```
Gold #A98155 / Light Gold #D49E64 / Brown #8B6337
Black #3A3935 / Eerie Black #1E1D19
Paper White #EEEDEC / White #FFFFFF
Grey #C6C6C6 / Grey 100 #979797 / Grey 200 #7B7B7A
Success #01928D (delta up) / Error #F94E56 (delta down)
Font: Lato (400, 500). H4 24/1.3. Body 14, 16. Tag 10, 12, 14.
```

Accent = Gold. Positive/negative deltas = Success/Error (existing convention).

## Stack

Vite + React + TypeScript + Tailwind. Tokens in Tailwind config. Lato via Google Fonts. No chart library for V1 — all visualisations are hand-built SVG or CSS (they are simple and bespoke).

## Out of scope for V1

- Filter bar (All / By price / By category) — added later if V1 is directionally approved.
- Real watch photography.
- V2 (Archetype) and V3 (Podium) — reuse Tier 2 + Tier 3, replace Hero + Tier 1.
- Responsive below tablet. Desktop-first.

## Success criterion

Open page for 10 seconds. Can you answer: "who leads, what dominates, what's the signature of 2026"? If yes — V1 works.
