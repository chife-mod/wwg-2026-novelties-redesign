import { dialColors } from '../../../data'
import { DeltaChip } from '../../common'

/**
 * Variant B — редакторская плитка как BrandsTileD / CollectionsTileB /
 * StrapsTileB, с сохранённой «колбасой» в виде компактной stripe
 * НАПРОТИВ заголовка (как легенда 2025/2026 в PriceTileD).
 *
 * Почему inline, а не отдельным блоком:
 *   Отдельный блок ниже title добавлял ~36px высоты → dials становилась
 *   выше соседней StrapsTileB, ряд расстраивался. Inline-версия ничего
 *   не добавляет: колбаса живёт в строке заголовка. Heights снова равны.
 *
 * Структура:
 *   1. Header: gold title слева + sausage-stripe справа (10 цветов
 *      пропорционально, ~140px × 10px, rounded-full). Одним взглядом
 *      видно: синий доминирует, хвост мелкий.
 *   2. 6-строчный список top-6 с rank + swatch + name + bar + count +
 *      delta — точно как straps/brands/collections.
 *
 * Stripe репрезентует все 10 цветов; список — top-6. Двойная
 * репрезентация: stripe показывает whole, list — focus.
 *
 * Swatch в списке — реальный цвет циферблата. Skeleton = decorative
 * diagonal-stripes (открытый механизм, сплошного цвета нет).
 */
export default function DialsTileB() {
  const list = dialColors.slice(0, 6)
  const max = list[0].count
  const total = dialColors.reduce((sum, d) => sum + d.count, 0)

  return (
    <article className="rounded-sm border border-ink/5 bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.22)]">
      <header className="flex items-center gap-6">
        <h3 className="shrink-0 text-[16px] font-bold uppercase leading-[1.3] tracking-[0.01em] text-gold">
          Dial colors
        </h3>
        {/* Inline sausage — все 10 цветов пропорционально.
            Высота совпадает с визуальной высотой uppercase title (h-5 ≈ 20px
            ≈ text-[16px] × line-height 1.3). flex-1 растягивает до правого
            края карточки. Отступ слева-направо: p-6 (24px) → title → gap-6
            (24px) → sausage → p-6 (24px) — симметричный ритм. */}
        <div
          className="flex h-5 flex-1 overflow-hidden rounded-full border border-ink/5"
          aria-label="Colour distribution"
        >
          {dialColors.map((d) => {
            const isSkeleton = d.hex.startsWith('url')
            const style = isSkeleton
              ? {
                  width: `${(d.count / total) * 100}%`,
                  backgroundImage:
                    'repeating-linear-gradient(45deg, #B5B5B5 0 3px, #DADADA 3px 6px)',
                }
              : {
                  width: `${(d.count / total) * 100}%`,
                  backgroundColor: d.hex,
                }
            return <div key={d.name} style={style} title={`${d.name} · ${d.count}`} />
          })}
        </div>
      </header>

      <ul className="mt-[30px] space-y-2">
        {list.map((d, i) => {
          // Skeleton — не сплошной цвет, а «открытый механизм»: полосатая заливка.
          const isSkeleton = d.hex.startsWith('url')
          const swatchStyle = isSkeleton
            ? {
                backgroundImage:
                  'repeating-linear-gradient(45deg, #B5B5B5 0 3px, #DADADA 3px 6px)',
              }
            : {
                backgroundColor: d.hex,
                borderColor: d.ring ?? undefined,
              }
          return (
            <li
              key={d.name}
              className="grid min-h-[32px] grid-cols-[auto_32px_minmax(0,1fr)_auto_auto] items-center gap-3"
            >
              <span className="num w-6 text-[12px] tabular-nums text-mute-3">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span
                className="h-8 w-8 rounded-full border border-ink/10"
                style={swatchStyle}
                aria-hidden
              />
              <div className="min-w-0">
                <div className="truncate text-[14px] leading-none text-ink">{d.name}</div>
                <div className="mt-2 h-[6px] w-full overflow-hidden rounded-[6px] bg-ink/[0.08]">
                  <div
                    className="h-full rounded-[6px] bg-ink"
                    style={{ width: `${(d.count / max) * 100}%` }}
                  />
                </div>
              </div>
              <span className="num text-[14px] tabular-nums text-ink">{d.count}</span>
              <DeltaChip delta={d.delta ?? 0} />
            </li>
          )
        })}
      </ul>
    </article>
  )
}
