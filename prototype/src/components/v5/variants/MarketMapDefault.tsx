import MarketMapTile from '../../v4/MarketMapTile'

/**
 * Default Price-ranges heatmap for V5 — same as V4's MarketMap but
 * relabelled "Price ranges" and stripped of the editorial Note.
 *
 * Top 12 brands × 11 buckets, 22px rows, 18px logos, 12px brand labels.
 * Compact and dense — what's currently shipped on the V5 front.
 */
export default function MarketMapDefault() {
  return <MarketMapTile title="Price ranges" showNote={false} />
}
