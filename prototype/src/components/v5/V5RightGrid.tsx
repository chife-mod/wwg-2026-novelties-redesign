import { useEffect, useState } from 'react'
import { TILES, type TileEntry } from '../current/tileRegistry'
import TileShell from '../current/TileShell'
import Sandbox from '../current/Sandbox'
import MarketMapDefault from './variants/MarketMapDefault'
import MarketMapLarge from './variants/MarketMapLarge'

// Reuses storage keys from V3 — same tile-variant choices apply.
const ACTIVE_KEY = 'wwg.current.activeVariants.v2'
const SANDBOX_KEY = 'wwg.current.openTileId'

// V5 owns its own ad-hoc "Market map" tile entry — heatmap viz, two variants.
// Default = wider/no-logos, Compact = with-logos sandbox-secondary.
// Renamed back to "Market map" 2026-04-25 (Oleg) — Price ranges slot is now
// occupied by the original V3 PriceTileD histogram, which sits ABOVE this one.
const v5MarketMapTile: TileEntry = {
  id: 'v5-market-map',
  label: 'Market map',
  kicker: 'Market map',
  colSpan: 2,
  variants: [
    {
      key: 'A',
      label: 'Default · top 10, no logos, wider buckets ($250K+ fits)',
      component: MarketMapLarge,
    },
    {
      key: 'B',
      label: 'Compact · 12 brands × 11 buckets, 22px rows + logos',
      component: MarketMapDefault,
    },
  ],
}

/**
 * V5 right grid — clone of CurrentRightGrid (V3) with one slot swapped:
 *   the "price" tile is replaced with V5's own MarketMap entry, which
 *   carries two variants and opens the standard sandbox on header click.
 *
 * Variant cycling + sandbox drill-down preserved for every other tile.
 */
export default function V5RightGrid() {
  const [active, setActive] = useState<Record<string, number>>(() => {
    try {
      const raw = localStorage.getItem(ACTIVE_KEY)
      return raw ? JSON.parse(raw) : {}
    } catch {
      return {}
    }
  })
  const [openTileId, setOpenTileId] = useState<string | null>(() => {
    try {
      return sessionStorage.getItem(SANDBOX_KEY)
    } catch {
      return null
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(ACTIVE_KEY, JSON.stringify(active))
    } catch {
      /* ignore quota */
    }
  }, [active])

  useEffect(() => {
    try {
      if (openTileId) sessionStorage.setItem(SANDBOX_KEY, openTileId)
      else sessionStorage.removeItem(SANDBOX_KEY)
    } catch {
      /* ignore */
    }
  }, [openTileId])

  // V5 layout (Oleg 2026-04-25): Market map FIRST, Price ranges histogram
  // SECOND. We insert v5MarketMapTile BEFORE the original 'price' tile, so
  // the heatmap (the V5 signature viz) leads, and the YoY histogram sits
  // right under it as the supporting cross-cut. Both `colSpan: 2`.
  const allTiles: TileEntry[] = []
  for (const t of TILES) {
    if (t.id === 'price') {
      allTiles.push(v5MarketMapTile)
    }
    allTiles.push(t)
  }

  const cycle = (tileId: string, direction: -1 | 1) => {
    const tile = allTiles.find((t) => t.id === tileId)
    if (!tile) return
    const cur = active[tileId] ?? 0
    const next = (cur + direction + tile.variants.length) % tile.variants.length
    setActive((a) => ({ ...a, [tileId]: next }))
  }

  const openTile = openTileId ? allTiles.find((t) => t.id === openTileId) ?? null : null

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {allTiles.map((tile) => (
          <div key={tile.id} className={`h-full ${tile.colSpan === 2 ? 'col-span-2' : ''}`}>
            <TileShell
              tile={tile}
              activeIdx={active[tile.id] ?? 0}
              onOpen={() => setOpenTileId(tile.id)}
              onCycle={(dir) => cycle(tile.id, dir)}
            />
          </div>
        ))}
      </div>

      {openTile && <Sandbox tile={openTile} onClose={() => setOpenTileId(null)} />}
    </>
  )
}
