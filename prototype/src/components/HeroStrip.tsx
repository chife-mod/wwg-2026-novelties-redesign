import { TOTAL_NOVELTIES, TOTAL_BRANDS, TOTAL_COLLECTIONS, prices, dialColors } from '../data'

function StatTile({ label, value, footnote }: { label: string; value: string; footnote?: string }) {
  return (
    <div className="flex min-w-0 flex-1 flex-col justify-between border-r border-white/10 px-6 py-5 last:border-r-0">
      <div className="font-sans text-[10px] font-medium uppercase tracking-eyebrow text-gold-light/80">{label}</div>
      <div className="num mt-4 font-sans text-[48px] leading-none text-paper">{value}</div>
      {footnote && <div className="mt-2 text-[11px] text-mute-2">{footnote}</div>}
    </div>
  )
}

function MiniDistribution() {
  const max = Math.max(...prices.map((p) => p.count))
  const leadIdx = prices.findIndex((p) => p.count === max)
  return (
    <div className="flex h-16 items-end gap-[3px]">
      {prices.map((p, i) => {
        const h = (p.count / max) * 100
        const isLead = i === leadIdx
        return (
          <div key={p.short} className="flex flex-col items-center gap-1">
            <div
              className={`w-2 rounded-sm ${isLead ? 'bg-gold-light' : 'bg-mute-2/30'}`}
              style={{ height: `${Math.max(h, 6)}%` }}
            />
          </div>
        )
      })}
    </div>
  )
}

export default function HeroStrip() {
  const topDial = dialColors[0]
  const subFiftyShare = Math.round(
    ((prices.slice(0, 6).reduce((a, b) => a + b.count, 0)) / TOTAL_NOVELTIES) * 100,
  )
  return (
    <section className="bg-ink-deep text-paper">
      <div className="mx-auto max-w-[1440px] px-8 pb-10 pt-14">
        {/* eyebrow + title */}
        <div className="flex items-start justify-between gap-12 border-b border-white/10 pb-10">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-4">
              <span className="font-sans text-[11px] font-medium uppercase tracking-eyebrow text-gold">
                Fair Report · April 2026
              </span>
              <span className="h-px w-10 bg-gold/40" />
              <span className="font-sans text-[11px] uppercase tracking-eyebrow text-mute-2">
                Watches &amp; Wonders Geneva
              </span>
            </div>
            <h1 className="font-sans text-[72px] leading-[0.98] text-paper">
              The Novelties
              <br />
              <span className="text-gold-light">of 2026</span>
            </h1>
            <p className="mt-6 max-w-md text-[13px] leading-relaxed text-mute-2">
              A one-glance portrait of what the industry brought to Geneva this year — leading
              maisons, signature dimensions, dominant aesthetics and the market segments that
              defined the release.
            </p>
          </div>
          <div className="shrink-0 self-end rounded-sm border border-white/10 p-5">
            <div className="mb-2 font-sans text-[10px] uppercase tracking-eyebrow text-mute-2">
              Release by price tier
            </div>
            <MiniDistribution />
            <div className="mt-2 flex justify-between text-[10px] text-mute-3">
              <span>&lt;$1K</span>
              <span className="text-gold-light">$10–25K peak</span>
              <span>&gt;$1M</span>
            </div>
          </div>
        </div>
        {/* stat row */}
        <div className="flex items-stretch">
          <StatTile label="Novelties" value={String(TOTAL_NOVELTIES)} footnote="across the fair" />
          <StatTile label="Brands" value={String(TOTAL_BRANDS)} footnote="on show" />
          <StatTile label="Collections" value={String(TOTAL_COLLECTIONS)} footnote="represented" />
          <StatTile label="Leading dial" value={topDial.name} footnote={`${topDial.count} novelties`} />
          <StatTile label="Sub $50K" value={`${subFiftyShare}%`} footnote="of the release" />
        </div>
      </div>
    </section>
  )
}
