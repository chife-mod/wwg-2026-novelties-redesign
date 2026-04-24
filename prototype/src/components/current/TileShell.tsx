import type { TileEntry } from './tileRegistry'

/**
 * Wraps a tile variant in the main grid.
 * - Click anywhere on the shell → opens sandbox for that tile.
 * - Hover → cursor-zoom-in + subtle gold outline.
 *
 * Hover arrows для переключения вариантов были отключены (2026-04-24):
 * путают при демонстрации — стандартное поведение «кликаю по плитке,
 * попадаю в sandbox» достаточно. Переключение вариантов живёт ТОЛЬКО
 * в sandbox'е. Чтобы вернуть стрелки — restore блок ниже и проп onCycle.
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

      {/* corner hint */}
      <div className="pointer-events-none absolute right-3 top-3 rounded-full bg-ink-deep/85 px-2 py-1 text-[9px] font-semibold uppercase tracking-eyebrow text-paper opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100">
        Open sandbox →
      </div>

      {/* Hover cycle-arrows temporarily disabled — see file-level comment.
          Restore by un-commenting the block and destructuring `onCycle` above.

      {tile.variants.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous variant"
            onClick={(e) => { e.stopPropagation(); onCycle(-1) }}
            className="absolute left-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-ink-deep/80 text-paper opacity-0 backdrop-blur-sm transition-opacity hover:border-gold hover:bg-gold hover:text-ink-deep group-hover:opacity-100"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button
            type="button"
            aria-label="Next variant"
            onClick={(e) => { e.stopPropagation(); onCycle(1) }}
            className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-ink-deep/80 text-paper opacity-0 backdrop-blur-sm transition-opacity hover:border-gold hover:bg-gold hover:text-ink-deep group-hover:opacity-100"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </>
      )} */}
    </div>
  )
}
