import { prices, TOTAL_NOVELTIES } from '../../../data'

/**
 * Price — Variant B — «clean editorial».
 * Отличия от Variant A (original PriceTile из V2RightGrid):
 *   - убрали kicker «PRICE» — заголовок сам всё говорит;
 *   - убрали правый инсайт-блок (total + totalLabel) — считаем, что
 *     35% над пиком прочитывается из самого бара;
 *   - убрали нижнее подчёркивание border-t у тройной сводки Below/Peak/Above
 *     — карточка должна дышать как контент, а не как ячейка таблицы;
 *   - отступы/тень/бордер приведены к каноничной плитке BrandsTileA:
 *     p-6, rounded-sm, shadow-[0_20px_40px_rgba(0,0,0,0.22)];
 *   - типографика тайтла — как в BrandsTileA: 18px bold, sentence-case,
 *     чтобы плитка читалась как редакционный блок.
 *
 * Графика бара, peak-тултип и x-axis labels — без изменений: сам чарт
 * работает, менять его смысла нет.
 */
export default function PriceTileB() {
  const max = Math.max(...prices.map((p) => p.count))
  const leadIdx = prices.findIndex((p) => p.count === max)
  const lead = prices[leadIdx]
  const sweetShare = Math.round((lead.count / TOTAL_NOVELTIES) * 100)
  const below = prices.slice(0, leadIdx).reduce((a, b) => a + b.count, 0)
  const above = prices.slice(leadIdx + 1).reduce((a, b) => a + b.count, 0)

  return (
    <article className="rounded-sm border border-ink/5 bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.22)]">
      <h3 className="text-[18px] font-bold leading-[1.3] tracking-[-0.005em] text-ink">
        Price ranges
      </h3>

      {/* bars */}
      <div className="relative mt-[30px] h-52 pt-10">
        <div
          className="absolute top-0 -translate-x-1/2"
          style={{ left: `${(leadIdx + 0.5) * (100 / prices.length)}%` }}
        >
          <div className="relative rounded-sm bg-ink-deep px-2.5 py-1">
            <span className="num text-[13px] font-medium tabular-nums text-paper">{lead.count}</span>
            <span
              className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 bg-ink-deep"
            />
          </div>
        </div>
        <div className="flex h-full gap-1.5">
          {prices.map((p, i) => {
            const h = (p.count / max) * 100
            const isPeak = i === leadIdx
            const distance = Math.abs(i - leadIdx)
            const shade = isPeak
              ? 'bg-gold'
              : distance <= 2
                ? 'bg-ink/75'
                : 'bg-ink/30'
            return (
              <div key={p.short} className="group flex h-full flex-1 flex-col justify-end">
                <div
                  className={`w-full rounded-t-[2px] transition-all ${shade} ${!isPeak ? 'group-hover:bg-ink' : ''}`}
                  style={{ height: `${Math.max(h, 4)}%` }}
                />
              </div>
            )
          })}
        </div>
        <div className="absolute inset-x-0 bottom-0 h-px bg-ink/10" />
      </div>

      {/* x-axis */}
      <div className="mt-3 flex gap-1.5 text-[10px] uppercase tracking-eyebrow text-mute-3">
        {prices.map((p, i) => (
          <span key={p.short} className={`flex-1 text-center ${i === leadIdx ? 'font-semibold text-gold' : ''}`}>
            {p.short}
          </span>
        ))}
      </div>

      {/* summary — NO top border */}
      <div className="mt-5 grid grid-cols-3 gap-4 pt-4">
        <div>
          <div className="text-[10px] uppercase tracking-eyebrow text-mute-3">Below peak</div>
          <div className="num mt-1 text-[22px] font-light leading-none text-ink">{below}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-eyebrow text-mute-3">Peak tier · {sweetShare}%</div>
          <div className="num mt-1 text-[22px] font-light leading-none text-gold">{lead.count}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-eyebrow text-mute-3">Above peak</div>
          <div className="num mt-1 text-[22px] font-light leading-none text-ink">{above}</div>
        </div>
      </div>
    </article>
  )
}
