import MarketMapTile from '../../v4/MarketMapTile'

/**
 * "Wider rows" Price-ranges variant — Oleg 2026-04-25.
 *
 * Trade-offs taken from his ask:
 *   - Drop logos     → label rail shrinks from 180px to 130px → cells get
 *                      ~50px of horizontal room → "$250K+" no longer clipped.
 *   - Top 10 brands  → matches our top-N convention everywhere else (Brands,
 *                      Collections); two least-active rows fall away.
 *   - Row 36px       → 60% taller cells → readable at glance from the
 *                      sandbox preview, not just on hover.
 *   - Name 14px      → bigger brand names; logos gone so they carry the row
 *                      identity solo.
 *
 * Total tile height grows from 400px to ~520px. Acknowledged.
 */
export default function MarketMapLarge() {
  return (
    <MarketMapTile
      title="Market map"
      showNote={false}
      topN={10}
      rowHeight={32}
      showLogos={false}
      labelRailWidth={130}
      nameSize={14}
      minHeight={520}
    />
  )
}
