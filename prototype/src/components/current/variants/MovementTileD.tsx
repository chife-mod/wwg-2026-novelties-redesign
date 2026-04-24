import { movements } from '../../../data'
import { DeltaChip } from '../../common'

/**
 * Variant D — CONCENTRIC RINGS (Apple-Watch-style gauge).
 *
 * Три вложенных кольца, каждое — своя категория. Кольцо «заполняется»
 * на свой процент от 100% (не от максимума, а именно от целого, как у
 * Apple'а). Рисуем arcs clockwise от 12 часов.
 *   - Outer ring: Automatic — gold
 *   - Middle ring: Manual  — ink-deep
 *   - Inner ring: Quartz   — mute-2
 *
 * Семантически немного натяжка: arc-to-100% подразумевает individual
 * goal per category, а у нас — part-of-whole, где сумма всегда 100%.
 * Но визуально — очень lux/gadget-friendly. Остаётся в sandbox как
 * эстетическая альтернатива донуту.
 *
 * Справа — та же легенда, что в B/C: disc + name + count + % + delta.
 */

const SWATCH: Record<string, string> = {
  Automatic: '#A98155',
  Manual: '#1E1D19',
  Quartz: '#C6C6C6',
}

// Три кольца с убывающим радиусом. stroke константный, gap = 4px.
const RINGS = [
  { r: 70, name: 'Automatic' },
  { r: 52, name: 'Manual' },
  { r: 34, name: 'Quartz' },
]
const STROKE = 14

export default function MovementTileD() {
  const total = movements.reduce((a, b) => a + b.count, 0)
  const byName = Object.fromEntries(movements.map((m) => [m.name, m]))

  return (
    <article className="rounded-sm border border-ink/5 bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.22)]">
      <h3 className="text-[16px] font-bold uppercase leading-[1.3] tracking-[0.01em] text-gold">
        Movement
      </h3>

      <div className="mt-6 flex items-center gap-7">
        {/* Rings */}
        <div className="relative shrink-0">
          <svg width={160} height={160} viewBox="0 0 160 160" className="-rotate-90">
            {RINGS.map((ring) => {
              const m = byName[ring.name]
              const frac = m ? m.count / total : 0
              const C = 2 * Math.PI * ring.r
              return (
                <g key={ring.name}>
                  <circle
                    cx={80}
                    cy={80}
                    r={ring.r}
                    fill="none"
                    stroke="#EEEDEC"
                    strokeWidth={STROKE}
                  />
                  <circle
                    cx={80}
                    cy={80}
                    r={ring.r}
                    fill="none"
                    stroke={SWATCH[ring.name] ?? '#999'}
                    strokeWidth={STROKE}
                    strokeLinecap="round"
                    strokeDasharray={`${frac * C} ${C - frac * C}`}
                  />
                </g>
              )
            })}
          </svg>
        </div>

        {/* Legend */}
        <ul className="min-w-0 flex-1 space-y-2">
          {movements.map((m) => {
            const pct = Math.round((m.count / total) * 100)
            return (
              <li
                key={m.name}
                className="grid min-h-[32px] grid-cols-[auto_minmax(0,1fr)_auto_auto_auto] items-center gap-3"
              >
                <span
                  className="h-3 w-3 rounded-full"
                  style={{ backgroundColor: SWATCH[m.name] ?? '#999' }}
                  aria-hidden
                />
                <span className="truncate text-[14px] leading-none text-ink">{m.name}</span>
                <span className="num text-[14px] tabular-nums text-ink">{m.count}</span>
                <span className="num text-[11px] tabular-nums text-mute-3">{pct}%</span>
                <DeltaChip delta={m.delta ?? 0} />
              </li>
            )
          })}
        </ul>
      </div>
    </article>
  )
}
