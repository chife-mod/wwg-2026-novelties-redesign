import { editions } from '../../../data'

/**
 * Variant C — «большие плиты + легенда снизу», как в референсе пользователя
 * (Customer Distribution: три крупных прямоугольника с диагональной
 * штриховкой, под ними имена и числа).
 *
 * Приём в мире часов: плиты читаются как textile / guilloché sample
 * cards — подходящая ассоциация для Editions. Диагональная штриховка
 * (45°, 6px шаг) чуть «фактурит» заливку, чтобы поверхности не
 * выглядели плоскими и не конкурировали с чистыми барами в других
 * тайлах.
 *
 * Раскладка:
 *   — Ширины плит пропорциональны counts (Limited 89 ≫ Anniversary 24 ≫
 *     Partnership 11) — сохраняется смысл распределения, читается как
 *     разложенный на три плиты stacked bar без склеивания.
 *   — Высота фиксированная (220px) — плита как плита, не гистограмма.
 *   — Цвета: Limited = gold, Anniversary = ink-deep, Partnership = mute.
 *   — Легенда — 14px ink, 10px square chip, dashed separator (как в
 *     Movement/Dials). Без дельт — в data.ts у editions их нет.
 */

// Штриховка — тонкая (3px шаг цикла), низкоконтрастная (соседние тоны
// одной категории). Цель: фактура поверхности, не визуальный шум.
// Stripe-цвет отличается от base на ~8-10% brightness.
const COLOR: Record<string, { base: string; stripe: string }> = {
  'Limited Edition':     { base: '#A98155', stripe: '#B28B5E' }, // gold → чуть светлее
  'Anniversary Edition': { base: '#1E1D19', stripe: '#2A2824' }, // ink-deep → чуть светлее
  'Partnership Edition': { base: '#C6C6C6', stripe: '#D0D0D0' }, // mute → чуть светлее
}

export default function EditionsTileC() {
  const total = editions.reduce((a, b) => a + b.count, 0)

  return (
    <article className="rounded-sm border border-ink/5 bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.22)]">
      <h3 className="text-[16px] font-bold uppercase leading-[1.3] tracking-[0.01em] text-gold">
        Special editions
      </h3>

      {/* Три плиты. gap-2 — узкий зазор, чтобы читались отдельно, но не
          как колонки столбчатой диаграммы (там было бы gap-4+). */}
      <div className="mt-6 flex h-[140px] gap-2">
        {editions.map((e) => {
          const c = COLOR[e.name] ?? { base: '#999', stripe: '#BBB' }
          const pct = (e.count / total) * 100
          return (
            <div
              key={e.name}
              className="rounded-sm"
              style={{
                width: `${pct}%`,
                background: `repeating-linear-gradient(45deg, ${c.base} 0 3px, ${c.stripe} 3px 6px)`,
              }}
              aria-label={`${e.name}: ${e.count}`}
            />
          )
        })}
      </div>

      {/* Легенда — один-в-один как в MovementTileF/E: max-w-[280px],
          центрирована. На широкой col-span-2 плите иначе имя и count
          уезжают к краям и читаются как два несвязанных столбца. */}
      <ul className="mx-auto mt-4 w-full max-w-[280px]">
        {editions.map((e, i) => (
          <li
            key={e.name}
            className={`grid min-h-[32px] grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 py-1.5 ${
              i < editions.length - 1 ? 'border-b border-dashed border-ink/15' : ''
            }`}
          >
            <span
              className="h-[10px] w-[10px] rounded-[2px]"
              style={{ backgroundColor: COLOR[e.name]?.base ?? '#999' }}
              aria-hidden
            />
            <span className="truncate text-[14px] leading-none text-ink">
              {e.name.replace(' Edition', '')}
            </span>
            <span className="num text-[14px] tabular-nums text-ink">{e.count}</span>
          </li>
        ))}
      </ul>
    </article>
  )
}
