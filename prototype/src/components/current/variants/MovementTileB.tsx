import { movements } from '../../../data'
import { DeltaChip } from '../../common'

/**
 * Variant B — DONUT CHART, hero-layout (column).
 *
 * Композиция переделана под пару с HeightsTileB (top-9 список,
 * высокая плитка):
 *   - Gold title «Movement» сверху.
 *   - Донут 220×220 ПО ЦЕНТРУ во всю ширину. Большой, как hero.
 *     В центре num «89%» (32px light, tabular) + eyebrow «mechanical».
 *   - Легенда — 3 строки снизу, во всю ширину, grid 5 колонок:
 *     disc + name + count + % + delta. Имена полные, не обрезаются.
 *
 * Почему column, а не row (row был в предыдущей итерации): в узкой
 * плитке row-легенда обрезала names до «Aut… / Ma… / Qu…» — читать
 * невозможно. Column даёт максимум ширины под каждую строку, донут
 * становится визуально крупнее (главный «хука» плитки).
 *
 * Высота плитки = высоте HeightsTileB с 9 строками. Промежутки
 * балансируются через flex-col + gap: донут + space + легенда.
 *
 * Ритм цифр: count 14px ink, % 11px mute-3, delta via common.DeltaChip.
 */

const SWATCH: Record<string, string> = {
  Automatic: '#A98155', // gold
  Manual: '#1E1D19', // ink-deep
  Quartz: '#C6C6C6', // mute
}

export default function MovementTileB() {
  const total = movements.reduce((a, b) => a + b.count, 0)
  const mechanicalPct = Math.round(
    ((movements.find((m) => m.name === 'Automatic')!.count +
      movements.find((m) => m.name === 'Manual')!.count) /
      total) *
      100,
  )

  // Donut geometry. Canvas 220, r=86, stroke=28.
  const CANVAS = 220
  const R = 86
  const STROKE = 28
  const C = 2 * Math.PI * R
  // Перекрытие между дугами — закрывает seam от butt-cap (особенно
  // на стыке Quartz→Automatic в 12 часов).
  const OVERLAP = 1

  let offset = 0
  const segments = movements.map((m) => {
    const frac = m.count / total
    const len = frac * C
    const seg = {
      name: m.name,
      length: len,
      offset,
      color: SWATCH[m.name] ?? '#999',
    }
    offset += len
    return seg
  })

  return (
    <article className="flex h-full flex-col rounded-sm border border-ink/5 bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.22)]">
      <h3 className="text-[16px] font-bold uppercase leading-[1.3] tracking-[0.01em] text-gold">
        Movement
      </h3>

      {/* Donut centered, takes available vertical space */}
      <div className="flex flex-1 items-center justify-center py-4">
        <div className="relative">
          <svg
            width={CANVAS}
            height={CANVAS}
            viewBox={`0 0 ${CANVAS} ${CANVAS}`}
            className="-rotate-90"
          >
            {/* Track убран: сегменты на 100% покрывают круг, track
                только подсвечивал бы seam между дугами. */}
            {segments.map((s) => (
              <circle
                key={s.name}
                cx={CANVAS / 2}
                cy={CANVAS / 2}
                r={R}
                fill="none"
                stroke={s.color}
                strokeWidth={STROKE}
                strokeDasharray={`${s.length + OVERLAP} ${C - s.length - OVERLAP}`}
                strokeDashoffset={-s.offset}
              />
            ))}
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <div className="num text-[40px] font-light leading-none tabular-nums text-ink">
              {mechanicalPct}%
            </div>
            <div className="mt-1 text-[10px] font-semibold uppercase tracking-eyebrow text-mute-3">
              mechanical
            </div>
          </div>
        </div>
      </div>

      {/* Legend below — full width. Тот же ритм, что на других плитках:
          disc + name+bar + count + delta. Без процентов (они уже видны
          из донута) и без рангов (у movement'а всего 3 категории, rank
          избыточен). Бар заполняется относительно Automatic (max). */}
      <ul className="space-y-2">
        {movements.map((m) => (
          <li
            key={m.name}
            className="grid min-h-[32px] grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-3"
          >
            <span
              className="h-8 w-8 shrink-0 rounded-full border border-ink/10"
              style={{ backgroundColor: SWATCH[m.name] ?? '#999' }}
              aria-hidden
            />
            <div className="min-w-0">
              <div className="truncate text-[14px] leading-none text-ink">{m.name}</div>
              <div className="mt-2 h-[6px] w-full overflow-hidden rounded-[6px] bg-ink/[0.08]">
                <div
                  className="h-full rounded-[6px]"
                  style={{
                    width: `${(m.count / movements[0].count) * 100}%`,
                    backgroundColor: SWATCH[m.name] ?? '#999',
                  }}
                />
              </div>
            </div>
            <span className="num text-[14px] tabular-nums text-ink">{m.count}</span>
            <DeltaChip delta={m.delta ?? 0} />
          </li>
        ))}
      </ul>
    </article>
  )
}
