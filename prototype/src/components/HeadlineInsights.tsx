import { insights } from '../data'
import { Eyebrow } from './common'

export default function HeadlineInsights() {
  return (
    <section className="mx-auto max-w-[1440px] px-8 py-14">
      <div className="mb-8 flex items-baseline justify-between">
        <div>
          <Eyebrow>What stands out</Eyebrow>
          <h2 className="mt-2 font-sans text-[30px] leading-tight text-ink">
            Five headlines of the fair
          </h2>
        </div>
        <span className="hidden font-sans text-[11px] uppercase tracking-eyebrow text-mute-3 md:inline">
          Observed across 478 novelties
        </span>
      </div>

      <div className="grid grid-cols-1 gap-0 divide-y divide-ink/10 border-y border-ink/10 md:grid-cols-5 md:divide-x md:divide-y-0">
        {insights.map((it, i) => (
          <article
            key={it.headline}
            className="group flex flex-col gap-4 p-6 transition-colors hover:bg-white"
          >
            <div className="flex items-center justify-between">
              <span className="num font-sans text-[12px] text-mute-3">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="h-px flex-1 ml-3 bg-ink/10" />
            </div>
            <div>
              <div className="num font-sans text-[44px] leading-none text-ink">{it.big}</div>
              <div className="mt-1 text-[11px] uppercase tracking-eyebrow text-gold">
                {it.unit}
              </div>
            </div>
            <div className="mt-auto">
              <h3 className="font-sans text-[18px] leading-snug text-ink">{it.headline}</h3>
              <p className="mt-2 text-[12px] leading-relaxed text-mute-3">{it.sub}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
