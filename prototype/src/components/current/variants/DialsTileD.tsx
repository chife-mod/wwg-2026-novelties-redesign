import { dialColors } from '../../../data'
import { DeltaChip } from '../../common'

/**
 * Variant D — editorial sandbox без bar-chart'ов в строках.
 *
 * Гипотеза: dials — это distribution, не ranked-count. Цвет сам по себе
 * уже идентификатор (swatch = the chart). Full-width sausage — THE
 * визуализация распределения. Значит, бары в строках дублируют
 * sausage'у и добавляют «бар-чарт-болото».
 *
 * Структура:
 *   1. Gold title + editorial hero «Colour of the year · Blue» с
 *      крупным цветным именем, метаданные 28% · 105.
 *   2. Full-width sausage под hero.
 *   3. Top-6 список БЕЗ баров: rank · swatch · name · count · delta.
 *      4 колонки вместо 5. Дышит, не кричит.
 *
 * Итог: у плитки есть editorial voice (hero), whole-distribution
 * (sausage) и focus (top-6) — без повтора одной метрики двумя
 * визуализациями.
 */
export default function DialsTileD() {
  const list = dialColors.slice(0, 6)
  const total = dialColors.reduce((sum, d) => sum + d.count, 0)
  const leader = dialColors[0]
  const leaderPct = Math.round((leader.count / total) * 100)

  return (
    <article className="rounded-sm border border-ink/5 bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.22)]">
      <h3 className="text-[16px] font-bold uppercase leading-[1.3] tracking-[0.01em] text-gold">
        Dial colors
      </h3>

      {/* Editorial hero: «Colour of the year» + имя-цвет + meta.
          Имя-цвет крупным editorial-серифом (Cormorant Garamond), чтобы
          отличаться от нумерованного списка ниже и от sans заголовка. */}
      <div className="mt-4 flex items-baseline justify-between gap-4">
        <div>
          <div className="text-[11px] font-medium uppercase tracking-[0.08em] text-mute-3">
            Colour of the year
          </div>
          <div className="mt-1 font-editorial text-[32px] leading-none text-ink">
            {leader.name}
          </div>
        </div>
        <div className="shrink-0 text-right text-[13px] tabular-nums text-mute-3">
          {leaderPct}% · {leader.count}
        </div>
      </div>

      {/* Full-width sausage — все 10 цветов пропорционально. */}
      <div
        className="mt-4 flex h-5 w-full overflow-hidden rounded-full border border-ink/5"
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

      {/* Top-6 legend БЕЗ баров: 4 колонки rank · swatch · name · count · delta.
          Sausage уже показала распределение — повторять бары в строках
          избыточно и возвращает «бар-чарт-болото». */}
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
              <div className="min-w-0 truncate text-[14px] leading-none text-ink">{d.name}</div>
              <span className="num text-[14px] tabular-nums text-ink">{d.count}</span>
              <DeltaChip delta={d.delta ?? 0} />
            </li>
          )
        })}
      </ul>
    </article>
  )
}
