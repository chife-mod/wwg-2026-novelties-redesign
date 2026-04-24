import { diameters } from '../../../data'
import { DeltaChipPct } from '../../common'

/**
 * Variant C — B + always-visible 2026 counts над каждым баром.
 *
 * Почему: в B счётчик был только в бегущем tooltip'е. Ключевая цифра —
 * сколько новинок в корзине — не должна требовать hover. Теперь число
 * 2026 сидит прямо над баром: 62, 55, 51, 40, … — читается без
 * взаимодействия.
 *
 * Одновременно убираю floating tooltip: он становится избыточным,
 * а лишний overlay — это тот самый шум, о котором клиент говорил.
 * 2025 не подписываю числом — его позиция передаётся dot'ом, а
 * точная разница читается через delta-чип ниже. Если понадобится
 * точное 2025 — добавим, но пока не хочу зашумлять плитку.
 *
 * Остальное идентично B: те же 11 бинов 34–44 mm, та же distance-based
 * раскраска (peak gold, соседи ink/75, хвосты ink/30), те же gold
 * hairlines + 2025 dots, те же delta-чипы.
 */

const BINS_MM = [34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44]
const COUNTS_2025 = [5, 6, 50, 10, 22, 52, 60, 65, 48, 12, 28]

export default function DiameterTileC() {
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

      {/* Chart area. Высота 200px + небольшой запас сверху (pt-5) под
          всегда-видимые count-лейблы 2026. */}
      <div className="relative mt-6 h-[200px] pt-5">
        <div className="relative flex h-full items-end gap-2">
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
            // Count-лейбл: на peak-баре gold+bold, остальные ink/75 regular.
            // Дистанционный хвост (ink/30) делаем mute-3, чтобы фокус вёл
            // глаз от периферии к центру-пику.
            const countColor = isPeak
              ? 'text-gold font-semibold'
              : distance <= 2
              ? 'text-ink'
              : 'text-mute-3'
            return (
              <div key={i} className="relative h-full flex-1">
                {/* 2026 solid bar */}
                <div
                  className={`absolute bottom-0 left-0 right-0 rounded-t-[3px] ${barShade}`}
                  style={{ height: `${h26}%` }}
                />
                {/* Hairline 0 → 2025 */}
                <div
                  className={`absolute left-1/2 w-[1.5px] -translate-x-1/2 ${lineClass}`}
                  style={{ bottom: 0, height: `${h25}%` }}
                />
                {/* 2025 dot */}
                <div
                  className={`absolute left-1/2 h-[7px] w-[7px] -translate-x-1/2 translate-y-1/2 rounded-full ring-2 ring-white ${dotClass}`}
                  style={{ bottom: `${h25}%` }}
                />
                {/* Always-visible 2026 count над баром. -translate-y выводит
                    лейбл в зазор pt-5 над баром; tabular-nums чтобы цифры
                    не прыгали по ширине. */}
                <div
                  className={`absolute left-1/2 -translate-x-1/2 -translate-y-5 text-[11px] tabular-nums ${countColor}`}
                  style={{ bottom: `${h26}%` }}
                >
                  {v26}
                </div>
              </div>
            )
          })}
        </div>

        <div className="absolute inset-x-0 bottom-0 h-px bg-ink/10" />
      </div>

      {/* X-axis labels — mm */}
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
