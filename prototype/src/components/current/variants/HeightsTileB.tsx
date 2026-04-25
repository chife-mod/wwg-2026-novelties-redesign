import { caseHeights } from '../../../data'
import { DeltaChip } from '../../common'

/**
 * Variant B — редакторская плитка как functions/materials/straps/dials.
 *   - Gold uppercase заголовок «Case heights» (раньше был PROFILE + «Slim
 *     wins the wrist» — editorial, но путает с кейсами «Case diameters»).
 *     Единая номенклатура: Case diameters / Case heights / Case materials.
 *   - Убран kicker, убран правый insight-блок «44% ≤ 8 MM» (конкурировал
 *     с top-list'ом, формально дублировался в строках 01/02).
 *   - 6-строчный top-list с rank + name + bar + count + delta.
 *
 * 4-колоночный grid (без swatch, как functions) — высота у pairs'а с
 * Movement'ом держится через `auto-rows-[minmax(32px,auto)]`, даже когда
 * соседняя плитка — донут другого типа.
 *
 * Placeholder delta story: «slim-обвал» — 7mm +22, 14mm -9, 6mm +11
 * (mostre-тренд: ультратонкие корпуса растут, классические 11-14 падают).
 */
export default function HeightsTileB() {
  // Показываем весь список (9 позиций). Плитка становится высокой — это
  // нужно: она паритет с Movement'ом, у которого большой центральный
  // donut + легенда снизу. На top-6 плитки получались «пустыми» рядом
  // с огромным донутом.
  const list = caseHeights
  const max = list[0].count

  return (
    <article className="rounded-sm border border-ink/5 bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.22)]">
      <h3 className="text-[16px] font-bold uppercase leading-[1.3] tracking-[0.01em] text-gold">
        Case heights
      </h3>

      <ul className="mt-[30px] space-y-2">
        {list.map((h, i) => (
          <li
            key={h.name}
            className="grid min-h-[32px] grid-cols-[auto_minmax(0,1fr)_auto_auto] items-center gap-3"
          >
            <span className="num w-6 text-[12px] tabular-nums text-mute-3">
              {String(i + 1).padStart(2, '0')}
            </span>
            <div className="min-w-0">
              <div className="truncate text-[14px] leading-none text-ink">{h.name}</div>
              <div className="mt-2 h-[6px] w-full overflow-hidden rounded-[6px] bg-ink/[0.08]">
                <div
                  className="h-full rounded-[6px] bg-ink"
                  style={{ width: `${(h.count / max) * 100}%` }}
                />
              </div>
            </div>
            <span className="num text-[14px] tabular-nums text-ink">{h.count}</span>
            <DeltaChip delta={h.delta ?? 0} count={h.count} />
          </li>
        ))}
      </ul>
    </article>
  )
}
