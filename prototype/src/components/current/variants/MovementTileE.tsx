import { movements } from '../../../data'
import { DeltaChip } from '../../common'

/**
 * Variant E — DONUT + минималистичная легенда.
 *
 * Гипотеза против B: barchart'ы в легенде — визуальный дубль донута.
 * Донут УЖЕ показывает пропорции дугами; зачем дублировать их баром
 * в каждой строке? Это обесценивает донут (если бар говорит то же
 * самое, зачем тогда донут) и перегружает плитку «болотом» (тот
 * самый антипаттерн, из которого ушли).
 *
 * Решение:
 *   - Donut становится ГЕРОЕМ: 260×260 (vs 220 в B). Видим дуги, а не
 *     мелкую диаграмму рядом с легендой.
 *   - Легенда — чистая таблица: square-chip (rounded-[4px]) + name +
 *     count + delta. Без bar'ов, без процентов (они в донуте).
 *   - Маркеры — квадратики 10×10 с radius 2px. Отличает эту плитку
 *     от кружковых disc'ов на соседних плитках, подчёркивает что
 *     movement — другой тип чарта (не top-list).
 *
 * Высота плитки пара с HeightsTileB (h-full + flex-col).
 */

const SWATCH: Record<string, string> = {
  Automatic: '#A98155', // gold
  Manual: '#1E1D19', // ink-deep
  Quartz: '#C6C6C6', // mute
}

export default function MovementTileE() {
  const total = movements.reduce((a, b) => a + b.count, 0)
  const mechanicalPct = Math.round(
    ((movements.find((m) => m.name === 'Automatic')!.count +
      movements.find((m) => m.name === 'Manual')!.count) /
      total) *
      100,
  )

  // Bigger donut. Canvas 260, r=104, stroke=32.
  const CANVAS = 260
  const R = 104
  const STROKE = 32
  const C = 2 * Math.PI * R
  // Arcs перекрываются на OVERLAP единиц, чтобы на границах сегментов
  // не было seam'а от сглаживания (особенно видно на стыке последнего
  // сегмента (Quartz) с первым (Automatic) в позиции 12 часов —
  // Quartz «накрывает» первый пиксель Automatic, закрывая разрыв).
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

      {/* Donut — герой плитки, flex-1 центрирует по свободной высоте. */}
      <div className="flex flex-1 items-center justify-center py-4">
        <div className="relative">
          <svg
            width={CANVAS}
            height={CANVAS}
            viewBox={`0 0 ${CANVAS} ${CANVAS}`}
            className="-rotate-90"
          >
            {/* Track убран намеренно: сегменты покрывают 100%, а track
                (#EEEDEC) только подсвечивал seam'ы между дугами. */}
            {segments.map((s) => (
              <circle
                key={s.name}
                cx={CANVAS / 2}
                cy={CANVAS / 2}
                r={R}
                fill="none"
                stroke={s.color}
                strokeWidth={STROKE}
                // OVERLAP расширяет каждую дугу на 1px в сторону конца,
                // чтобы соседние сегменты физически перекрывались и
                // butt-cap не оставлял seam (особенно заметно на стыке
                // Quartz→Automatic в 12 часов).
                strokeDasharray={`${s.length + OVERLAP} ${C - s.length - OVERLAP}`}
                strokeDashoffset={-s.offset}
              />
            ))}
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <div className="num text-[48px] font-light leading-none tabular-nums text-ink">
              {mechanicalPct}%
            </div>
            <div className="mt-1 text-[10px] font-semibold uppercase tracking-eyebrow text-mute-3">
              mechanical
            </div>
          </div>
        </div>
      </div>

      {/* Минималистичная легенда: square-chip + name + count + delta.
          Без bar'ов — донут уже показывает пропорции. Ширина под
          донут (260px + воздух), по центру. Между строками dashed
          разделитель 1px ink/15 — даёт ритм без тяжёлых линий.
          py-1.5 на строках держит высоту легенды близко к старой (где
          не было borders, а был только gap-y-2.5), чтобы не ломать
          пару с HeightsTileB. leading-none на count'е — ось items-
          center на gridе центрирует text-box количества и box chip'а
          по одной оси (оба ~15px высоты). */}
      <ul className="mx-auto w-full max-w-[280px]">
        {movements.map((m, i) => (
          <li
            key={m.name}
            className={`grid grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-x-3 py-1.5 ${
              i < movements.length - 1 ? 'border-b border-dashed border-ink/15' : ''
            }`}
          >
            <span
              className="h-[10px] w-[10px] rounded-[2px]"
              style={{ backgroundColor: SWATCH[m.name] ?? '#999' }}
              aria-hidden
            />
            <span className="truncate text-[14px] leading-none text-ink">{m.name}</span>
            <span className="num justify-self-end text-[14px] leading-none tabular-nums text-ink">
              {m.count}
            </span>
            <span className="justify-self-end">
              <DeltaChip delta={m.delta ?? 0} />
            </span>
          </li>
        ))}
      </ul>
    </article>
  )
}
