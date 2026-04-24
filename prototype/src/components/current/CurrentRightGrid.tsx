import { useEffect, useState } from 'react'
import { TILES } from './tileRegistry'
import TileShell from './TileShell'
import Sandbox from './Sandbox'

const ACTIVE_KEY = 'wwg.current.activeVariants'
const SANDBOX_KEY = 'wwg.current.openTileId'

/**
 * Right column grid for the Current version.
 * - Reads tile list from registry.
 * - Tracks which variant is active per tile (persisted in localStorage).
 * - Opens full-screen sandbox overlay on tile click.
 * - Persists which tile's sandbox is open in sessionStorage so HMR / manual
 *   reloads do not kick the user out of the sandbox mid-iteration.
 *   Explicit close (Back / × / Esc) clears storage, so deliberate closes stick.
 */
export default function CurrentRightGrid() {
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

  const cycle = (tileId: string, direction: -1 | 1) => {
    const tile = TILES.find((t) => t.id === tileId)
    if (!tile) return
    const cur = active[tileId] ?? 0
    const next = (cur + direction + tile.variants.length) % tile.variants.length
    setActive((a) => ({ ...a, [tileId]: next }))
  }

  const openTile = openTileId ? TILES.find((t) => t.id === openTileId) ?? null : null

  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {TILES.map((tile) => (
          <div key={tile.id} className={tile.colSpan === 2 ? 'col-span-2' : ''}>
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
