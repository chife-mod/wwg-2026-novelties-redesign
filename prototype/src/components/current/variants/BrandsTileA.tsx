import { brands } from '../../../data'
import { DeltaChip } from '../../common'

/**
 * Variant B on the dashboard — "максимально чистая".
 *   - No rank numbers, no avatars, no monograms. Just: name · bar · count · delta.
 *   - Title in sentence case (not uppercase) — читается как редакционный заголовок,
 *     а не как ярлык секции. Разница с Variant C (там капс + номера) задаёт ось
 *     A/B: насколько «голая» подача проседает по читаемости иерархии.
 *   - Typography from the Figma "Sources" tile: 16-18px bold title, 14px rows,
 *     6px bar height, rounded-[6px] corners.
 */
export default function BrandsTileA() {
  const list = brands.slice(0, 6)
  const max = list[0].count

  return (
    <article className="rounded-sm border border-ink/5 bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.22)]">
      <h3 className="text-[18px] font-bold leading-[1.3] tracking-[-0.005em] text-ink">
        Top brands at the fair
      </h3>

      <ul className="mt-[30px] space-y-3">
        {list.map((b) => (
          <li
            key={b.name}
            className="grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3"
          >
            <div className="min-w-0">
              <div className="truncate text-[14px] leading-none text-ink">{b.name}</div>
              <div className="mt-2 h-[6px] w-full overflow-hidden rounded-[6px] bg-ink/[0.08]">
                <div
                  className="h-full rounded-[6px] bg-ink"
                  style={{ width: `${(b.count / max) * 100}%` }}
                />
              </div>
            </div>
            <span className="num text-[14px] tabular-nums text-ink">{b.count}</span>
            <DeltaChip delta={b.delta} />
          </li>
        ))}
      </ul>
    </article>
  )
}
