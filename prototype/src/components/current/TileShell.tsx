import type { TileEntry } from './tileRegistry'

/**
 * Wraps a tile variant in the main grid.
 *
 * INTERACTION (revised 2026-04-25):
 * Click anywhere on the tile → opens sandbox. Robust and discoverable —
 * matches V3's original behaviour. Tile-internal interactives (heatmap
 * cells, hover tooltips, etc.) must call `e.stopPropagation()` in their
 * own onClick to prevent bubbling here. MarketMapTile already does this.
 *
 * Visual affordance: cursor-zoom-in on the entire tile + gold ring on
 * hover + corner "Open sandbox →" hint on hover.
 *
 * Earlier attempt (header-only click via event delegation) was too subtle —
 * users didn't realise the title was the trigger. Reverted.
 */
export default function TileShell({
  tile,
  activeIdx,
  onOpen,
}: {
  tile: TileEntry
  activeIdx: number
  onOpen: () => void
  onCycle: (direction: -1 | 1) => void
}) {
  const variant = tile.variants[activeIdx] ?? tile.variants[0]
  const Variant = variant.component

  return (
    <div
      className="group relative h-full cursor-zoom-in rounded-sm transition-shadow focus-within:ring-2 focus-within:ring-gold/60 hover:ring-2 hover:ring-gold/40"
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpen()
        }
      }}
    >
      <Variant />

      {/* corner hint — appears on tile hover */}
      <div className="pointer-events-none absolute right-3 top-3 rounded-full bg-ink-deep/85 px-2 py-1 text-[9px] font-semibold uppercase tracking-eyebrow text-paper opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
        Open sandbox →
      </div>
    </div>
  )
}
