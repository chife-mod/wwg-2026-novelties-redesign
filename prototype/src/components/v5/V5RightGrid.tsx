import { useEffect, useState } from 'react'
import { TILES, type TileEntry } from '../current/tileRegistry'
import TileShell from '../current/TileShell'
import Sandbox from '../current/Sandbox'
import MarketMapDefault from './variants/MarketMapDefault'
import MarketMapLarge from './variants/MarketMapLarge'

// Reuses storage keys from V3 — same tile-variant choices apply.
const ACTIVE_KEY = 'wwg.current.activeVariants.v2'
const SANDBOX_KEY = 'wwg.current.openTileId'

// V5 owns its own ad-hoc "price" tile entry — two MarketMap variants instead
// of the V3 PriceTileD set. Default = compact (current front), Large = wider
// rows + no logos for the sandbox compare view.
const v5PriceTile: TileEntry = {
  id: 'v5-price',
  label: 'Price ranges',
  kicker: 'Price',
  colSpan: 2,
  // Order = front-default first. Promoted Large to front 2026-04-25
  // (Oleg: "wider, без логотипов, $250K+ должен влезать"). Compact-with-logos
  // demoted to sandbox-only as the alternative reading.
  variants: [
    {
      key: 'A',
      label: 'Default · top 10, no logos, 36px rows, wider buckets',
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

  // All tiles know which entry they are. Map by id for sandbox lookup.
  const allTiles: TileEntry[] = TILES.map((t) => (t.id === 'price' ? v5PriceTile : t))

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
