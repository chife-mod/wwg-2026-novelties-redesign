import { dialColors } from '../../../data'
import { DeltaChip } from '../../common'

/**
 * Variant E — B + большая sausage-колбаса ВНИЗУ плитки на всю ширину.
 *
 * Hypothesis Олега: раз у обеих соседних плиток (dials + straps) есть
 * колбаса, можно отказаться от inline-версии и положить её снизу под
 * bar-chart'ами — на всю ширину, как в оригинале A. Высота обеих
 * увеличится одинаково, ряд останется ровным. Колбаса читается крупнее.
 *
 * Структура:
 *   1. Gold title «Dial colors».
 *   2. 6-строчный список top-6 с rank + swatch + name + bar + count +
 *      delta — как в B.
 *   3. Full-width sausage внизу (h-5, rounded-full, 10 цветов
 *      пропорционально). Тонкий ink-divider над ней отделяет от списка.
 *
 * Отличие от B: sausage не inline в header'е, а «подводка» под списком.
 * Отличие от D: сохраняем бары в строках (тот же фрейм, что у
 * brands/collections/straps) — «просто усиленная B».
 */
export default function DialsTileE() {
  const list = dialColors.slice(0, 6)
  const max = list[0].count
  const total = dialColors.reduce((sum, d) => sum + d.count, 0)

  return (
    <article className="rounded-sm border border-ink/5 bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.22)]">
      <h3 className="text-[16px] font-bold uppercase leading-[1.3] tracking-[0.01em] text-gold">
        Dial colors
      </h3>

      <ul className="mt-[30px] space-y-2">
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

      {/* Full-width sausage ВНИЗУ — все 10 цветов пропорционально.
          Тонкий divider сверху отделяет от списка. */}
      <div
        className="mt-6 flex h-5 w-full overflow-hidden rounded-full border border-ink/5"
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
    </article>
  )
}
