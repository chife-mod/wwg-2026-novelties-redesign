import { dialColors } from '../../../data'
import { DeltaChip } from '../../common'

/**
 * Variant F — E с sausage СВЕРХУ под заголовком (не снизу).
 *
 * Почему сверху (после обсуждения в чате):
 *   1. Information hierarchy: sausage = headline chart (whole distribution
 *      всех 10 цветов), list = detail/focus (top-6 с числами). Editorial
 *      pattern: chart first, detail after — как в журнальной инфографике.
 *   2. Tight header moment: gold title + цветная полоса под ним =
 *      мгновенное считывание «о каких цветах речь». Title и sausage
 *      работают одним компонентом, eyebrow + headline.
 *   3. Пара dials + straps получает одинаковый ритм header'а: title →
 *      sausage → list. Визуальный резонанс без дублирования barchart-тем.
 *
 * Минимум шума: никаких «Colour of the year», big «Blue», «28% · 105».
 * Всё, что нужно знать, — уже в sausage и первой строке списка.
 * Signature-момент плитки — форма sausage, без добавленных слов.
 *
 * Структура:
 *   1. Gold title «Dial colors».
 *   2. Full-width sausage (10 цветов пропорционально, h-5, rounded-full).
 *   3. 6-строчный top-list с rank + swatch + name + bar + count + delta.
 */
export default function DialsTileF() {
  const list = dialColors.slice(0, 6)
  const max = list[0].count
  const total = dialColors.reduce((sum, d) => sum + d.count, 0)

  return (
    <article className="rounded-sm border border-ink/5 bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.22)]">
      <h3 className="text-[16px] font-bold uppercase leading-[1.3] tracking-[0.01em] text-gold">
        Dial colors
      </h3>

      {/* Full-width sausage СВЕРХУ — headline chart, все 10 цветов
          пропорционально. h-5, rounded-full, тонкий border. */}
      <div
        className="mt-5 flex h-5 w-full overflow-hidden rounded-full border border-ink/5"
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

      {/* Top-6 list с barchart'ами — detail/focus. Те же 5 колонок, что
          у brands/collections/straps: rank + swatch + name + bar + count + delta. */}
      <ul className="mt-6 space-y-2">
        {list.map((d, i) => {
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
