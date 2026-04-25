# V5 Collection Stage — left-side rebuild

**Date:** 2026-04-25
**Component:** `prototype/src/components/v5/V5CollectionStage.tsx`
**Replaces in V5:** `WatchStage.tsx` (V3/V4 still use it untouched)

## Problem

V3/V4 left-side `CollectionStage` was a 3-slide hero slider with one row of
brand+model + arrows + 5/10 pagination. Read by user as «недостаточно
информативно» — кроме фотки и имени модели, никаких метрик; brand selection
ограничен фиксированным циклом из 3 слайдов; нельзя быстро перейти к
конкретному maison.

## Decided layout (Oleg 2026-04-25, final)

```
┌─────────────────────────────────────┐
│                                     │
│           [BIG WATCH PHOTO]         │
│           (animated slider,         │
│            click = next)            │
│                                     │
├─────────────────────────────────────┤
│ • Most Covered Novelties   01 / 10  │  ← eyebrow + pagination, baseline-aligned
├─────────────────────────────────────┤
│ [ Brand dropdown ▾ ]                │  ← top-10 maisons, picks featured model
├─────────────────────────────────────┤
│ ROLEX                               │
│ Datejust              ◀ ▶           │  ← brand + model name, slides with photo
├─────────────────────────────────────┤
│  41   │  28   │  19                 │  ← per-model metric trio
│ ARTC  │ SRC   │ COUNTRIES           │     numbers tween, labels static
└─────────────────────────────────────┘
```

## Tried (3 iterations to land)

### 1. Brand selector as TABS at top (above photo)
Initial implementation: 3 tabs (Tudor / Bulgari / IWC) above the photo.
**Rejected:** user wanted top-10, not 3. Tabs scale poorly past ~5.

### 2. Brand selector as DROPDOWN below header (current)
Top-10 from `brands` data. Dropdown panel anchored to selector button, click
outside or Escape closes. Each row in panel: brand name + featured model on
the right, gold tint on active row.

### 3. Pagination position: photo corner → eyebrow line
First put 01/10 in the top-right corner of the photo (Oleg «куда-нибудь в
угол»). Then refined: same line as «Most Covered Novelties», baseline-aligned,
identical 11px uppercase tracking. Reads as one strip — tighter visual.

### 4. Metric block animation: fade → number tween
Initial: whole metric trio cross-faded with mode="wait" on slide change.
Felt heavy — labels disappearing was a lot of motion for what's mostly the
same UI (just different digits).

**Refactored to `<AnimatedNumber>`** — wraps each digit, tweens 600ms ease-out
cubic via rAF from previous to new value. Labels and dividers stay put.
Reads like a quick odometer: 25 → 24 → 22 → 19 → 18.

### 5. «Featured model» kicker — removed
Was below the photo strip in iteration 1. Oleg: «не нужно — dropdown сверху
несёт эту семантику». Saved a row of vertical space.

## Implementation notes

- **Slider mechanics** (animation timings, autoplay 9s, first-tick 2.5s,
  keyboard ←/→) are byte-equivalent to V3/V4 `WatchStage.tsx`. Visual parity
  with sister versions is intentional.
- **Top-10 brands** wired from `brands` data names; each Slide carries
  `articles/sources/countries` placeholder metrics (realistic shape — actual
  numbers come from W360 article-tracking when wired).
- **Photos** cycle through the 3 webps we have (tudor / bulgari / iwc).
  Real per-brand renders are out of scope.
- **Dropdown z-index** = z-30 to clear the metric trio below.

## Open issues

- **Per-brand photos** — 7 of 10 brands reuse 3 cycling webps. Need real
  novelty photography from W360.
- **Articles/Sources/Countries data** — placeholders. Wire to real tracking.
- **Mobile layout** — out of scope.
