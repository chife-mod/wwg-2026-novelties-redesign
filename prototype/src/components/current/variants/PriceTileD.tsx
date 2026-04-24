import { useState } from 'react'
import { prices } from '../../../data'

/**
 * Variant D — production YoY price-range histogram.
 *
 * Выбранная техника (см. PriceTileC exploration card):
 *   — 2026 bar с ранжированным fill по расстоянию от peak:
 *       peak          → bg-gold
 *       dist ≤ 2      → bg-ink/75
 *       остальные     → bg-ink/30
 *     (восстановлено из оригинального Variant A, теряется при сплошном ink).
 *   — Gold hairline (1.5px) по центру бара ОТ ТОЧКИ 2025 ДО НУЛЯ, ПОВЕРХ бара.
 *     «Призрачный столбик 2025» всегда виден полностью — и на decline
 *     (торчит над баром в бумагу), и на growth (проходит через бар до
 *     точки 2025 внутри него). Раньше линия жила за баром и на peak
 *     полностью прятала себя: 2026 ≥ 2025 → бар перекрывал линию. Теперь
 *     dot всегда сидит на макушке видимой линии, YoY-связь однозначна.
 *   — Gold dot на уровне 2025 с белой ring-обводкой для читаемости.
 *     На peak-баре (gold fill) YoY-маркеры инвертируются в ink/60 —
 *     полупрозрачный ink (~#6F6E6B на белом, между mute-3 и ink).
 *     Белый пропадёт на decline-хвосте, ink/ink-deep слишком жестят,
 *     mute-3 малоконтрастен — ink/60 ровно в сладкой точке.
 *
 * Tooltip (count) — «бегущий» single-overlay:
 *   Прилипает к макушке того, что выше у текущего бакета — самому бару
 *   или 2025-точке (чтобы не висеть в воздухе над низким баром с высокой
 *   точкой). По дефолту висит над peak, на hover — переезжает к hovered
 *   бакету с плавным transition по left + bottom. На leave — возвращается.
 *
 * YoY дельты (%):
 *   Цветные pill-чипы под x-axis (как в brands/collections). Один ряд
 *   между баrom и label'ом бакета, flex-1 на каждую колонку, по центру.
 *   Те же цвета: success/15 для роста, error/15 для падения, ink/5 для flat.
 *   Очень компактные (text-[10px], px-1) — мест в 11 колонках мало.
 *
 * Стиль header'а — как в BrandsTileD / CollectionsTileB: gold uppercase
 * заголовок, no kicker, no insight block. Легенда справа:
 *   2025 — gold кружок (точка-маркер)
 *   2026 — ink квадратик (тело бара)
 *
 * Данные 2025 — правдоподобные плейсхолдеры: peak был на $5-10K, сдвинулся
 * на $10-25K в 2026. Story: рынок перешёл в mid-luxury.
 */

// Placeholder 2025 counts — 11 buckets aligned with prices[] order.
const COUNTS_2025 = [5, 18, 45, 92, 87, 55, 35, 22, 11, 6, 3]

/**
 * Pct-чип для оси. Типографика совпадает с common.DeltaChip
 * (brands/collections): text-[11px], font-medium, min-w-[42px],
 * px-1.5 py-0.5. Отличается только `%`-суффиксом — здесь YoY
 * проценты, там абсолютные штуки. Раньше был ужат до 10px/min-34
 * «чтоб влезть в узкую колонку» — ломало общий typographic rhythm
 * дашборда. Колонка вмещает 42px, если данные 2-значные.
 */
function DeltaChipPct({ pct }: { pct: number }) {
  const up = pct > 0
  const flat = pct === 0
  const sign = up ? '+' : flat ? '±' : ''
  const bg = up
    ? 'bg-success/15 text-success'
    : flat
    ? 'bg-ink/5 text-mute-3'
    : 'bg-error/15 text-error'
  return (
    <span
      className={`num inline-flex min-w-[42px] justify-center rounded-sm px-1.5 py-0.5 text-[11px] font-medium tabular-nums ${bg}`}
    >
      {sign}
      {pct}%
    </span>
  )
}

export default function PriceTileD() {
  const counts26 = prices.map((p) => p.count)
  const counts25 = COUNTS_2025
  const max = Math.max(...counts25, ...counts26)
  const peakIdx = counts26.indexOf(Math.max(...counts26))

  // «Бегущий» tooltip: null → показывается на peak, число → на этом баре
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null)
  const shownIdx = hoveredIdx ?? peakIdx
  const shownCount = counts26[shownIdx]

  // Высота макушки текущего бакета (max из бара/точки), в процентах от max.
  // Тултип садится ровно на неё + небольшой gap → не висит в воздухе.
  const shownTopPct =
    (Math.max(counts26[shownIdx], counts25[shownIdx]) / max) * 100

  // Precomputed YoY % для каждого бакета.
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

      {/*
        Chart area.
        Высота 200px, bars занимают всю высоту. Тултип сидит абсолютно,
        якорится через bottom: shownTopPct + gap (overflow visible, tooltip
        свободно торчит выше контейнера в зазор под header — там mt-6 + mt-4).
      */}
      <div className="relative mt-6 h-[200px]">
        {/* Floating tooltip — transitions left+bottom+content together. */}
        <div
          className="pointer-events-none absolute -translate-x-1/2 transition-all duration-200 ease-out"
          style={{
            left: `${(shownIdx + 0.5) * (100 / prices.length)}%`,
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

        {/* Bars row — fills full chart area */}
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
            // На peak-баре (gold fill) gold YoY-маркеры растворяются.
            // Инвертируем в ink/60 — полупрозрачный ink, на белом даёт
            // ~#6F6E6B (между mute-3 #7B7B7A и ink #3A3935), на золоте
            // тонко темнит фон без чёрной иголки. Белый пропадёт на
            // decline-хвосте, ink-deep/ink слишком жестят — ink/60
            // читается везде и не кричит.
            const lineClass = isPeak ? 'bg-ink/60' : 'bg-gold'
            const dotClass = isPeak ? 'bg-ink/60' : 'bg-gold'
            return (
              <div
                key={i}
                className="relative h-full flex-1"
                onMouseEnter={() => setHoveredIdx(i)}
                onMouseLeave={() => setHoveredIdx(null)}
              >
                {/* 1) 2026 solid bar — основа */}
                <div
                  className={`absolute bottom-0 left-0 right-0 rounded-t-[3px] ${barShade}`}
                  style={{ height: `${h26}%` }}
                />
                {/* 2) Hairline (0 → 2025) — ПОВЕРХ бара, видна всегда */}
                <div
                  className={`absolute left-1/2 w-[1.5px] -translate-x-1/2 ${lineClass}`}
                  style={{ bottom: 0, height: `${h25}%` }}
                />
                {/* 3) 2025 dot — поверх всего */}
                <div
                  className={`absolute left-1/2 h-[7px] w-[7px] -translate-x-1/2 translate-y-1/2 rounded-full ring-2 ring-white ${dotClass}`}
                  style={{ bottom: `${h25}%` }}
                />
              </div>
            )
          })}
        </div>

        {/* Baseline */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-ink/10" />
      </div>

      {/* X-axis labels — цена бакета сразу под baseline */}
      <div className="mt-3 flex gap-2">
        {prices.map((p, i) => (
          <div
            key={i}
            className={`flex-1 text-center text-[11px] tabular-nums transition-colors ${
              i === shownIdx ? 'font-semibold text-gold' : 'text-mute-3'
            }`}
          >
            {p.short}
          </div>
        ))}
      </div>

      {/* YoY delta chips — цветные pills под label'ами, как в brands/collections */}
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
