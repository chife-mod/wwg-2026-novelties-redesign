import { strapTypes } from '../../../data'
import { DeltaChip } from '../../common'

/**
 * Variant C — StrapsTileB с полноширинной sausage СВЕРХУ под title.
 *
 * Синхронно с DialsTileF: title + full-width sausage + top-6 list.
 * Пара dials+straps получает одинаковый header-ритм, визуальный резонанс
 * между соседними плитками без повторения barchart-тем.
 *
 * Почему здесь sausage оправдана как у dials:
 *   Strap materials — это тоже distribution (какие материалы в миксе),
 *   а не чисто ranked count. Цвет материала в swatch'е уже identifier;
 *   sausage показывает whole — 10 материалов пропорционально.
 *
 * Структура:
 *   1. Gold title «Strap materials».
 *   2. Full-width sausage (10 материалов, h-5, rounded-full). Цвета из
 *      STRAP_SWATCH, skeleton/composite — сплошной тёмный без паттерна.
 *   3. 6-строчный top-list с rank + swatch + name + bar + count + delta.
 */

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

export default function StrapsTileC() {
  const list = strapTypes.slice(0, 6)
  const max = list[0].count
  const total = strapTypes.reduce((sum, s) => sum + s.count, 0)

  return (
    <article className="rounded-sm border border-ink/5 bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.22)]">
      <h3 className="text-[16px] font-bold uppercase leading-[1.3] tracking-[0.01em] text-gold">
        Strap materials
      </h3>

      {/* Full-width sausage СВЕРХУ — headline chart, 10 материалов
          пропорционально. Синхронно с DialsTileF. */}
      <div
        className="mt-5 flex h-5 w-full overflow-hidden rounded-full border border-ink/5"
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

      <ul className="mt-6 space-y-2">
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
