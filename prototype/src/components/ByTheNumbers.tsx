import { caseMaterials, functions, strapTypes, caseHeights, movements, editions, type Ranked } from '../data'
import { Eyebrow } from './common'

function SplitBar({ items }: { items: Ranked[] }) {
  const total = items.reduce((a, b) => a + b.count, 0)
  const top3 = items.slice(0, 3)
  const rest = items.slice(3)
  const restSum = rest.reduce((a, b) => a + b.count, 0)
  const shades = ['bg-ink-deep', 'bg-ink', 'bg-gold']
  return (
    <div>
      <div className="flex h-2 w-full overflow-hidden rounded-full bg-ink/5">
        {top3.map((r, i) => (
          <div key={r.name} className={shades[i]} style={{ width: `${(r.count / total) * 100}%` }} />
        ))}
        {restSum > 0 && (
          <div className="bg-ink/15" style={{ width: `${(restSum / total) * 100}%` }} />
        )}
      </div>
    </div>
  )
}

function FacetCard({
  kicker,
  title,
  items,
  totalLabel,
  accent,
}: {
  kicker: string
  title: string
  items: Ranked[]
  totalLabel: string
  accent?: string
}) {
  const total = items.reduce((a, b) => a + b.count, 0)
  const top3 = items.slice(0, 3)
  return (
    <article className="rounded-sm border border-ink/10 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <Eyebrow>{kicker}</Eyebrow>
          <h4 className="mt-1 font-sans text-[20px] leading-tight text-ink">{title}</h4>
        </div>
        <div className="text-right">
          <div className="num font-sans text-[18px] leading-none text-ink">{total}</div>
          <span className="text-[10px] uppercase tracking-eyebrow text-mute-3">{totalLabel}</span>
        </div>
      </div>
      <div className="mt-4">
        <SplitBar items={items} />
      </div>
      <ul className="mt-4 space-y-2">
        {top3.map((r, i) => (
          <li key={r.name} className="grid grid-cols-[14px_1fr_auto_auto] items-center gap-2 text-[12px]">
            <span className={`h-2 w-2 rounded-full ${['bg-ink-deep', 'bg-ink', 'bg-gold'][i]}`} />
            <span className="truncate text-ink">{r.name}</span>
            <span className="num tabular-nums text-ink">{r.count}</span>
            <span className="num w-9 text-right text-[11px] text-mute-3">
              {Math.round((r.count / total) * 100)}%
            </span>
          </li>
        ))}
      </ul>
      {items.length > 3 && (
        <div className="mt-3 border-t border-ink/5 pt-2 text-[10px] uppercase tracking-eyebrow text-mute-3">
          +{items.length - 3} more {accent ? `· ${accent}` : ''}
        </div>
      )}
    </article>
  )
}

export default function ByTheNumbers() {
  return (
    <section className="mx-auto max-w-[1440px] px-8 py-12">
      <div className="mb-6 flex items-end justify-between border-b border-ink/10 pb-4">
        <div>
          <Eyebrow>By the numbers</Eyebrow>
          <h3 className="mt-2 font-sans text-[28px] leading-tight text-ink">
            Anatomy of a 2026 novelty
          </h3>
        </div>
        <span className="hidden font-sans text-[11px] uppercase tracking-eyebrow text-mute-3 md:inline">
          Leading values · remaining share collapsed
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <FacetCard
          kicker="Material"
          title="Case material"
          items={caseMaterials}
          totalLabel="cases"
          accent="19 materials total"
        />
        <FacetCard
          kicker="Complication"
          title="Functions"
          items={functions}
          totalLabel="mentions"
          accent="23 functions total"
        />
        <FacetCard
          kicker="Strap"
          title="Strap type"
          items={strapTypes}
          totalLabel="straps"
          accent="18 types total"
        />
        <FacetCard
          kicker="Profile"
          title="Case height"
          items={caseHeights}
          totalLabel="novelties"
          accent="18 heights"
        />
        <FacetCard
          kicker="Movement"
          title="Movement type"
          items={movements}
          totalLabel="novelties"
        />
        <FacetCard
          kicker="Release"
          title="Special editions"
          items={editions}
          totalLabel="in category"
        />
      </div>
    </section>
  )
}
