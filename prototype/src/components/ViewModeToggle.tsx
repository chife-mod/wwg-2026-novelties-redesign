import { useViewMode } from './ViewModeContext'

/**
 * Segmented pill-toggle: [ Count · Percent ].
 *
 * Визуальная основа та же, что у тегов слева (bg-black/40 backdrop-blur,
 * rounded-full) — чтобы весь top-strip читался одной линией капсул.
 * Активный сегмент — бумажная плашка ink-deep поверх, неактивный —
 * полупрозрачный mute текст.
 *
 * INTERACTION: вся капсула — один <button role="switch">. Клик в
 * любую точку (хоть по активному сегменту) переключает mode в
 * противоположный. Это быстрее, чем заставлять пользователя
 * «целиться» в неактивный label. Hover: фон капсулы чуть темнеет,
 * тусклый сегмент высветляется — видно, что это интерактив.
 */
export default function ViewModeToggle() {
  const { mode, setMode } = useViewMode()
  const isCount = mode === 'count'

  return (
    <button
      type="button"
      role="switch"
      aria-checked={!isCount}
      aria-label="Toggle between absolute counts and percentages"
      onClick={() => setMode(isCount ? 'pct' : 'count')}
      className="group inline-flex items-center rounded-full bg-black/40 p-[3px] backdrop-blur-sm transition-colors hover:bg-black/60"
    >
      <Seg active={isCount} label="Count" />
      <Seg active={!isCount} label="%" />
    </button>
  )
}

function Seg({ active, label }: { active: boolean; label: string }) {
  return (
    <span
      className={[
        'rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-eyebrow transition-colors',
        active
          ? 'bg-paper text-ink-deep'
          : 'text-mute-2 group-hover:text-paper',
      ].join(' ')}
    >
      {label}
    </span>
  )
}
