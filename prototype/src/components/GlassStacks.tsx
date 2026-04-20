import { brands, collections, dialColors, diameters } from '../data'
import { BrandMonogram } from './common'

function GlassCard({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-white/15 bg-white/10 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-xl ${className}`}
      style={{ boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.12), 0 24px 60px rgba(0,0,0,0.4)' }}
    >
      {children}
    </div>
  )
}

function StackHeader({ kicker, title }: { kicker: string; title: string }) {
  return (
    <div className="flex items-end justify-between">
      <div>
        <div className="text-[9px] uppercase tracking-eyebrow text-gold">{kicker}</div>
        <div className="mt-1 text-[14px] leading-tight text-paper">{title}</div>
      </div>
    </div>
  )
}

function BrandsStack() {
  const top3 = brands.slice(0, 3)
  const max = top3[0].count
  return (
    <GlassCard>
      <StackHeader kicker="Podium" title="Brands of the fair" />
      <div className="relative mt-4 h-[148px]">
        {top3
          .slice()
          .reverse()
          .map((b, visualIdx) => {
            const rank = top3.length - 1 - visualIdx
            const offset = rank * 14
            const opacity = 1 - rank * 0.25
            const scale = 1 - rank * 0.04
            const share = (b.count / max) * 100
            return (
              <div
                key={b.name}
                className="absolute left-0 right-0 rounded-xl border border-white/15 bg-ink-deep/70 p-3"
                style={{
                  top: offset,
                  opacity,
                  transform: `translateX(${rank * 8}px) scale(${scale})`,
                  transformOrigin: 'left center',
                  zIndex: 10 - rank,
                  backdropFilter: 'blur(8px)',
                }}
              >
                <div className="flex items-center gap-3">
                  <BrandMonogram name={b.name} size={28} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="truncate text-[12px] text-paper">{b.name}</span>
                      <span className="num text-[14px] font-semibold text-gold-light">{b.count}</span>
                    </div>
                    <div className="mt-1.5 h-[3px] w-full overflow-hidden rounded-full bg-white/10">
                      <div className="h-full rounded-full bg-gold" style={{ width: `${share}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
      </div>
      <div className="mt-2 flex items-center justify-between text-[9px] uppercase tracking-eyebrow text-mute-2">
        <span>Top 3 of {brands.length}+</span>
        <span className="text-gold-light">Rolex leads 2×</span>
      </div>
    </GlassCard>
  )
}

function DialsStack() {
  const top3 = dialColors.slice(0, 3)
  const total = dialColors.reduce((a, b) => a + b.count, 0)
  return (
    <GlassCard>
      <StackHeader kicker="Palette" title="Colour of 2026" />
      <div className="relative mt-4 h-[148px]">
        {top3
          .slice()
          .reverse()
          .map((c, visualIdx) => {
            const rank = top3.length - 1 - visualIdx
            const offset = rank * 14
            const opacity = 1 - rank * 0.25
            const scale = 1 - rank * 0.04
            const pct = Math.round((c.count / total) * 100)
            const darkText = ['#111111', '#1F3F8A', '#1F4E33', '#5E3A1F'].includes(c.hex)
            return (
              <div
                key={c.name}
                className="absolute left-0 right-0 overflow-hidden rounded-xl border border-white/15 p-3"
                style={{
                  top: offset,
                  opacity,
                  transform: `translateX(${rank * 8}px) scale(${scale})`,
                  transformOrigin: 'left center',
                  background: c.hex.startsWith('url') ? '#6e6e6e' : c.hex,
                  zIndex: 10 - rank,
                }}
              >
                <div className={`flex items-center justify-between ${darkText ? 'text-white/95' : 'text-ink'}`}>
                  <div>
                    <div className="text-[9px] uppercase tracking-eyebrow opacity-80">{c.name} dial</div>
                    <div className="num mt-0.5 text-[20px] font-semibold leading-none">{c.count}</div>
                  </div>
                  <div className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${darkText ? 'bg-white/15 text-paper' : 'bg-ink/10 text-ink'}`}>
                    {pct}%
                  </div>
                </div>
              </div>
            )
          })}
      </div>
      <div className="mt-2 flex items-center justify-between text-[9px] uppercase tracking-eyebrow text-mute-2">
        <span>Top 3 of 18</span>
        <span className="text-gold-light">Blue · 22% of fair</span>
      </div>
    </GlassCard>
  )
}

function DimensionsStack() {
  // top 3 peak diameters by count
  const top3 = [...diameters].sort((a, b) => b.count - a.count).slice(0, 3)
  const maxCount = top3[0].count
  return (
    <GlassCard>
      <StackHeader kicker="On the wrist" title="Dimensions that lead" />
      <div className="relative mt-4 h-[148px]">
        {top3
          .slice()
          .reverse()
          .map((d, visualIdx) => {
            const rank = top3.length - 1 - visualIdx
            const offset = rank * 14
            const opacity = 1 - rank * 0.25
            const scale = 1 - rank * 0.04
            const share = (d.count / maxCount) * 100
            return (
              <div
                key={d.mm}
                className="absolute left-0 right-0 rounded-xl border border-white/15 bg-ink-deep/70 p-3 backdrop-blur-sm"
                style={{
                  top: offset,
                  opacity,
                  transform: `translateX(${rank * 8}px) scale(${scale})`,
                  transformOrigin: 'left center',
                  zIndex: 10 - rank,
                }}
              >
                <div className="flex items-baseline justify-between">
                  <div className="flex items-baseline gap-2">
                    <span className="num text-[24px] font-light leading-none text-paper">{d.mm}</span>
                    <span className="text-[10px] uppercase tracking-eyebrow text-mute-2">mm</span>
                  </div>
                  <span className="num text-[13px] font-semibold text-gold-light">{d.count}</span>
                </div>
                {/* tick ruler */}
                <div className="mt-2 flex items-end gap-[2px]">
                  {Array.from({ length: 24 }).map((_, i) => {
                    const active = i <= Math.round((share / 100) * 24)
                    return (
                      <span
                        key={i}
                        className={`w-[3px] rounded-sm ${active ? 'bg-gold' : 'bg-white/10'}`}
                        style={{ height: i % 5 === 0 ? 10 : 6 }}
                      />
                    )
                  })}
                </div>
              </div>
            )
          })}
      </div>
      <div className="mt-2 flex items-center justify-between text-[9px] uppercase tracking-eyebrow text-mute-2">
        <span>Peak diameters</span>
        <span className="text-gold-light">64% under 41 mm</span>
      </div>
    </GlassCard>
  )
}

function CollectionsStack() {
  const top3 = collections.slice(0, 3)
  const max = top3[0].count
  return (
    <GlassCard>
      <StackHeader kicker="Lines" title="Collections leading" />
      <div className="relative mt-4 h-[148px]">
        {top3
          .slice()
          .reverse()
          .map((c, visualIdx) => {
            const rank = top3.length - 1 - visualIdx
            const offset = rank * 14
            const opacity = 1 - rank * 0.25
            const scale = 1 - rank * 0.04
            const share = (c.count / max) * 100
            const [brand, ...rest] = c.name.split(' ')
            const line = rest.join(' ')
            return (
              <div
                key={c.name}
                className="absolute left-0 right-0 rounded-xl border border-white/15 bg-ink-deep/70 p-3 backdrop-blur-sm"
                style={{
                  top: offset,
                  opacity,
                  transform: `translateX(${rank * 8}px) scale(${scale})`,
                  transformOrigin: 'left center',
                  zIndex: 10 - rank,
                }}
              >
                <div className="flex items-baseline justify-between gap-2">
                  <div className="min-w-0">
                    <div className="truncate text-[10px] uppercase tracking-eyebrow text-mute-2">{brand}</div>
                    <div className="truncate text-[13px] text-paper">{line || brand}</div>
                  </div>
                  <span className="num shrink-0 text-[16px] font-semibold text-gold-light">{c.count}</span>
                </div>
                <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gold" style={{ width: `${share}%` }} />
                </div>
              </div>
            )
          })}
      </div>
      <div className="mt-2 flex items-center justify-between text-[9px] uppercase tracking-eyebrow text-mute-2">
        <span>Top 3 of {collections.length}+</span>
        <span className="text-gold-light">Datejust pulls ahead</span>
      </div>
    </GlassCard>
  )
}

export default function GlassStacks() {
  return (
    <div className="flex h-full flex-col gap-3">
      <BrandsStack />
      <CollectionsStack />
      <DialsStack />
      <DimensionsStack />
    </div>
  )
}
