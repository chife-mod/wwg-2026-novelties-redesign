import { editions } from '../../../data'

/**
 * Variant D — C со счётчиками внутри плит (top-left).
 *
 * Гипотеза: C читался как «три цветных плиты с неподписанной пропорцией»
 * — быстрый glance требовал похода в легенду. Если ключевая цифра живёт
 * прямо на плите, плитка самодостаточна: видишь 89 на широкой золотой,
 * 24 на узкой ink-deep, 11 на крошечной mute — число + масса плиты
 * рассказывают историю без скроллинга в легенду.
 *
 * Отличия от C:
 *   — Большое число (48px, font-light) выровнено top-left в padding'e
 *     плиты. Цвет контрастен заливке (white на gold/ink, ink на mute).
 *   — В легенде внизу убран count (он теперь на плите). Осталось только
 *     square chip + name — легенда как ключ «какой цвет — какое издание».
 *
 * Штриховка и цвета — без изменений от C (3px шаг, low contrast).
 */

const COLOR: Record<
  string,
  { base: string; stripe: string; fg: string }
> = {
  'Limited Edition':     { base: '#A98155', stripe: '#B28B5E', fg: '#FFFFFF' },
  'Anniversary Edition': { base: '#1E1D19', stripe: '#2A2824', fg: '#FFFFFF' },
  'Partnership Edition': { base: '#C6C6C6', stripe: '#D0D0D0', fg: '#1E1D19' },
}

export default function EditionsTileD() {
  const total = editions.reduce((a, b) => a + b.count, 0)

  return (
    <article className="rounded-sm border border-ink/5 bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.22)]">
      <h3 className="text-[16px] font-bold uppercase leading-[1.3] tracking-[0.01em] text-gold">
        Special editions
      </h3>

      {/* Плиты. Каждая — flex-контейнер с числом top-left в padding'e. */}
      <div className="mt-6 flex h-[140px] gap-2">
        {editions.map((e) => {
          const c = COLOR[e.name] ?? { base: '#999', stripe: '#BBB', fg: '#FFF' }
          const pct = (e.count / total) * 100
          return (
            <div
              key={e.name}
              className="relative overflow-hidden rounded-sm"
              style={{
                width: `${pct}%`,
                minWidth: 96, // floor — чтобы «11» на узкой Partnership всегда имело воздух
                background: `repeating-linear-gradient(45deg, ${c.base} 0 3px, ${c.stripe} 3px 6px)`,
              }}
              aria-label={`${e.name}: ${e.count}`}
            >
              <div
                className="num absolute left-3 top-2 text-[40px] font-light leading-none tabular-nums"
                style={{ color: c.fg }}
              >
                {e.count}
              </div>
            </div>
          )
        })}
      </div>

      {/* Легенда — inline, одна строка, прижата к левому краю. Держит
          ту же вертикаль, что и 89 на первой плите (top-left ритм).
          Три пары «chip + name» с зазором gap-x-12 (~48px). */}
      <ul className="mt-4 flex items-center gap-x-10">
        {editions.map((e) => (
          <li key={e.name} className="flex items-center gap-2">
            <span
              className="h-[10px] w-[10px] rounded-[2px]"
              style={{ backgroundColor: COLOR[e.name]?.base ?? '#999' }}
              aria-hidden
            />
            <span className="text-[14px] leading-none text-ink">
              {e.name.replace(' Edition', '')}
            </span>
          </li>
        ))}
      </ul>
    </article>
  )
}
