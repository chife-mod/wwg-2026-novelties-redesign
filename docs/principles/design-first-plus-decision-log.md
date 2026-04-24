# Design-First + Decision Log

**Status:** active working principle
**Scope:** tile-variant exploration in the Current prototype
**Adopted:** 2026-04-23

## The principle

For **visual hypotheses** (tile variants, layout experiments, micro-interactions)
we work **design-first**. Documentation is **retrospective**, not upfront.

```
hypothesis in chat  →  2–3 variants built  →  review in sandbox  →  pick winner  →  decision log
```

The decision log is written **after** the winner is picked, not before variants
are built.

## Why not Document-First here

Document-First (spec → code) is the right tool when uncertainty lives in the
**requirements**: multiple stakeholders, shipping features, contracts between
teams. It prevents months of wrong-direction work.

For this project none of that applies:

- Solo author. No stakeholders to align with before code.
- Uncertainty is in the **execution**, not the requirements. We already know the
  problem ("ranked list is flat, loses hierarchy"). We don't know the solution
  until we see it.
- A variant costs ~5 minutes to build. Cost of a "wrong" variant is zero. Cost
  of a premature spec is higher than the cost of a bad variant.
- Visual hypotheses are pre-verbal. Forcing language onto them upfront produces
  banal text ("tile, but different") that adds no information.

Document-First optimises for a problem this project does not have.

## The workflow per tile

1. **Align in chat, not in a file.** One or two sentences is enough:
   > "For Top Brands, let's try A = current list, B = honeycomb, C = brand cloud."

2. **Build 2–3 variants.** Register them in
   `prototype/src/components/current/tileRegistry.tsx`. They appear in the
   sandbox automatically; hover arrows on the main grid cycle between them.

3. **Review visually in the sandbox.** Click the tile on Current → full-screen
   overlay shows all variants stacked at their natural width. Pick a winner.

4. **Write the decision log.** Only now. Create
   `docs/ideas/tiles/<tile-id>.md` with the template below. Aim for 6–15
   lines — enough to remind yourself in three weeks, not a novel.

5. **Commit with the variant.** Decision log and the variant code ship in the
   same commit, so history is coherent.

## Decision log template

Save as `docs/ideas/tiles/<tile-id>.md`:

```markdown
# <Tile name>

**Problem.** What was wrong with the baseline, in one line.

**Tried.**
- A (<short name>) — baseline / rejected, one-line reason.
- B (<short name>) — ✓ **selected**, one-line reason.
- C (<short name>) — rejected, one-line reason.

**Decision.** Why the winner won — the single insight it communicates better.

**Notes.** Anything non-obvious about the implementation; constraints; open
questions. Skip if there are none.
```

## What happens to losing variants

**Do not delete them.** In the registry, mark the losing entry with
`archived: true` and add a one-line code comment with the rationale:

```ts
{ key: 'A', label: 'Ranked list', component: BrandsTileA,
  archived: true, /* too flat, loses hierarchy — see docs/ideas/tiles/top-brands.md */ },
```

Archived variants stay visible in the sandbox (marked as such) but do not
render on the main grid. This keeps the exploration auditable: a month from
now, when you wonder "did we try X?", the answer is one click away.

## What this buys

- **Speed.** No upfront ceremony before a visual idea.
- **Honesty.** The doc captures what actually happened, not what was planned.
- **Memory.** In three weeks, you will not remember why B beat A. The log will.
- **Portfolio material.** Each winning tile has a short "story" — problem,
  alternatives, insight. That is exactly what portfolio reviewers want.
- **Audit trail.** Losing variants stay visible. "Did we try honeycomb?" is
  answered in seconds.

## What this does NOT replace

- The **plan doc** (`docs/plans/*.md`) — written upfront for a whole version's
  architecture. That is Document-First and correct for that scope.
- The **idea docs** (`docs/ideas/NN/`) — written upfront for a conceptual
  change that affects multiple tiles or the page structure. Also correct.

Decision logs live at the **tile × variant** level. Plans and ideas live one
and two levels higher. All three coexist.

## When to revisit this principle

- If the team grows beyond one person.
- If variants stop being cheap (e.g. they require design tokens, asset work,
  or backend data that takes hours to prep).
- If we start shipping variants into production rather than keeping them in a
  prototype.

Until any of those happen, design-first + decision log is the default.
