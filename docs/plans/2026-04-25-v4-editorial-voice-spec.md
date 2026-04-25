# V4 — Editorial Voice Spec for the "Editor's Note" Layer

**Date:** 2026-04-25
**Companion to:** `2026-04-25-v4-design.md` §4 (Insight layer — Editor's Note).
**Scope:** voice rules, sentence portfolio for the three flagship tiles, risk register.

---

## 1. Voice spec (the 150-word brief)

The register is the Phillips season recap and the Hodinkee Year in Watches column,
filtered through Christie's print reserve. Sentence shape: one observation per Note,
subject-verb-object with at most one embedded clause; semicolons earn their keep when
they pivot between two halves of a single thought. Past tense for what the fair did
("Rolex held", "the corridor swallowed"); present only for stable conditions
("Patek owns the ceiling"). Vocabulary leans trade: *maison*, *reference*,
*tier*, *register*, *corridor*, *complication*, *novelty*, *bracket*, *roster*. Avoid
SaaS, marketing, or hype lexicon: *crushed it*, *unicorn*, *AI*, *seismic*, *huge*,
*dropped*, *released*, *insights*, *game-changer*. Numbers: numerical when they're the
spine of the sentence ("58 references", "35%"); spelled out when rhetorical
("a quarter of"). A Note must NOT explain the chart, restate visible labels verbatim,
predict next year, moralise, or end on an exclamation.

---

## 2. Sentence portfolio — 18 candidates

### Tile A — BrandsTileD (Brands + Collections pair)

A1. Rolex held the lead with 58 references, but Tudor closed the gap to under 2× for the first time since 2022.
[fact / shift — the spec's own example, kept as benchmark]

A2. Datejust alone accounted for 41 novelties — more than Patek, IWC, and Piaget put together.
[micro-anecdote — single-collection dominance recasts the brand ranking]

A3. The top three maisons absorbed nearly a quarter of the fair; the long tail kept lengthening underneath them.
[macro-pattern — concentration framed against a widening base]

A4. Richemont fielded the deepest roster across IWC, Piaget, and JLC, yet no single house in the group cleared thirty references.
[group-level dynamics — depth without a flagship]

A5. Independents stayed quiet at the top of the table, ceding the headline numbers to the conglomerate brands once again.
[contrarian read — flags an absence the chart itself can't show]

A6. JLC slid three places and Patek shed two references; the polite retreat at the high end was the quietest story of the week.
[story-of-shift — names the YoY losers most coverage skips]

### Tile B — MarketMapTile (brand × price-bucket heatmap)

B1. The $10–25K corridor was dominated by Rolex and Tudor; everything above $100K was essentially Patek and a long, quiet tail.
[fact — the spec's example, kept as benchmark]

B2. Below five thousand dollars the map went almost dark, with only Tudor and Eberhard holding meaningful presence.
[macro-pattern — the floor as a structural absence]

B3. Bulgari and Piaget were the rare maisons that posted double-digit counts in three different price tiers without thinning out.
[micro-anecdote — cross-tier specialists named]

B4. The matrix's brightest single cell sat at Rolex × $10–25K, a forty-novelty hotspot with no analogue anywhere else on the grid.
[fact — points at the literal max-cell the viz highlights in gold]

B5. For all the chatter about accessible luxury, the sub-$5K register stayed a courtesy gesture rather than a real category.
[contrarian read — pushes back on the entry-tier narrative]

B6. The corridor between $25K and $100K, once the heart of the fair, has thinned into a band where most maisons leave only one or two flags.
[story-of-shift — the hollowing-out of the upper-mid register]

### Tile C — PriceTileD (YoY price-range histogram)

C1. Mid-luxury swallowed the fair: 35% of novelties landed between $5K and $25K, the tightest concentration in five editions.
[fact / macro-pattern — the spec's example, kept as benchmark]

C2. The $10–25K bucket alone took 102 references — more than the entire sub-$5K and over-$100K halves combined.
[comparison — a single bracket out-weighing two flanks at once]

C3. Trophy pieces above a quarter-million held their count year-on-year; the floor under a thousand all but disappeared.
[story-of-shift — ceiling stable, floor collapsing]

C4. The mass migrated one bucket downward from 2025, with the $25–50K tier ceding share to the bracket beneath it.
[story-of-shift — names the directional move between adjacent tiers]

C5. For a season billed as a return to entry-level watchmaking, the under-$5K register accounted for fewer than fifty references in total.
[contrarian read — counters the press-release framing with a count]

C6. Half the fair's references now sit between $5K and $50K — the editorial centre of gravity has rarely been this narrow.
[macro-pattern — the band collapses around the mid-luxury median]

---

## 3. Risk register

This voice carries three live risks. **First, it can read as pretentious** when a
sentence reaches for vocabulary it doesn't earn — *maison* and *register* work only
when the observation underneath them is non-obvious; on a thin claim the diction
sounds borrowed. Mitigation: every Note must contain a number or a named comparison
the chart alone doesn't make obvious. **Second, fact-claims are load-bearing** —
"first time since 2022", "tightest in five editions" — and a single wrong year
kills the page's credibility. Mitigation: any historical claim is flagged in
`data.ts` with a source comment, or rewritten to a present-state observation
provable from the visible chart. **Third, the past tense risks sounding archival**
on a live dashboard. Mitigation: keep at least one Note in present tense
("owns the ceiling", "sit between") to anchor the page in the now.

---

## Summary back to caller

**Voice:** Phillips season recap crossed with Hodinkee column — past tense, one
observation per Note, trade vocabulary (*maison, reference, corridor, register*),
no SaaS or hype lexicon, numerical figures when they're the spine of the sentence
and rhetorical when they're not. The Cormorant italic does the labelling work; no
icon, no badge, no eyebrow.

**Ship recommendations:**

- **BrandsTileD →** A1 (the spec's own line). It earns its keep with a real
  historical claim and names two maisons; A2 is the strongest fallback.
- **MarketMapTile →** B6. Pushes past the obvious "Rolex owns the middle" read
  into the more editorial observation that the upper-mid corridor is hollowing
  out — exactly what a heatmap reveals that a bar chart can't.
- **PriceTileD →** C3. Two clauses, one comparison, names both extremes of the
  distribution; reads as reportage rather than chart-reading.

**Biggest risk:** the historical-claim trap. "First time since 2022" and
"tightest in five editions" are unverifiable from the page itself; one wrong year
torches the credibility of all three Notes at once. Gate every dated assertion
behind a sourced comment in `data.ts` or rewrite to present-state.
