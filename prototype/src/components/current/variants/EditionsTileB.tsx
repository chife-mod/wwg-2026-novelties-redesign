import { editions } from '../../../data'

/**
 * Variant B — это A, но причёсанный под общий стиль плиток:
 *   — Убрали правый «124 / 26% OF FAIR» (editorial-двойная метрика из A
 *     визуально тянет фокус от трёх карточек).
 *   — Заголовок переведён в стандартный gold-h3 (как все остальные тайлы),
 *     без double-label «EDITIONS / Limited and milestone».
 *   — Три карточки — как в A: большое число, eyebrow-имя, proportional bar.
 *     Лидер (Limited) — gold-акцент, остальные ink.
 *
 * Цель: сделать Editions консистентным с Movement/Dials/Materials/… без
 * смены приёма. Если не хватит «вау» — C ударит крупными плитами.
 */

export default function EditionsTileB() {
  return (
    <article className="rounded-sm border border-ink/5 bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.22)]">
      <h3 className="text-[16px] font-bold uppercase leading-[1.3] tracking-[0.01em] text-gold">
        Special editions
      </h3>

      <div className="mt-6 grid grid-cols-3 gap-4">
        {editions.map((e, i) => (
          <div
            key={e.name}
            className={`rounded-sm border p-5 ${
              i === 0 ? 'border-gold/60 bg-gold/5' : 'border-ink/10 bg-ink/[0.02]'
            }`}
          >
            <div className="num text-[44px] font-light leading-none text-ink">{e.count}</div>
            <div className="mt-3 text-[12px] uppercase tracking-eyebrow text-mute-3">
              {e.name.replace(' Edition', '')}
            </div>
            <div className="mt-4 h-[6px] w-full overflow-hidden rounded-full bg-ink/5">
              <div
                className={`h-full rounded-full ${i === 0 ? 'bg-gold' : 'bg-ink'}`}
                style={{ width: `${(e.count / editions[0].count) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </article>
  )
}
