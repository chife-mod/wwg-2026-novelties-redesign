import type { ReactNode } from 'react'

export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`font-sans text-[11px] font-medium uppercase tracking-eyebrow text-gold ${className}`}>
      {children}
    </span>
  )
}

export function SectionTitle({
  kicker,
  title,
  subtitle,
  count,
}: {
  kicker?: string
  title: string
  subtitle?: string
  count?: number
}) {
  return (
    <div className="flex items-end justify-between gap-8 border-b border-ink/10 pb-4">
      <div>
        {kicker && <div className="mb-2"><Eyebrow>{kicker}</Eyebrow></div>}
        <h2 className="font-sans text-[34px] leading-[1.05] text-ink">{title}</h2>
        {subtitle && <p className="mt-2 max-w-xl text-sm text-mute-3">{subtitle}</p>}
      </div>
      {typeof count === 'number' && (
        <div className="shrink-0 text-right">
          <div className="num font-sans text-[40px] leading-none text-ink">{count}</div>
          <Eyebrow className="text-mute-3">total</Eyebrow>
        </div>
      )}
    </div>
  )
}

export function DeltaChip({ delta }: { delta?: number }) {
  if (delta === undefined) return null
  const up = delta > 0
  const flat = delta === 0
  const sign = up ? '+' : flat ? '±' : ''
  const bg = up ? 'bg-success/15 text-success' : flat ? 'bg-ink/5 text-mute-3' : 'bg-error/15 text-error'
  return (
    <span className={`num inline-flex min-w-[42px] justify-center rounded-sm px-1.5 py-0.5 text-[11px] font-medium tabular-nums ${bg}`}>
      {sign}
      {delta}
    </span>
  )
}

export function BrandMonogram({ name, size = 40 }: { name: string; size?: number }) {
  const initials = name
    .replace(/[&.]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full border border-gold/40 bg-ink-deep font-sans text-gold"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  )
}

export function WatchPlaceholder({ name, size = 96 }: { name: string; size?: number }) {
  const initials = name
    .replace(/[&.]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
      aria-label={`${name} placeholder`}
    >
      {/* gold arc */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id={`arc-${name.replace(/[^a-z]/gi, '')}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D49E64" />
            <stop offset="100%" stopColor="#A98155" />
          </linearGradient>
        </defs>
        <circle
          cx="50"
          cy="50"
          r="47"
          fill="none"
          stroke={`url(#arc-${name.replace(/[^a-z]/gi, '')})`}
          strokeWidth="1.5"
          strokeDasharray="90 300"
          strokeDashoffset="-20"
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
      </svg>
      {/* watch face placeholder */}
      <div className="absolute inset-[10%] flex items-center justify-center rounded-full bg-gradient-to-br from-[#2a2926] to-[#14130f] font-sans text-gold shadow-inner">
        <span style={{ fontSize: size * 0.2 }} className="tracking-wide">{initials}</span>
      </div>
      {/* crown dot */}
      <div
        className="absolute rounded-full bg-gold"
        style={{ width: size * 0.04, height: size * 0.1, right: size * 0.04, top: size * 0.44 }}
      />
    </div>
  )
}
