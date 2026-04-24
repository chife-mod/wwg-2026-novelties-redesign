import { topCollections } from '../../../data'
import { BrandLogo, DeltaChip } from '../../common'

/**
 * Variant B — такая же «редакторская» плитка, как BrandsTileD:
 *   - Заголовок «Top collections» в gold (#A98155), убран kicker «LINES»
 *     и блок «119 ACTIVE» справа, нижний `border-t` над строками тоже убран.
 *   - Голые номера «01 / 02 / ... / 06», колонка w-6.
 *   - Brand-лого 32×32 через BrandLogo (вытягиваем из `c.brand`).
 *     Alias: в data.ts бренд записан как «Bulgari», в manifest'е ключ
 *     «Bvlgari» — маппим, чтобы не падало на монограмму.
 *   - Row min-h-[32px], space-y-2, p-6 — ровно как в BrandsTileD, чтобы
 *     на главной две плитки были одинаковой высоты.
 *
 * Hypothesis: бренд-лого помогает быстро опознать «чью» коллекцию читаем.
 * Имя коллекции всё равно начинается с бренда, но глазу проще схватить
 * иконку, чем начало слова.
 */

// manifest key is "Bvlgari", data calls it "Bulgari".
// Все остальные бренды в topCollections — 1:1 с manifest'ом.
const BRAND_ALIAS: Record<string, string> = {
  Bulgari: 'Bvlgari',
}

export default function CollectionsTileB() {
  const list = topCollections.slice(0, 6)
  const max = list[0].count

  return (
    <article className="rounded-sm border border-ink/5 bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.22)]">
      <h3 className="text-[16px] font-bold uppercase leading-[1.3] tracking-[0.01em] text-gold">
        Top collections
      </h3>

      <ul className="mt-[30px] space-y-2">
        {list.map((c, i) => {
          const logoKey = BRAND_ALIAS[c.brand] ?? c.brand
          return (
            <li
              key={c.fullName}
              className="grid min-h-[32px] grid-cols-[auto_32px_minmax(0,1fr)_auto_auto] items-center gap-3"
            >
              <span className="num w-6 text-[12px] tabular-nums text-mute-3">
                {String(i + 1).padStart(2, '0')}
              </span>
              <BrandLogo name={logoKey} size={32} />
              <div className="min-w-0">
                <div className="truncate text-[14px] leading-none text-ink">{c.fullName}</div>
                <div className="mt-2 h-[6px] w-full overflow-hidden rounded-[6px] bg-ink/[0.08]">
                  <div
                    className="h-full rounded-[6px] bg-ink"
                    style={{ width: `${(c.count / max) * 100}%` }}
                  />
                </div>
              </div>
              <span className="num text-[14px] tabular-nums text-ink">{c.count}</span>
              <DeltaChip delta={c.delta} />
            </li>
          )
        })}
      </ul>
    </article>
  )
}
