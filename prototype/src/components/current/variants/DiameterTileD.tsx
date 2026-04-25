import { diameters } from '../../../data'
import { DeltaChipPct } from '../../common'

/**
 * Variant D — C, но counts ПЕРЕЕХАЛИ из-над-баров в отдельную строку
 * под mm-осью.
 *
 * Почему: в C числа жили над баром и (а) были 11px вместо договорных
 * 14px value-rhythm'а, (б) коллизировали с 2025-точками на соседних
 * барах близкой высоты («55» накрыло dot 40mm), (в) скакали по Y,
 * мешая читать форму распределения.
 *
 * Решение: выделенная строка значений — единый baseline, tabular-nums,
 * 14px ink. Форма распределения читается как строка чисел: 6, 8, 58,
 * 12, 27, 62, 51, 55, 40, 9, 20 — волна вокруг пика видна без глаз
 * по баr'ам.
 *
 * Peak — gold + font-semibold, neighbours (distance ≤ 2) — ink,
 * хвосты — mute-3. Тот же distance-gradient, что у бара — фокус от
 * периферии к пику.
 *
 * Слои под chart'ом:
 *   1. mm axis (11px mute-3, peak gold)
 *   2. count row (14px ink, peak gold+bold) ← новый
 *   3. YoY delta chips
 *
 * Chart идентичен B: distance-shaded бары + gold hairlines + 2025 dots.
 */

const BINS_MM = [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44]
const COUNTS_2025 = [5, 6, 50, 10, 22, 52, 60, 65, 48, 12, 28]

export default function DiameterTileD() {
  const counts26 = BINS_MM.map((mm) => diameters.find((d) => d.mm === mm)?.count ?? 0)
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
          Case diameters
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

      {/* Chart — 200px, bars + hairlines + dots. Без per-bar count'ов. */}
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

      {/* mm axis — категория */}
      <div className="mt-3 flex gap-2">
        {BINS_MM.map((mm, i) => (
          <div
            key={mm}
            className={`flex-1 text-center text-[11px] tabular-nums ${
              i === peakIdx ? 'font-semibold text-gold' : 'text-mute-3'
            }`}
          >
            {mm} mm
          </div>
        ))}
      </div>

      {/* Count row — значения 2026 на едином baseline, 14px tabular-nums,
          peak gold+bold, neighbours ink, хвосты mute-3. */}
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

      {/* YoY delta chips. absDelta — для Count/% toggle (число vs процент). */}
      <div className="mt-2 flex gap-2">
        {deltas.map((pct, i) => (
          <div key={i} className="flex flex-1 justify-center">
            <DeltaChipPct pct={pct} absDelta={counts26[i] - counts25[i]} />
          </div>
        ))}
      </div>
    </article>
  )
}
