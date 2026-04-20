import { diameters } from '../data'
import { Eyebrow } from './common'

export default function DiameterRuler() {
  const max = Math.max(...diameters.map((d) => d.count))
  const leadIdx = diameters.findIndex((d) => d.count === max)
  const lead = diameters[leadIdx]
  const total = diameters.reduce((a, b) => a + b.count, 0)
  const under41 = diameters.filter((d) => d.mm < 41).reduce((a, b) => a + b.count, 0)
  const under41Pct = Math.round((under41 / total) * 100)

  return (
    <section className="mx-auto max-w-[1440px] px-8 py-10">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <Eyebrow>Case dimensions</Eyebrow>
          <h3 className="mt-2 font-sans text-[28px] leading-tight text-ink">
            The wrist settles at thirty-nine
          </h3>
          <p className="mt-2 max-w-xl text-[13px] text-mute-3">
            Distribution of case diameters from 28 mm to 50 mm — read as a ruler. The fair has retreated
            from the oversize trend of the late 2010s: {under41Pct}% of novelties sit under 41 mm.
          </p>
        </div>
        <div className="text-right">
          <div className="num font-sans text-[28px] leading-none text-ink">{lead.mm} mm</div>
          <Eyebrow className="text-mute-3">peak · {lead.count} pcs</Eyebrow>
        </div>
      </div>

      <div className="rounded-sm border border-ink/10 bg-white p-6">
        <div className="flex items-end gap-1" style={{ height: 160 }}>
          {diameters.map((d, i) => {
            const h = (d.count / max) * 100
            const isLead = i === leadIdx
            const isDistinctSize = d.mm % 2 === 0
            return (
              <div
                key={d.mm}
                className="group flex flex-1 flex-col items-center gap-1"
                title={`${d.mm} mm · ${d.count} novelties`}
              >
                <span className={`num mb-1 text-[10px] ${isLead ? 'text-gold' : 'text-mute-3 opacity-0 group-hover:opacity-100'}`}>
                  {d.count}
                </span>
                <div
                  className={`w-full rounded-sm transition-colors ${
                    isLead ? 'bg-gold' : 'bg-ink/70 group-hover:bg-ink'
                  }`}
                  style={{ height: `${Math.max(h, 3)}%` }}
                />
                <span
                  className={`num mt-1 text-[10px] ${
                    isLead ? 'font-medium text-ink' : isDistinctSize ? 'text-mute-3' : 'text-mute-3/50'
                  }`}
                >
                  {d.mm}
                </span>
              </div>
            )
          })}
        </div>
        <div className="mt-4 grid grid-cols-4 gap-6 border-t border-ink/10 pt-4 text-[11px]">
          {[
            { label: '< 36 mm', set: diameters.filter((d) => d.mm < 36) },
            { label: '36 – 40 mm', set: diameters.filter((d) => d.mm >= 36 && d.mm <= 40) },
            { label: '41 – 44 mm', set: diameters.filter((d) => d.mm >= 41 && d.mm <= 44) },
            { label: '> 44 mm', set: diameters.filter((d) => d.mm > 44) },
          ].map((bucket) => {
            const cnt = bucket.set.reduce((a, b) => a + b.count, 0)
            const pct = Math.round((cnt / total) * 100)
            return (
              <div key={bucket.label}>
                <Eyebrow className="text-mute-3">{bucket.label}</Eyebrow>
                <div className="mt-1 flex items-baseline gap-2">
                  <span className="num font-sans text-[22px] text-ink">{cnt}</span>
                  <span className="text-mute-3">·</span>
                  <span className="num text-[12px] text-mute-3">{pct}%</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
