import { strapTypes } from '../../../data'
import { DeltaChip } from '../../common'

/**
 * Variant B — то же решение, что BrandsTileD / CollectionsTileB:
 *   - Gold uppercase заголовок «Strap materials» сам работает eyebrow'ом.
 *   - Убран kicker «Straps», убран правый insight-блок
 *     («Stainless leads · 133»), убран нижний border-t с подписью
 *     «Leather family X% · bracelets Y%».
 *   - Голые номера ранга, row min-h 32, space-y-2.
 *   - Слева от названия — цветной 32×32 диск с цветом материала
 *     (strapSwatch инлайнен из V2RightGrid — один источник правды).
 *     Лого для материалов нет и быть не может; цвет сам по себе
 *     работает identifier'ом (серебро = сталь, коричневый = alligator).
 *
 * Дельты — placeholder YoY в data.strapTypes (абсолютные штуки).
 * Ритм плитки совпадает с brands/collections: 5 колонок
 * rank/swatch/name+bar/count/delta, DeltaChip из common (11px, 42 min-w).
 *
 * Общий grid на весь список через `<li class="contents">` — тот же фикс
 * выравнивания правой колонки count, что и в BrandsTileD/BrandsTileD1.
 */

// Цвета материалов — скопированы из V2RightGrid.StrapTile. Если
// сделаем много strap-вариантов, вынесем в data.ts как strapSwatch.
// Пока живут здесь — единственный потребитель.
const STRAP_SWATCH: Record<string, string> = {
  'Stainless Steel': '#9AA0A5',
  Alligator: '#4A2C1F',
  Rubber: '#1E1E1E',
  Leather: '#6B3F22',
  Calfskin: '#A57552',
  Titanium: '#6F7379',
  'Rose Gold': '#C4866E',
  Gold: '#C69956',
  Ceramic: '#2A2A2A',
  Composite: '#3F3F3F',
}

export default function StrapsTileB() {
  const list = strapTypes.slice(0, 6)
  const max = list[0].count
  const total = strapTypes.reduce((sum, s) => sum + s.count, 0)

  return (
    <article className="rounded-sm border border-ink/5 bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.22)]">
      <header className="flex items-center gap-6">
        <h3 className="shrink-0 text-[16px] font-bold uppercase leading-[1.3] tracking-[0.01em] text-gold">
          Strap materials
        </h3>
        {/* Inline sausage — все 10 материалов пропорционально. Такой же
            pattern, как в DialsTileB: h-5 ≈ визуальная высота uppercase
            title, flex-1 растягивает до правого края карточки. Цвета —
            STRAP_SWATCH, материал без цвета получает серый fallback. */}
        <div
          className="flex h-5 flex-1 overflow-hidden rounded-full border border-ink/5"
          aria-label="Material distribution"
        >
          {strapTypes.map((s) => (
            <div
              key={s.name}
              style={{
                width: `${(s.count / total) * 100}%`,
                backgroundColor: STRAP_SWATCH[s.name] ?? '#999',
              }}
              title={`${s.name} · ${s.count}`}
            />
          ))}
        </div>
      </header>

      <ul className="mt-[30px] space-y-2">
        {list.map((s, i) => (
          <li
            key={s.name}
            className="grid min-h-[32px] grid-cols-[auto_32px_minmax(0,1fr)_auto_auto] items-center gap-3"
          >
            <span className="num w-6 text-[12px] tabular-nums text-mute-3">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span
              className="h-8 w-8 rounded-full border border-ink/10"
              style={{ backgroundColor: STRAP_SWATCH[s.name] ?? '#999' }}
              aria-hidden
            />
            <div className="min-w-0">
              <div className="truncate text-[14px] leading-none text-ink">{s.name}</div>
              <div className="mt-2 h-[6px] w-full overflow-hidden rounded-[6px] bg-ink/[0.08]">
                <div
                  className="h-full rounded-[6px] bg-ink"
                  style={{ width: `${(s.count / max) * 100}%` }}
                />
              </div>
            </div>
            <span className="num text-[14px] tabular-nums text-ink">{s.count}</span>
            <DeltaChip delta={s.delta ?? 0} />
          </li>
        ))}
      </ul>
    </article>
  )
}
