import { caseMaterials } from '../../../data'
import { DeltaChip } from '../../common'

/**
 * Variant B — редакторская плитка как brands/collections/straps/dials.
 *   - Gold uppercase заголовок «Case materials» сам работает eyebrow'ом.
 *     Убран kicker «Case metal» и editorial title «The case material mix»,
 *     убран insight-блок «Steel X vs gold family Y» (дубль чисел списка).
 *   - 6-строчный top-list с rank + swatch + name + bar + count + delta.
 *
 * У материалов ЕСТЬ visual identifier — цвет диска (серебро = сталь,
 * коричневый = rose gold, чёрный = керамика). Поэтому 5-колоночный grid:
 *   rank · swatch · name+bar · count · delta
 * Тот же ритм, что у brands/collections/straps/dials.
 *
 * ВАЖНО: БЕЗ sausage. Пара functions/materials стоит соседними плитками;
 * functions sausage'и иметь не может (у complications нет цвета), поэтому
 * у materials его тоже нет — две соседние плитки выравниваются по
 * высоте без costly визуального шума.
 *
 * Delta — placeholder YoY в data.caseMaterials.
 */

const MATERIAL_SWATCH: Record<string, string> = {
  'Stainless Steel': '#9AA0A5',
  Titanium: '#6F7379',
  'Rose Gold': '#C4866E',
  'White Gold': '#D8D2C4',
  Ceramic: '#1E1E1E',
  'Yellow Gold': '#D4A24C',
  Platinum: '#E3E3E5',
  Carbon: '#111111',
  'Red Gold': '#A85F3F',
  Gold: '#C69956',
}

export default function MaterialsTileB() {
  const list = caseMaterials.slice(0, 6)
  const max = list[0].count

  return (
    <article className="rounded-sm border border-ink/5 bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.22)]">
      <h3 className="text-[16px] font-bold uppercase leading-[1.3] tracking-[0.01em] text-gold">
        Case materials
      </h3>

      <ul className="mt-[30px] space-y-2">
        {list.map((m, i) => (
          <li
            key={m.name}
            className="grid min-h-[32px] grid-cols-[auto_32px_minmax(0,1fr)_auto_auto] items-center gap-3"
          >
            <span className="num w-6 text-[12px] tabular-nums text-mute-3">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span
              className="h-8 w-8 rounded-full border border-ink/10"
              style={{ backgroundColor: MATERIAL_SWATCH[m.name] ?? '#999' }}
              aria-hidden
            />
            <div className="min-w-0">
              <div className="truncate text-[14px] leading-none text-ink">{m.name}</div>
              <div className="mt-2 h-[6px] w-full overflow-hidden rounded-[6px] bg-ink/[0.08]">
                <div
                  className="h-full rounded-[6px] bg-ink"
                  style={{ width: `${(m.count / max) * 100}%` }}
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
