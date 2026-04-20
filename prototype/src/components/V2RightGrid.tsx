import {
  brands,
  collections,
  dialColors,
  diameters,
  prices,
  TOTAL_NOVELTIES,
  TOTAL_BRANDS,
  TOTAL_COLLECTIONS,
} from '../data'
import { BrandMonogram, DeltaChip, Eyebrow } from './common'

function WhiteTile({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <article className={`rounded-sm border border-ink/5 bg-white p-5 shadow-[0_20px_40px_rgba(0,0,0,0.18)] ${className}`}>
      {children}
    </article>
  )
}

function GlassTile({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <article
      className={`rounded-sm border border-white/20 bg-white/10 p-5 text-paper backdrop-blur-xl ${className}`}
      style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 24px 60px rgba(0,0,0,0.35)' }}
    >
      {children}
    </article>
  )
}

// ——————————————————————————————————————— white tiles

function BrandsTile() {
  const list = brands.slice(0, 5)
  const max = list[0].count
  return (
    <WhiteTile>
      <div className="flex items-end justify-between border-b border-ink/10 pb-3">
        <div>
          <Eyebrow>Maisons</Eyebrow>
          <h4 className="mt-1 text-[15px] font-semibold text-ink">Top brands at the fair</h4>
        </div>
        <div className="text-right">
          <div className="num text-[22px] font-semibold leading-none text-ink">{TOTAL_BRANDS}</div>
          <Eyebrow className="text-mute-3">total</Eyebrow>
        </div>
      </div>
      <ul className="mt-3 space-y-2">
        {list.map((b, i) => (
          <li key={b.name} className="grid grid-cols-[18px_22px_1fr_auto_44px] items-center gap-2">
            <span className="num text-[10px] tabular-nums text-mute-3">{i + 1}</span>
            <BrandMonogram name={b.name} size={20} />
            <div className="min-w-0">
              <div className="truncate text-[12px] text-ink">{b.name}</div>
              <div className="mt-1 h-[2px] w-full overflow-hidden rounded-full bg-ink/5">
                <div className="h-full rounded-full bg-ink" style={{ width: `${(b.count / max) * 100}%` }} />
              </div>
            </div>
            <span className="num text-[12px] tabular-nums text-ink">{b.count}</span>
            <DeltaChip delta={b.delta} />
          </li>
        ))}
      </ul>
    </WhiteTile>
  )
}

function CollectionsTile() {
  const list = collections.slice(0, 5)
  const max = list[0].count
  return (
    <WhiteTile>
      <div className="flex items-end justify-between border-b border-ink/10 pb-3">
        <div>
          <Eyebrow>Lines</Eyebrow>
          <h4 className="mt-1 text-[15px] font-semibold text-ink">Top collections</h4>
        </div>
        <div className="text-right">
          <div className="num text-[22px] font-semibold leading-none text-ink">{TOTAL_COLLECTIONS}</div>
          <Eyebrow className="text-mute-3">total</Eyebrow>
        </div>
      </div>
      <ul className="mt-3 space-y-2">
        {list.map((c, i) => (
          <li key={c.name} className="grid grid-cols-[18px_1fr_auto_44px] items-center gap-2">
            <span className="num text-[10px] tabular-nums text-mute-3">{i + 1}</span>
            <div className="min-w-0">
              <div className="truncate text-[12px] text-ink">{c.name}</div>
              <div className="mt-1 h-[2px] w-full overflow-hidden rounded-full bg-ink/5">
                <div className="h-full rounded-full bg-ink" style={{ width: `${(c.count / max) * 100}%` }} />
              </div>
            </div>
            <span className="num text-[12px] tabular-nums text-ink">{c.count}</span>
            <DeltaChip delta={c.delta} />
          </li>
        ))}
      </ul>
    </WhiteTile>
  )
}

function PriceTile() {
  const max = Math.max(...prices.map((p) => p.count))
  const leadIdx = prices.findIndex((p) => p.count === max)
  const sweet = prices[leadIdx]
  const sweetShare = Math.round((sweet.count / TOTAL_NOVELTIES) * 100)
  return (
    <WhiteTile>
      <div className="flex items-end justify-between border-b border-ink/10 pb-3">
        <div>
          <Eyebrow>Price tier</Eyebrow>
          <h4 className="mt-1 text-[15px] font-semibold text-ink">The sweet spot</h4>
        </div>
        <div className="text-right">
          <div className="num text-[20px] font-semibold leading-none text-ink">{sweet.short}</div>
          <Eyebrow className="text-mute-3">{sweetShare}% peak</Eyebrow>
        </div>
      </div>
      <div className="mt-4 flex h-20 items-end gap-[3px]">
        {prices.map((p, i) => (
          <div
            key={p.short}
            className="flex flex-1 flex-col items-center"
            title={`${p.label} · ${p.count}`}
          >
            <div
              className={`w-full rounded-sm ${i === leadIdx ? 'bg-gold' : 'bg-ink/70'}`}
              style={{ height: `${Math.max((p.count / max) * 100, 6)}%` }}
            />
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-between text-[9px] uppercase tracking-eyebrow text-mute-3">
        <span>&lt;$1K</span>
        <span className="text-gold">{sweet.short} · {sweet.count}</span>
        <span>&gt;$1M</span>
      </div>
    </WhiteTile>
  )
}

function WristTile() {
  // diameter quick summary
  const total = diameters.reduce((a, b) => a + b.count, 0)
  const max = Math.max(...diameters.map((d) => d.count))
  const peak = diameters.find((d) => d.count === max)!
  const under41 = diameters.filter((d) => d.mm < 41).reduce((a, b) => a + b.count, 0)
  const under41Pct = Math.round((under41 / total) * 100)
  return (
    <WhiteTile>
      <div className="flex items-end justify-between border-b border-ink/10 pb-3">
        <div>
          <Eyebrow>On the wrist</Eyebrow>
          <h4 className="mt-1 text-[15px] font-semibold text-ink">The year of {peak.mm} mm</h4>
        </div>
        <div className="text-right">
          <div className="num text-[22px] font-semibold leading-none text-ink">{peak.mm}<span className="ml-1 text-[11px] text-mute-3">mm</span></div>
          <Eyebrow className="text-mute-3">peak · {peak.count} pcs</Eyebrow>
        </div>
      </div>
      <div className="mt-4 flex h-16 items-end gap-[2px]">
        {diameters.map((d) => {
          const h = (d.count / max) * 100
          const isPeak = d.mm === peak.mm
          return (
            <div
              key={d.mm}
              className="flex flex-1 flex-col items-center"
              title={`${d.mm} mm · ${d.count}`}
            >
              <div
                className={`w-full rounded-sm ${isPeak ? 'bg-gold' : 'bg-ink/70'}`}
                style={{ height: `${Math.max(h, 4)}%` }}
              />
            </div>
          )
        })}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-3 border-t border-ink/5 pt-3 text-[10px]">
        <div>
          <Eyebrow className="text-mute-3">Small</Eyebrow>
          <div className="num mt-0.5 text-[13px] text-ink">
            {diameters.filter((d) => d.mm < 36).reduce((a, b) => a + b.count, 0)}
          </div>
        </div>
        <div>
          <Eyebrow className="text-mute-3">Mid</Eyebrow>
          <div className="num mt-0.5 text-[13px] text-ink">
            {diameters.filter((d) => d.mm >= 36 && d.mm <= 41).reduce((a, b) => a + b.count, 0)}
          </div>
        </div>
        <div>
          <Eyebrow className="text-mute-3">Large</Eyebrow>
          <div className="num mt-0.5 text-[13px] text-ink">
            {diameters.filter((d) => d.mm > 41).reduce((a, b) => a + b.count, 0)}
          </div>
        </div>
      </div>
      <div className="mt-3 text-[10px] uppercase tracking-eyebrow text-mute-3">
        {under41Pct}% of novelties under 41 mm
      </div>
    </WhiteTile>
  )
}

// ——————————————————————————————————————— glass tiles

function FairSummaryTile() {
  return (
    <GlassTile>
      <div className="flex items-center gap-2 text-gold">
        <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold" />
        <span className="text-[9px] font-semibold uppercase tracking-eyebrow">The fair at a glance</span>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div>
          <div className="num text-[48px] font-light leading-none">{TOTAL_NOVELTIES}</div>
          <div className="mt-1 text-[10px] uppercase tracking-eyebrow text-mute-2">novelties</div>
        </div>
        <div>
          <div className="num text-[48px] font-light leading-none">{TOTAL_BRANDS}</div>
          <div className="mt-1 text-[10px] uppercase tracking-eyebrow text-mute-2">brands</div>
        </div>
        <div>
          <div className="num text-[48px] font-light leading-none">{TOTAL_COLLECTIONS}</div>
          <div className="mt-1 text-[10px] uppercase tracking-eyebrow text-mute-2">collections</div>
        </div>
      </div>
      <div className="mt-4 border-t border-white/15 pt-3 text-[10px] uppercase tracking-eyebrow text-mute-2">
        Watches &amp; Wonders Geneva · April 2026
      </div>
    </GlassTile>
  )
}

function ColourTile() {
  const lead = dialColors[0]
  const total = dialColors.reduce((a, b) => a + b.count, 0)
  const share = Math.round((lead.count / total) * 100)
  const second = dialColors[1]
  return (
    <GlassTile className="relative overflow-hidden">
      {/* massive swatch bleed */}
      <div
        className="absolute -right-14 -top-14 h-48 w-48 rounded-full opacity-80 blur-xl"
        style={{ background: lead.hex }}
      />
      <div className="absolute right-4 top-4 h-24 w-24 rounded-full border border-white/30" style={{ background: lead.hex }} />
      <div className="relative">
        <div className="flex items-center gap-2 text-gold">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold" />
          <span className="text-[9px] font-semibold uppercase tracking-eyebrow">Colour of 2026</span>
        </div>
        <div className="mt-5">
          <div className="text-[11px] uppercase tracking-eyebrow text-mute-2">Lead dial</div>
          <div className="mt-1 text-[28px] font-light leading-none">{lead.name}</div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="num text-[40px] font-semibold leading-none text-gold-light">{lead.count}</span>
            <span className="text-[11px] uppercase tracking-eyebrow text-mute-2">dials · {share}%</span>
          </div>
        </div>
        <div className="mt-4 border-t border-white/15 pt-3">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-eyebrow text-mute-2">
            <span>2× volume of {second.name.toLowerCase()}</span>
            <span className="num text-paper">{second.count}</span>
          </div>
        </div>
      </div>
    </GlassTile>
  )
}

export default function V2RightGrid() {
  return (
    <div className="grid h-full grid-cols-2 gap-4">
      {/* Row 1 */}
      <FairSummaryTile />
      <BrandsTile />
      {/* Row 2 */}
      <CollectionsTile />
      <ColourTile />
      {/* Row 3 */}
      <PriceTile />
      <WristTile />
    </div>
  )
}
