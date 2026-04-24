import { useEffect } from 'react'
import { createPortal } from 'react-dom'
import type { TileEntry } from './tileRegistry'

/**
 * Full-screen overlay showing all variants of a single tile.
 * Same chocolate hero background as Current. Esc or Back/Close closes.
 *
 * Layout caps at max-w-[1440px] — the base resolution we design for. On
 * wider screens the content stays centered, tiles don't spread into the void.
 *
 * Layout branches on tile.colSpan:
 *   - colSpan=1 (narrow): variants tile 1/2/3-up responsively,
 *     mobile=1, tablet=2, desktop (≥xl)=3. At 1440px with px-8 + gap-4
 *     each cell is ≈448px — same proportions as on the live dashboard.
 *   - colSpan=2 (wide): variants STACK vertically, one per full-width row.
 *     These are «big» tiles — reading them side-by-side squeezes them below
 *     their native width. Stack top-to-bottom instead.
 *
 * Reading order inside the Sandbox: first variant (newest) is the topmost
 * / leftmost one. See tileRegistry.tsx — we keep newest-first explicitly
 * there, so here we just iterate the array as-is.
 */
export default function Sandbox({
  tile,
  onClose,
}: {
  tile: TileEntry
  onClose: () => void
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [onClose])

  return createPortal(
    <div
      className="fixed inset-0 z-[100] overflow-y-auto text-paper"
      style={{ background: '#1F140C' }}
      role="dialog"
      aria-modal="true"
    >
      {/* top bar — just back + close */}
      <div className="sticky top-0 z-10 border-b border-white/10 bg-[#1F140C]/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-8 py-4">
          <button
            type="button"
            onClick={onClose}
            className="group flex items-center gap-3 text-[11px] font-semibold uppercase tracking-eyebrow text-paper transition hover:text-gold"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 transition group-hover:border-gold group-hover:bg-gold group-hover:text-ink-deep">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </span>
            <span>Back</span>
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-paper transition hover:border-gold hover:bg-gold hover:text-ink-deep"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
          </button>
        </div>
      </div>

      {/* Narrow tiles: responsive 1/2/3-up grid.
          Wide tiles (colSpan=2): stacked one-per-row, full container width. */}
      <div className="mx-auto max-w-[1440px] px-8 py-14">
        <div
          className={
            tile.colSpan === 2
              ? 'flex flex-col gap-y-10'
              : 'grid grid-cols-1 gap-x-4 gap-y-10 md:grid-cols-2 xl:grid-cols-3'
          }
        >
          {tile.variants.map((v) => (
            <section key={v.key}>
              <div className="mb-3 text-[11px] font-semibold uppercase tracking-eyebrow text-mute-2">
                Version {v.key}
              </div>
              <div className="text-ink">
                <v.component />
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>,
    document.body,
  )
}
