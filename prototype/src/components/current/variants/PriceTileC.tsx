/**
 * Variant C — демо-карточка для выбора YoY-техники.
 *
 * Живёт в Sandbox'е, НЕ на морде — это research card, а не настоящий
 * прайс-тайл. После выбора приёма собираем из победителя полноценный
 * 11-bucket гистограмм и кладём его в production.
 *
 * Техники (A ghost выкинут — для growth-кейса 2026 полностью перекрывал
 * 2025, делая приём немым. Dot и hairline показывают обе стороны честно):
 *
 *   B. Gold hairline — 2026 solid ink, 2025 = тонкая gold-насечка (1.5px)
 *      на уровне прошлогодней высоты. Для падения — gold контур вокруг
 *      «потерянной» территории (от 2026-top до 2025-top). Самая тихая,
 *      самая премиальная.
 *
 *   C. Dot marker — 2026 solid bar, 2025 = маленький gold-кружок на
 *      уровне прошлогодней высоты (с белой обводкой для читаемости поверх
 *      бара). Если упали — тонкий gold connector от top бара до точки.
 *      FT/Economist-вайб. Чётче магнитуды чем B.
 *
 *   D. Paired — 2025 и 2026 бок-о-бок двумя тонкими барами. 2025 со
 *      штриховкой (diagonal pattern) чтобы прошлое читалось фактурно,
 *      не только цветом. Магнитуды сравнивать проще всего, но визуально
 *      тяжелее — два объекта вместо одного.
 *
 * Дельты унифицированы с brands/collections — цветные pill-чипы.
 */

// Two demo points: growth (+17%) and decline (−28%).
const UP = { v25: 87, v26: 102 }
const DOWN = { v25: 92, v26: 66 }
const MAX = Math.max(UP.v25, UP.v26, DOWN.v25, DOWN.v26)

const PCT_UP = Math.round(((UP.v26 - UP.v25) / UP.v25) * 100)
const PCT_DOWN = Math.round(((DOWN.v26 - DOWN.v25) / DOWN.v25) * 100)

/**
 * Percent delta chip, same visual language as common.DeltaChip, но с `%`-суффиксом.
 * Локальный — в common.tsx общий DeltaChip показывает абсолютные числа
 * (штуки часов), а здесь нужен процент (year-over-year).
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

export default function PriceTileC() {
  return (
    <article className="rounded-sm border border-ink/5 bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.22)]">
      <header className="flex items-start justify-between">
        <h3 className="text-[16px] font-bold uppercase leading-[1.3] tracking-[0.01em] text-gold">
          YoY techniques · pick one
        </h3>
        <div className="flex items-center gap-5 text-[11px] font-semibold uppercase tracking-eyebrow text-mute-3">
          <span className="flex items-center gap-2">
            <span className="h-[1.5px] w-4 bg-gold" />
            2025
          </span>
          <span className="flex items-center gap-2">
            <span className="h-3 w-[6px] bg-ink" />
            2026
          </span>
        </div>
      </header>

      <div className="mt-8 grid grid-cols-3 gap-8">
        <Demo title="B · Gold hairline" technique="hairline" />
        <Demo title="C · Dot marker"    technique="dot" />
        <Demo title="D · Paired bars"   technique="paired" />
      </div>
    </article>
  )
}

function Demo({
  title,
  technique,
}: {
  title: string
  technique: 'hairline' | 'dot' | 'paired'
}) {
  return (
    <div>
      <div className="mb-4 text-[11px] font-semibold uppercase tracking-eyebrow text-ink">
        {title}
      </div>

      <div className="flex h-[200px] items-end justify-around">
        <Bar v25={UP.v25} v26={UP.v26} max={MAX} technique={technique} />
        <Bar v25={DOWN.v25} v26={DOWN.v26} max={MAX} technique={technique} />
      </div>

      <div className="mt-3 flex justify-around">
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[11px] tabular-nums text-ink">87 → 102</span>
          <DeltaChipPct pct={PCT_UP} />
        </div>
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[11px] tabular-nums text-ink">92 → 66</span>
          <DeltaChipPct pct={PCT_DOWN} />
        </div>
      </div>
    </div>
  )
}

function Bar({
  v25,
  v26,
  max,
  technique,
}: {
  v25: number
  v26: number
  max: number
  technique: 'hairline' | 'dot' | 'paired'
}) {
  const h25 = (v25 / max) * 100
  const h26 = (v26 / max) * 100
  const declined = v25 > v26

  if (technique === 'paired') {
    return (
      <div className="flex h-full items-end gap-1">
        {/* 2025 — striped */}
        <div
          className="w-10 rounded-t-[3px]"
          style={{
            height: `${h25}%`,
            backgroundColor: 'rgba(58, 57, 53, 0.15)',
            backgroundImage:
              'repeating-linear-gradient(45deg, rgba(58, 57, 53, 0.5) 0 1.5px, transparent 1.5px 5px)',
          }}
        />
        {/* 2026 — solid */}
        <div
          className="w-10 rounded-t-[3px] bg-ink"
          style={{ height: `${h26}%` }}
        />
      </div>
    )
  }

  return (
    <div className="relative h-full w-20">
      <div
        className="absolute bottom-0 left-0 right-0 rounded-t-[3px] bg-ink"
        style={{ height: `${h26}%` }}
      />

      {technique === 'hairline' && (
        <>
          <div
            className="absolute left-0 right-0 h-[1.5px] bg-gold"
            style={{ bottom: `calc(${h25}% - 0.75px)` }}
          />
          {declined && (
            <div
              className="absolute left-0 right-0 border-x border-t border-gold/35"
              style={{ bottom: `${h26}%`, height: `${h25 - h26}%` }}
            />
          )}
        </>
      )}

      {technique === 'dot' && (
        <>
          {declined && (
            <div
              className="absolute left-1/2 w-px -translate-x-1/2 bg-gold/40"
              style={{ bottom: `${h26}%`, height: `${h25 - h26}%` }}
            />
          )}
          <div
            className="absolute left-1/2 h-[6px] w-[6px] -translate-x-1/2 translate-y-1/2 rounded-full bg-gold ring-2 ring-white"
            style={{ bottom: `${h25}%` }}
          />
        </>
      )}
    </div>
  )
}
