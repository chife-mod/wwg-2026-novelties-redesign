import { useViewMode, type ViewMode } from './ViewModeContext'

/**
 * Segmented pill-toggle: [ Count · % ].
 *
 * Визуальная основа та же, что у тегов слева (bg-black/40 backdrop-blur,
 * rounded-full) — чтобы весь top-strip читался одной линией капсул.
 * Активный сегмент — бумажная плашка ink-deep поверх, неактивный —
 * полупрозрачный mute текст. Без border, без иконок — минимум.
 */
export default function ViewModeToggle() {
  const { mode, setMode } = useViewMode()

  return (
    <div
      role="group"
      aria-label="Switch between absolute counts and percentages"
      className="inline-flex items-center rounded-full bg-black/40 p-[3px] backdrop-blur-sm"
    >
      <Seg mode={mode} value="count" label="Count" onClick={() => setMode('count')} />
      <Seg mode={mode} value="pct" label="%" onClick={() => setMode('pct')} />
    </div>
  )
}

function Seg({
  mode,
  value,
  label,
  onClick,
}: {
  mode: ViewMode
  value: ViewMode
  label: string
  onClick: () => void
}) {
  const active = mode === value
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={[
        'rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-eyebrow transition',
        active ? 'bg-paper text-ink-deep' : 'text-mute-2 hover:text-paper',
      ].join(' ')}
    >
      {label}
    </button>
  )
}
