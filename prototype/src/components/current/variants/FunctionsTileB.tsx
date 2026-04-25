import { functions } from '../../../data'
import { DeltaChip } from '../../common'

/**
 * Variant B — редакторская плитка как brands/collections/straps/dials.
 *   - Gold uppercase заголовок «Complications» сам работает eyebrow'ом.
 *     Убран kicker «Complications» и editorial title «What the movement
 *     does», убран insight-блок «Chronographs 23 · Tourbillons 11»
 *     (дублирует числа из списка, лишний шум).
 *   - 6-строчный top-list с rank + name + bar + count + delta.
 *
 * У complications нет визуального identifier'а (нет цвета, логотипа) —
 * поэтому 4-колоночный grid: rank · name+bar · count · delta. Высота
 * строки та же (minmax 32px), что у соседей с 5-колоночным grid'ом,
 * → пара materials/functions по высоте ровняется без колонки-swatch.
 *
 * Delta — placeholder YoY в data.functions.
 */
export default function FunctionsTileB() {
  const list = functions.slice(0, 6)
  const max = list[0].count

  return (
    <article className="rounded-sm border border-ink/5 bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.22)]">
      <h3 className="text-[16px] font-bold uppercase leading-[1.3] tracking-[0.01em] text-gold">
        Complications
      </h3>

      <ul className="mt-[30px] space-y-2">
        {list.map((f, i) => (
          <li
            key={f.name}
            className="grid min-h-[32px] grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-3"
          >
            <span className="num w-6 text-[12px] tabular-nums text-mute-3">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="min-w-0">
              <div className="truncate text-[14px] leading-none text-ink">{f.name}</div>
              <div className="mt-2 h-[6px] w-full overflow-hidden rounded-[6px] bg-ink/[0.08]">
                <div
                  className="h-full rounded-[6px] bg-ink"
                  style={{ width: `${(f.count / max) * 100}%` }}
                />
              </div>
            </div>
            <span className="num text-[14px] tabular-nums text-ink">{f.count}</span>
            <DeltaChip delta={f.delta ?? 0} count={f.count} />
          </li>
        ))}
      </ul>
    </article>
  )
}
