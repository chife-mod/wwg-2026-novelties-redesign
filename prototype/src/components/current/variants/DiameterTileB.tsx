import { useState } from 'react'
import { diameters } from '../../../data'
import { DeltaChipPct } from '../../common'

/**
 * Variant B — production YoY diameter histogram, зеркало PriceTileD.
 *
 * Почему как PriceTileD, а не editorial ruler оригинала:
 *   Это та же сущность — 1D распределение по упорядоченной оси с YoY-сравнением.
 *   Единый язык для всех histogram-плиток в отчёте (price + diameter),
 *   никаких новых визуальных типов. Меньше шума → «дорогой smart».
 *
 * Данные:
 *   Оставляем 11 корзин 34–44 mm (≈91% всех novelties). Хвосты 28–32
 *   (женские) и 45–50 (мега-инструменты) статистически шумные и не
 *   добавляют к истории «smaller is settling in». Ровно 11 баров —
 *   тот же tempo, что у price ranges, для визуального rhymthm.
 *
 * Техника (идентична PriceTileD):
 *   — 2026 bar с distance-based fill: peak gold, neighbours ink/75, rest ink/30.
 *   — Gold hairline 1.5px от 0 до 2025 по центру бара ПОВЕРХ.
 *   — 2025 dot с ring-обводкой.
 *   — На peak-баре (gold) маркеры инвертируются в ink/60.
 *   — Tooltip «бегущий» single-overlay, якорится на max(bar,dot).
 *   — Цветные YoY pct-чипы под x-axis labels.
 *
 * Story 2025→2026: peak был на 41 mm, уехал на 39 mm. «Smaller is
 * settling in»: 34–39 растут, 40–44 сдулись. Placeholder, см. COUNTS_2025.
 */

// 11 bins: 34-44 mm. Trim extremes (28-32 ladies, 45+ sport edge).
// 2026 counts from data.ts `diameters`, отфильтрованные по mm.
const BINS_MM = [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44]

// Placeholder 2025 counts, aligned with BINS_MM.
// Story: peak 2025 was at 41 mm, now shifted to 39 mm. 34–39 grew, 40–44 declined.
const COUNTS_2025 = [5, 6, 50, 10, 22, 52, 60, 65, 48, 12, 28]

export default function DiameterTileB() {
  // 2026 counts — из data.ts, только BINS_MM.
  const counts26 = BINS_MM.map((mm) => diameters.find((d) => d.mm === mm)?.count ?? 0)
  const counts25 = COUNTS_2025
  const max = Math.max(...counts25, ...counts26)
  const peakIdx = counts26.indexOf(Math.max(...counts26))

  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const shownIdx = hoveredIdx ?? peakIdx
  const shownCount = counts26[shownIdx]

  const shownTopPct =
    (Math.max(counts26[shownIdx], counts25[shownIdx]) / max) * 100

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

      <div className="relative mt-6 h-[200px]">
        {/* Floating tooltip */}
        <div
          className="pointer-events-none absolute -translate-x-1/2 transition-all duration-200 ease-out"
          style={{
            left: `${(shownIdx + 0.5) * (100 / BINS_MM.length)}%`,
            bottom: `calc(${shownTopPct}% + 14px)`,
          }}
        >
          <div className="relative rounded-sm bg-ink-deep px-2.5 py-1">
            <span className="num text-[14px] font-medium tabular-nums text-paper">
              {shownCount}
            </span>
            <span
              aria-hidden
              className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 bg-ink-deep"
            />
          </div>
        </div>

        {/* Bars */}
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
              <div
                key={i}
                className="relative h-full flex-1"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
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

      {/* X-axis labels — mm значение */}
      <div className="mt-3 flex gap-2">
        {BINS_MM.map((mm, i) => (
          <div
            key={mm}
            className={`flex-1 text-center text-[11px] tabular-nums transition-colors ${
              i === shownIdx ? 'font-semibold text-gold' : 'text-mute-3'
            }`}
          >
            {mm} mm
          </div>
        ))}
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
