import {
  brands,
  collections,
  dialColors,
  diameters,
  prices,
  caseMaterials,
  functions as fns,
  strapTypes,
  caseHeights,
  movements,
  editions,
  TOTAL_NOVELTIES,
  TOTAL_BRANDS,
  TOTAL_COLLECTIONS,
} from '../data'
import { BrandMonogram, DeltaChip } from './common'

// ——————————————————————————————————————— shell

function Tile({
  children,
  className = '',
  kicker,
  title,
  total,
  totalLabel,
}: {
  children: React.ReactNode
  className?: string
  kicker?: string
  title?: string
  total?: string | number
  totalLabel?: string
}) {
  return (
    <article
      className={`rounded-sm border border-ink/5 bg-white p-5 shadow-[0_20px_40px_rgba(0,0,0,0.22)] ${className}`}
    >
      {(kicker || title) && (
        <div className="flex items-end justify-between border-b border-ink/10 pb-4">
          <div>
            {kicker && (
              <div className="text-[11px] font-semibold uppercase tracking-eyebrow text-gold">
                {kicker}
              </div>
            )}
            {title && <h4 className="mt-1.5 text-[18px] font-semibold text-ink">{title}</h4>}
          </div>
          {total !== undefined && (
            <div className="text-right">
              <div className="num text-[28px] font-light leading-none text-ink">{total}</div>
              {totalLabel && (
                <div className="mt-1 text-[10px] uppercase tracking-eyebrow text-mute-3">{totalLabel}</div>
              )}
            </div>
          )}
        </div>
      )}
      <div className="mt-5">{children}</div>
    </article>
  )
}


// ——————————————————————————————————————— row items

function RowBar({
  rank,
  label,
  count,
  delta,
  max,
  swatch,
  monogram,
}: {
  rank: number
  label: string
  count: number
  delta?: number
  max: number
  swatch?: string
  monogram?: string
}) {
  return (
    <li className="grid grid-cols-[18px_auto_1fr_auto_auto] items-center gap-3">
      <span className="num text-[11px] tabular-nums text-mute-3">{String(rank).padStart(2, '0')}</span>
      {monogram ? (
        <BrandMonogram name={monogram} size={26} />
      ) : swatch ? (
        <span
          className="h-4 w-4 rounded-full border border-ink/10"
          style={{ background: swatch }}
        />
      ) : (
        <span />
      )}
      <div className="min-w-0">
        <div className="truncate text-[14px] font-medium text-ink">{label}</div>
        <div className="mt-1.5 h-[6px] w-full overflow-hidden rounded-full bg-ink/5">
          <div className="h-full rounded-full bg-ink" style={{ width: `${(count / max) * 100}%` }} />
        </div>
      </div>
      <span className="num w-10 text-right text-[16px] tabular-nums text-ink">{count}</span>
      {delta !== undefined ? <DeltaChip delta={delta} /> : <span className="w-[42px]" />}
    </li>
  )
}

// ——————————————————————————————————————— tiles

export function BrandsTile() {
  const list = brands.slice(0, 6)
  const max = list[0].count
  return (
    <Tile kicker="Maisons" title="Top brands at the fair" total={TOTAL_BRANDS} totalLabel="on show">
      <ul className="space-y-3.5">
        {list.map((b, i) => (
          <RowBar key={b.name} rank={i + 1} label={b.name} count={b.count} delta={b.delta} max={max} monogram={b.name} />
        ))}
      </ul>
    </Tile>
  )
}

export function CollectionsTile() {
  const list = collections.slice(0, 6)
  const max = list[0].count
  return (
    <Tile kicker="Lines" title="Top collections" total={TOTAL_COLLECTIONS} totalLabel="active">
      <ul className="space-y-3.5">
        {list.map((c, i) => (
          <RowBar key={c.name} rank={i + 1} label={c.name} count={c.count} delta={c.delta} max={max} />
        ))}
      </ul>
    </Tile>
  )
}

export function PriceTile() {
  const max = Math.max(...prices.map((p) => p.count))
  const leadIdx = prices.findIndex((p) => p.count === max)
  const lead = prices[leadIdx]
  const sweetShare = Math.round((lead.count / TOTAL_NOVELTIES) * 100)
  const below = prices.slice(0, leadIdx).reduce((a, b) => a + b.count, 0)
  const above = prices.slice(leadIdx + 1).reduce((a, b) => a + b.count, 0)
  return (
    <Tile kicker="Price" title="Price ranges" total={lead.short} totalLabel={`peak · ${sweetShare}%`}>
      {/* elegant chunky bars */}
      <div className="relative h-52 pt-10">
        {/* peak tooltip */}
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
        {/* bars */}
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
        {/* baseline */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-ink/10" />
      </div>
      {/* x-axis labels */}
      <div className="mt-3 flex gap-1.5 text-[10px] uppercase tracking-eyebrow text-mute-3">
        {prices.map((p, i) => (
          <span key={p.short} className={`flex-1 text-center ${i === leadIdx ? 'font-semibold text-gold' : ''}`}>{p.short}</span>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-3 gap-4 border-t border-ink/5 pt-4">
        <div>
          <div className="text-[10px] uppercase tracking-eyebrow text-mute-3">Below peak</div>
          <div className="num mt-1 text-[22px] font-light leading-none text-ink">{below}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-eyebrow text-mute-3">Peak tier</div>
          <div className="num mt-1 text-[22px] font-light leading-none text-gold">{lead.count}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-eyebrow text-mute-3">Above peak</div>
          <div className="num mt-1 text-[22px] font-light leading-none text-ink">{above}</div>
        </div>
      </div>
    </Tile>
  )
}

export function DialTile() {
  const total = dialColors.reduce((a, b) => a + b.count, 0)
  const lead = dialColors[0]
  const leadShare = Math.round((lead.count / total) * 100)
  return (
    <Tile kicker="Dials" title="Colour of the year" total={lead.name} totalLabel={`${leadShare}% · ${lead.count}`}>
      {/* stacked proportional bar */}
      <div className="flex h-5 w-full overflow-hidden rounded-full border border-ink/5">
        {dialColors.map((d) => (
          <div
            key={d.name}
            style={{ width: `${(d.count / total) * 100}%`, background: d.hex.startsWith('url') ? '#cfcfcf' : d.hex }}
            title={`${d.name} · ${d.count}`}
          />
        ))}
      </div>
      {/* swatch list */}
      <ul className="mt-5 grid grid-cols-2 gap-x-5 gap-y-3">
        {dialColors.map((d, i) => (
          <li key={d.name} className="flex items-center gap-2.5">
            <span className="num w-5 text-[11px] tabular-nums text-mute-3">{String(i + 1).padStart(2, '0')}</span>
            <span
              className="h-5 w-5 rounded-full border"
              style={{ background: d.hex.startsWith('url') ? 'repeating-linear-gradient(45deg,#ddd 0 3px,#aaa 3px 6px)' : d.hex, borderColor: d.ring ?? 'rgba(0,0,0,0.12)' }}
            />
            <span className="flex-1 truncate text-[14px] font-medium text-ink">{d.name}</span>
            <span className="num text-[15px] tabular-nums text-ink">{d.count}</span>
          </li>
        ))}
      </ul>
    </Tile>
  )
}

const strapSwatch: Record<string, string> = {
  'Stainless Steel': '#9AA0A5',
  'Alligator': '#4A2C1F',
  'Rubber': '#1E1E1E',
  'Leather': '#6B3F22',
  'Calfskin': '#A57552',
  'Titanium': '#6F7379',
  'Rose Gold': '#C4866E',
  'Gold': '#C69956',
  'Ceramic': '#2A2A2A',
  'Composite': '#3F3F3F',
}

export function StrapTile() {
  const list = strapTypes.slice(0, 6)
  const max = list[0].count
  const totalAll = strapTypes.reduce((a, b) => a + b.count, 0)
  return (
    <Tile kicker="Straps" title="What hugs the wrist" total={list[0].name.split(' ')[0]} totalLabel={`leads · ${list[0].count}`}>
      <ul className="space-y-3.5">
        {list.map((s, i) => (
          <RowBar
            key={s.name}
            rank={i + 1}
            label={s.name}
            count={s.count}
            max={max}
            swatch={strapSwatch[s.name] ?? '#999'}
          />
        ))}
      </ul>
      <div className="mt-3 border-t border-ink/5 pt-2 text-[10px] uppercase tracking-eyebrow text-mute-3">
        Leather family {Math.round(((strapTypes.find(s=>s.name==='Alligator')!.count + strapTypes.find(s=>s.name==='Leather')!.count + strapTypes.find(s=>s.name==='Calfskin')!.count) / totalAll) * 100)}% · bracelets {Math.round((strapTypes.find(s=>s.name==='Stainless Steel')!.count / totalAll) * 100)}%
      </div>
    </Tile>
  )
}

export function DiameterTile() {
  const total = diameters.reduce((a, b) => a + b.count, 0)
  const max = Math.max(...diameters.map((d) => d.count))
  const peak = diameters.find((d) => d.count === max)!
  const small = diameters.filter((d) => d.mm < 36).reduce((a, b) => a + b.count, 0)
  const mid = diameters.filter((d) => d.mm >= 36 && d.mm <= 41).reduce((a, b) => a + b.count, 0)
  const large = diameters.filter((d) => d.mm > 41).reduce((a, b) => a + b.count, 0)
  return (
    <Tile kicker="On the wrist" title="The year of 39 mm" total={`${peak.mm}`} totalLabel="peak mm">
      <div className="flex h-32 items-end gap-[3px]">
        {diameters.map((d) => {
          const h = (d.count / max) * 100
          const isPeak = d.mm === peak.mm
          return (
            <div key={d.mm} className="group relative flex flex-1 flex-col items-center justify-end" title={`${d.mm} mm · ${d.count}`}>
              <div
                className={`w-full rounded-sm ${isPeak ? 'bg-gold' : 'bg-ink/70 group-hover:bg-ink'}`}
                style={{ height: `${Math.max(h, 4)}%` }}
              />
            </div>
          )
        })}
      </div>
      <div className="mt-1.5 flex gap-[3px]">
        {diameters.map((d) => (
          <div key={d.mm} className={`flex-1 text-center text-[10px] tabular-nums ${d.mm === peak.mm ? 'font-semibold text-gold' : 'text-mute-3'}`}>
            {d.mm % 2 === 0 || d.mm === peak.mm ? d.mm : ''}
          </div>
        ))}
      </div>
      <div className="mt-5 grid grid-cols-3 gap-4 border-t border-ink/5 pt-4">
        <div>
          <div className="text-[10px] uppercase tracking-eyebrow text-mute-3">Small &lt; 36</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="num text-[22px] font-light leading-none text-ink">{small}</span>
            <span className="text-[11px] text-mute-3">{Math.round((small/total)*100)}%</span>
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-eyebrow text-mute-3">Mid 36–41</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="num text-[22px] font-light leading-none text-gold">{mid}</span>
            <span className="text-[11px] text-mute-3">{Math.round((mid/total)*100)}%</span>
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-eyebrow text-mute-3">Large &gt; 41</div>
          <div className="mt-1 flex items-baseline gap-1.5">
            <span className="num text-[22px] font-light leading-none text-ink">{large}</span>
            <span className="text-[11px] text-mute-3">{Math.round((large/total)*100)}%</span>
          </div>
        </div>
      </div>
    </Tile>
  )
}

export function FunctionsTile() {
  const list = fns.slice(0, 6)
  const max = list[0].count
  return (
    <Tile kicker="Complications" title="What the movement does">
      <ul className="space-y-3.5">
        {list.map((f, i) => (
          <RowBar key={f.name} rank={i + 1} label={f.name} count={f.count} max={max} />
        ))}
      </ul>
      <div className="mt-3 border-t border-ink/5 pt-2 text-[10px] uppercase tracking-eyebrow text-mute-3">
        Chronographs {fns.find(f=>f.name==='Chronograph')!.count + fns.find(f=>f.name==='Flyback Chronograph')!.count} · tourbillons {fns.find(f=>f.name==='Tourbillon')!.count}
      </div>
    </Tile>
  )
}

const materialSwatch: Record<string, string> = {
  'Stainless Steel': '#9AA0A5',
  'Titanium': '#6F7379',
  'Rose Gold': '#C4866E',
  'White Gold': '#D8D2C4',
  'Ceramic': '#1E1E1E',
  'Yellow Gold': '#D4A24C',
  'Platinum': '#E3E3E5',
  'Carbon': '#111111',
  'Red Gold': '#A85F3F',
  'Gold': '#C69956',
}

export function MaterialsTile() {
  const list = caseMaterials.slice(0, 6)
  const max = list[0].count
  const goldTotal = caseMaterials.filter(m => /gold/i.test(m.name)).reduce((a, b) => a + b.count, 0)
  const steelCount = caseMaterials.find(m => m.name === 'Stainless Steel')!.count
  return (
    <Tile kicker="Case metal" title="The case material mix">
      <ul className="space-y-3.5">
        {list.map((m, i) => (
          <RowBar
            key={m.name}
            rank={i + 1}
            label={m.name}
            count={m.count}
            max={max}
            swatch={materialSwatch[m.name] ?? '#999'}
          />
        ))}
      </ul>
      <div className="mt-3 border-t border-ink/5 pt-2 text-[10px] uppercase tracking-eyebrow text-mute-3">
        Steel {steelCount} vs gold family {goldTotal} · steel still leads
      </div>
    </Tile>
  )
}

export function HeightsTile() {
  const list = [...caseHeights].sort((a, b) => b.count - a.count).slice(0, 6)
  const max = list[0].count
  const thin = caseHeights.filter(h => parseInt(h.name) <= 8).reduce((a, b) => a + b.count, 0)
  const total = caseHeights.reduce((a, b) => a + b.count, 0)
  return (
    <Tile kicker="Profile" title="Slim wins the wrist" total={`${Math.round((thin/total)*100)}%`} totalLabel="≤ 8 mm">
      <ul className="space-y-3.5">
        {list.map((h, i) => (
          <RowBar key={h.name} rank={i + 1} label={h.name} count={h.count} max={max} />
        ))}
      </ul>
    </Tile>
  )
}

export function MovementTile() {
  const total = movements.reduce((a, b) => a + b.count, 0)
  const auto = movements.find(m => m.name === 'Automatic')!
  const manual = movements.find(m => m.name === 'Manual')!
  const quartz = movements.find(m => m.name === 'Quartz')!
  const segs = [
    { name: 'Automatic', count: auto.count, color: '#A98155' },
    { name: 'Manual',    count: manual.count, color: '#3A3935' },
    { name: 'Quartz',    count: quartz.count, color: '#C6C6C6' },
  ]
  return (
    <Tile kicker="Movement" title="How they tick">
      <div className="flex h-5 w-full overflow-hidden rounded-full">
        {segs.map(s => (
          <div key={s.name} style={{ width: `${(s.count/total)*100}%`, background: s.color }} title={`${s.name} · ${s.count}`} />
        ))}
      </div>
      <ul className="mt-5 space-y-4">
        {segs.map((s) => {
          const pct = Math.round((s.count / total) * 100)
          return (
            <li key={s.name} className="flex items-center gap-3">
              <span className="h-4 w-4 rounded-full" style={{ background: s.color }} />
              <span className="flex-1 text-[14px] font-medium text-ink">{s.name}</span>
              <span className="num text-[18px] tabular-nums text-ink">{s.count}</span>
              <span className="num w-12 text-right text-[13px] tabular-nums text-mute-3">{pct}%</span>
            </li>
          )
        })}
      </ul>
      <div className="mt-3 border-t border-ink/5 pt-2 text-[10px] uppercase tracking-eyebrow text-mute-3">
        Mechanical family {Math.round(((auto.count + manual.count) / total) * 100)}% of releases
      </div>
    </Tile>
  )
}

export function EditionsTile() {
  const total = editions.reduce((a, b) => a + b.count, 0)
  const share = Math.round((total / TOTAL_NOVELTIES) * 100)
  return (
    <Tile kicker="Editions" title="Limited and milestone" total={total} totalLabel={`${share}% of fair`}>
      <div className="grid grid-cols-3 gap-4">
        {editions.map((e, i) => (
          <div
            key={e.name}
            className={`rounded-sm border p-5 ${i === 0 ? 'border-gold/60 bg-gold/5' : 'border-ink/10 bg-ink/[0.02]'}`}
          >
            <div className="num text-[44px] font-light leading-none text-ink">{e.count}</div>
            <div className="mt-3 text-[12px] uppercase tracking-eyebrow text-mute-3">{e.name.replace(' Edition', '')}</div>
            <div className="mt-4 h-[6px] w-full overflow-hidden rounded-full bg-ink/5">
              <div className={`h-full rounded-full ${i === 0 ? 'bg-gold' : 'bg-ink'}`} style={{ width: `${(e.count / editions[0].count) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </Tile>
  )
}

// ——————————————————————————————————————— grid

export default function V2RightGrid() {
  return (
    <div className="grid grid-cols-2 gap-4">
      <BrandsTile />
      <CollectionsTile />
      <div className="col-span-2"><PriceTile /></div>
      <DialTile />
      <StrapTile />
      <div className="col-span-2"><DiameterTile /></div>
      <FunctionsTile />
      <MaterialsTile />
      <HeightsTile />
      <MovementTile />
      <div className="col-span-2"><EditionsTile /></div>
    </div>
  )
}
