import { movements } from '../../../data'
import { DeltaChip } from '../../common'

/**
 * Variant C — VERTICAL SEGMENTED BAR (вертикальная «колбаса»).
 *
 * Тот же sausage-язык, что у dials/straps, но развёрнутый вертикально:
 *   - Узкая вертикальная полоса слева (w-6, во всю высоту right-списка),
 *     3 сегмента сверху вниз: gold (Automatic) / ink-deep (Manual) /
 *     mute (Quartz). Пропорции = count / total.
 *   - Справа — большие строки: disc + name + count + % + delta.
 *
 * Почему здесь вертикальная: horizontal sausage тут не лезет (плитка
 * узкая, 3 сегмента по 63/26/11 — мелкий Quartz станет нечитаемым
 * кусочком в правом углу). Вертикаль даёт больше piksel'ей на каждый
 * сегмент при той же ширине плитки.
 *
 * Минус относительно донута: глаз хуже мерит длины вертикальных
 * сегментов, чем углы круга. Плюс — новая форма на дашборде, хорошо
 * ложится в пару к HeightsTileB по высоте.
 */

const SWATCH: Record<string, string> = {
  Automatic: '#A98155',
  Manual: '#1E1D19',
  Quartz: '#C6C6C6',
}

export default function MovementTileC() {
  const total = movements.reduce((a, b) => a + b.count, 0)

  return (
    <article className="rounded-sm border border-ink/5 bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.22)]">
      <h3 className="text-[16px] font-bold uppercase leading-[1.3] tracking-[0.01em] text-gold">
        Movement
      </h3>

      <div className="mt-6 flex gap-6">
        {/* Vertical sausage */}
        <div
          className="flex w-6 shrink-0 flex-col overflow-hidden rounded-full border border-ink/5"
          aria-label="Movement distribution"
        >
          {movements.map((m) => (
            <div
              key={m.name}
              style={{
                height: `${(m.count / total) * 100}%`,
                backgroundColor: SWATCH[m.name] ?? '#999',
              }}
              title={`${m.name} · ${m.count}`}
            />
          ))}
        </div>

        {/* Legend */}
        <ul className="min-w-0 flex-1 space-y-2">
          {movements.map((m) => {
            const pct = Math.round((m.count / total) * 100)
            return (
              <li
                key={m.name}
                className="grid min-h-[48px] grid-cols-[auto_minmax(0,1fr)_auto_auto_auto] items-center gap-3"
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
