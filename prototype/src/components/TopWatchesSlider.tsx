import { useEffect, useRef, useState } from 'react'
import { topWatches, type TopWatch } from '../data'
import { BrandMonogram } from './common'

const fmtPrice = (n: number) =>
  n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K` : `$${n.toLocaleString()}`

function WatchVisual({ w, size = 260 }: { w: TopWatch; size?: number }) {
  // Dial-coloured placeholder watch: ring + dial + indices + hands.
  const gid = `dial-${w.reference.replace(/[^a-z0-9]/gi, '')}`
  return (
    <svg viewBox="0 0 120 120" width={size} height={size} className="shrink-0">
      <defs>
        <radialGradient id={gid} cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor={w.dialHex} stopOpacity="0.95" />
          <stop offset="100%" stopColor={w.dialHex} stopOpacity="0.6" />
        </radialGradient>
        <linearGradient id={`${gid}-ring`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#D49E64" />
          <stop offset="100%" stopColor="#A98155" />
        </linearGradient>
      </defs>
      {/* case */}
      <circle cx="60" cy="60" r="56" fill="#1B1A17" />
      <circle cx="60" cy="60" r="55" fill="none" stroke={`url(#${gid}-ring)`} strokeWidth="2" />
      <circle cx="60" cy="60" r="50" fill="#0F0E0C" />
      {/* dial */}
      <circle cx="60" cy="60" r="46" fill={`url(#${gid})`} />
      {/* indices */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2
        const r1 = 42
        const r2 = i % 3 === 0 ? 36 : 39
        return (
          <line
            key={i}
            x1={60 + Math.cos(a) * r1}
            y1={60 + Math.sin(a) * r1}
            x2={60 + Math.cos(a) * r2}
            y2={60 + Math.sin(a) * r2}
            stroke={i % 3 === 0 ? '#D49E64' : '#EEEDEC'}
            strokeOpacity={i % 3 === 0 ? 0.9 : 0.5}
            strokeWidth={i % 3 === 0 ? 1.4 : 0.8}
            strokeLinecap="round"
          />
        )
      })}
      {/* hands */}
      <line x1="60" y1="60" x2="60" y2="32" stroke="#EEEDEC" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="60" y1="60" x2="78" y2="60" stroke="#EEEDEC" strokeWidth="1.4" strokeLinecap="round" />
      <line x1="60" y1="60" x2="60" y2="78" stroke="#D49E64" strokeWidth="0.9" strokeLinecap="round" />
      <circle cx="60" cy="60" r="2" fill="#D49E64" />
      {/* crown */}
      <rect x="114" y="57" width="3" height="6" rx="0.5" fill="#8B6337" />
    </svg>
  )
}

function Annotation({
  x,
  y,
  anchorX,
  anchorY,
  label,
  value,
  align = 'right',
}: {
  x: number
  y: number
  anchorX: number
  anchorY: number
  label: string
  value: string
  align?: 'left' | 'right'
}) {
  return (
    <g>
      <line
        x1={anchorX}
        y1={anchorY}
        x2={x}
        y2={y}
        stroke="#3A3935"
        strokeOpacity="0.35"
        strokeWidth="0.6"
      />
      <circle cx={anchorX} cy={anchorY} r="1.3" fill="#A98155" />
      <g transform={`translate(${x} ${y})`}>
        <text
          textAnchor={align === 'right' ? 'start' : 'end'}
          fontSize="3.2"
          fontFamily="Lato, sans-serif"
          fontWeight={700}
          letterSpacing="0.14em"
          fill="#A98155"
          y={-2}
        >
          {label.toUpperCase()}
        </text>
        <text
          textAnchor={align === 'right' ? 'start' : 'end'}
          fontSize="4.2"
          fontFamily="Lato, sans-serif"
          fontWeight={500}
          fill="#3A3935"
          y={3}
        >
          {value}
        </text>
      </g>
    </g>
  )
}

function ActiveCard({ w }: { w: TopWatch }) {
  // SVG overlay uses a shared 120×120 coordinate system for the watch, then we
  // add annotation callouts around it. Total surface 300×220 so the leader
  // lines have room to breathe.
  return (
    <div className="relative overflow-hidden rounded-sm bg-white shadow-[0_30px_80px_rgba(0,0,0,0.45)]">
      {/* top bar */}
      <div className="flex items-center justify-between border-b border-ink/10 px-6 pt-5 pb-4">
        <div className="flex items-center gap-3">
          <BrandMonogram name={w.brand} size={32} />
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-eyebrow text-mute-3">{w.brand} · {w.collection}</div>
            <div className="truncate text-[15px] font-medium text-ink">{w.model}</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-eyebrow text-mute-3">Reference</div>
          <div className="num mt-0.5 text-[12px] tabular-nums text-ink">{w.reference}</div>
        </div>
      </div>

      {/* visual + annotations */}
      <div className="relative flex items-center justify-center bg-paper px-6 py-8">
        <svg viewBox="0 0 300 220" className="w-full max-w-[420px]">
          {/* watch centered at (150,110), size 160 */}
          <g transform="translate(90 30)">
            <foreignObject x="0" y="0" width="120" height="120">
              <WatchVisual w={w} size={120} />
            </foreignObject>
          </g>
          {/* annotations — coords in same 300×220 space */}
          <Annotation anchorX={150} anchorY={90}  x={235} y={56}  label="Dial"   value={w.dial}          align="right" />
          <Annotation anchorX={200} anchorY={128} x={260} y={130} label="Case"   value={`${w.caseMaterial} · ${w.caseDiameter}`} align="right" />
          <Annotation anchorX={150} anchorY={145} x={230} y={195} label="Strap"  value={w.strap}         align="right" />
          <Annotation anchorX={105} anchorY={130} x={40}  y={160} label="Movement" value={w.movement}   align="left" />
        </svg>
      </div>

      {/* footer */}
      <div className="grid grid-cols-[1fr_auto] items-end gap-6 border-t border-ink/10 px-6 pb-5 pt-4">
        <div className="flex flex-wrap gap-1.5">
          <Chip>{w.dial}</Chip>
          <Chip>{w.caseDiameter}</Chip>
          <Chip>{w.caseMaterial.split(' · ')[0]}</Chip>
          <Chip>{w.strap}</Chip>
        </div>
        <div className="text-right">
          <div className="text-[10px] uppercase tracking-eyebrow text-mute-3">Retail price</div>
          <div className="num text-[24px] font-semibold text-ink">{fmtPrice(w.priceUsd)}</div>
        </div>
      </div>
    </div>
  )
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-ink/10 bg-paper/80 px-2.5 py-1 text-[10px] uppercase tracking-eyebrow text-ink">
      {children}
    </span>
  )
}

export default function TopWatchesSlider() {
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  const total = topWatches.length
  const timer = useRef<number | null>(null)

  useEffect(() => {
    if (paused) return
    timer.current = window.setTimeout(() => setIdx((i) => (i + 1) % total), 6000)
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [idx, paused, total])

  const current = topWatches[idx]
  const nextA = topWatches[(idx + 1) % total]
  const nextB = topWatches[(idx + 2) % total]

  return (
    <div
      className="relative h-full"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* peek card layer B (furthest) */}
      <div className="absolute right-[-36px] top-10 h-[78%] w-[60%] rounded-sm bg-paper/40 shadow-[0_20px_60px_rgba(0,0,0,0.3)] backdrop-blur-sm">
        <div className="flex h-full flex-col justify-between px-5 py-4 text-[10px] uppercase tracking-eyebrow text-ink/50">
          <span>{String(((idx + 2) % total) + 1).padStart(2, '0')} · {nextB.brand}</span>
          <span className="truncate">{nextB.model}</span>
        </div>
      </div>
      {/* peek card layer A (closer) */}
      <div className="absolute right-[-18px] top-6 h-[82%] w-[66%] rounded-sm bg-paper/75 shadow-[0_20px_60px_rgba(0,0,0,0.35)] backdrop-blur-sm">
        <div className="flex h-full flex-col justify-between px-5 py-4 text-[11px] uppercase tracking-eyebrow text-ink/70">
          <span>{String(((idx + 1) % total) + 1).padStart(2, '0')} · {nextA.brand}</span>
          <span className="truncate">{nextA.model}</span>
        </div>
      </div>
      {/* active card */}
      <div className="relative z-10">
        <ActiveCard w={current} />
      </div>

      {/* controls */}
      <div className="absolute -bottom-4 left-0 right-0 z-20 flex items-center justify-between px-2">
        <div className="flex items-center gap-3 rounded-full bg-ink-deep/80 px-3 py-1.5 text-[10px] uppercase tracking-eyebrow text-paper backdrop-blur-sm">
          <span className="num text-gold">{String(idx + 1).padStart(2, '0')}</span>
          <span className="text-mute-2">/ {String(total).padStart(2, '0')}</span>
          <span className="mx-1 h-3 w-px bg-white/20" />
          <span>Top watches · 2026</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIdx((i) => (i - 1 + total) % total)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-ink-deep/80 text-paper backdrop-blur-sm transition-colors hover:bg-gold hover:text-ink-deep"
            aria-label="Previous"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button
            type="button"
            onClick={() => setIdx((i) => (i + 1) % total)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 bg-ink-deep/80 text-paper backdrop-blur-sm transition-colors hover:bg-gold hover:text-ink-deep"
            aria-label="Next"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>
    </div>
  )
}
