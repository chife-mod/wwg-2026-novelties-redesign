import MarketMapTile from '../../v4/MarketMapTile'

/**
 * Default Market-map heatmap for V5 — same as V4's MarketMap, no editorial Note.
 *
 * Top 12 brands × 11 buckets, 22px rows, 18px logos, 12px brand labels.
 * Compact and dense — sandbox-only secondary variant in V5.
 */
export default function MarketMapDefault() {
  return <MarketMapTile title="Market map" showNote={false} />
}
