import { prices } from '../../../data'
import { DeltaChipPct } from '../../common'

/**
 * Variant E — PriceTileD с always-visible count'ами в отдельной строке
 * (зеркало DiameterTileD).
 *
 * Почему: в D count 2026 был только в бегущем tooltip'е. Tooltip прятал
 * ключевую цифру за hover — «faux minimalism». Для консистентности обеих
 * histogram-плиток (price + diameter) переводим обе на одну схему:
 *   1. Chart (bars + hairlines + dots), без overlay-тултипа.
 *   2. X-axis labels — $-ранжи.
 *   3. Count row — 2026 значения, единый baseline, 14px tabular-nums,
 *      peak gold+bold, neighbours (distance ≤ 2) ink, хвосты mute-3.
 *   4. YoY delta chips.
 *
 * Остальное идентично D: distance-shaded бары (peak gold, соседи ink/75,
 * хвосты ink/30), gold hairlines поверх, 2025 dots, inverted markers на
 * peak-баре (ink/60).
 *
 * Данные 2025 — тот же placeholder, что был в D, с историей «рынок
 * сдвинулся в mid-luxury».
 */

const COUNTS_2025 = [5, 18, 45, 92, 87, 55, 35, 22, 11, 6, 3]

export default function PriceTileE() {
  const counts26 = prices.map((p) => p.count)
  const counts25 = COUNTS_2025
  const max = Math.max(...counts25, ...counts26)
  const peakIdx = counts26.indexOf(Math.max(...counts26))

  const deltas = counts26.map((v26, i) => {
    const v25 = counts25[i]
    if (v25 === 0) return 0
    return Math.round(((v26 - v25) / v25) * 100)
  })

  return (
    <article className="rounded-sm border border-ink/5 bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.22)]">
      <header className="flex items-start justify-between">
        <h3 className="text-[16px] font-bold uppercase leading-[1.3] tracking-[0.01em] text-gold">
          Price ranges
        </h3>
        <div className="flex items-center gap-5 text-[11px] font-semibold uppercase tracking-eyebrow text-mute-3">
          <span className="flex items-center gap-2">
            <span className="h-[6px] w-[6px] rounded-full bg-gold" />
            2025
          </span>
          <span className="flex items-center gap-2">
            <span className="h-[10px] w-[10px] rounded-[1px] bg-ink" />
            2026
          </span>
        </div>
      </header>

      {/* Chart — 200px, bars + hairlines + dots. Без overlay-тултипа. */}
      <div className="relative mt-6 h-[200px]">
        <div className="flex h-full items-end gap-2">
          {counts26.map((v26, i) => {
            const v25 = counts25[i]
            const h26 = (v26 / max) * 100
            const h25 = (v25 / max) * 100
            const isPeak = i === peakIdx
            const distance = Math.abs(i - peakIdx)
            const barShade = isPeak
              ? 'bg-gold'
              : distance <= 2
              ? 'bg-ink/75'
              : 'bg-ink/30'
            const lineClass = isPeak ? 'bg-ink/60' : 'bg-gold'
            const dotClass = isPeak ? 'bg-ink/60' : 'bg-gold'
            return (
              <div key={i} className="relative h-full flex-1">
                <div
                  className={`absolute bottom-0 left-0 right-0 rounded-t-[3px] ${barShade}`}
                  style={{ height: `${h26}%` }}
                />
                <div
                  className={`absolute left-1/2 w-[1.5px] -translate-x-1/2 ${lineClass}`}
                  style={{ bottom: 0, height: `${h25}%` }}
                />
                <div
                  className={`absolute left-1/2 h-[7px] w-[7px] -translate-x-1/2 translate-y-1/2 rounded-full ring-2 ring-white ${dotClass}`}
                  style={{ bottom: `${h25}%` }}
                />
              </div>
            )
          })}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-ink/10" />
      </div>

      {/* X-axis labels — price range short label */}
      <div className="mt-3 flex gap-2">
        {prices.map((p, i) => (
          <div
            key={i}
            className={`flex-1 text-center text-[11px] tabular-nums ${
              i === peakIdx ? 'font-semibold text-gold' : 'text-mute-3'
            }`}
          >
            {p.short}
          </div>
        ))}
      </div>

      {/* Count row — 2026 значения, единый baseline, 14px.
          Peak gold+bold, соседи ink, хвосты mute-3 — distance-gradient
          ведёт глаз от периферии к центру-пику. */}
      <div className="mt-1 flex gap-2">
        {counts26.map((v, i) => {
          const distance = Math.abs(i - peakIdx)
          const cls =
            i === peakIdx
              ? 'text-gold font-semibold'
              : distance <= 2
              ? 'text-ink'
              : 'text-mute-3'
          return (
            <div key={i} className={`num flex-1 text-center text-[14px] tabular-nums ${cls}`}>
              {v}
            </div>
          )
        })}
      </div>

      {/* YoY delta chips */}
      <div className="mt-2 flex gap-2">
        {deltas.map((pct, i) => (
          <div key={i} className="flex flex-1 justify-center">
            <DeltaChipPct pct={pct} />
          </div>
        ))}
      </div>
    </article>
  )
}
