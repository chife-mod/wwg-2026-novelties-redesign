import { useEffect, useRef, useState } from 'react'
import { topWatches, type TopWatch } from '../data'
import { BrandMonogram } from './common'

const fmtPrice = (n: number) =>
  n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K` : `$${n.toLocaleString()}`

type StrapKind = 'links' | 'stitched' | 'solid'
function strapStyle(strap: string): { fill: string; stitch?: string; kind: StrapKind } {
  const s = strap.toLowerCase()
  if (s.includes('rubber')) return { fill: '#141414', kind: 'solid' }
  if (s.includes('gold bracelet') || s.includes('rose gold')) return { fill: '#B8874A', kind: 'links' }
  if (s.includes('bracelet') || s.includes('jubilee') || s.includes('steel')) return { fill: '#9A9AA0', kind: 'links' }
  if (s.includes('alligator') || s.includes('leather') || s.includes('calf')) return { fill: '#2A1A10', stitch: '#C69559', kind: 'stitched' }
  return { fill: '#2A1A10', stitch: '#C69559', kind: 'stitched' }
}

function caseColor(material: string): { outer: string; inner: string } {
  const m = material.toLowerCase()
  if (m.includes('rose gold') || m.includes('red gold')) return { outer: '#C89868', inner: '#A47745' }
  if (m.includes('white gold') || m.includes('platinum')) return { outer: '#DADADE', inner: '#9B9BA0' }
  if (m.includes('yellow gold') || (m.includes('gold') && !m.includes('white'))) return { outer: '#D9B04A', inner: '#AE8432' }
  if (m.includes('titanium')) return { outer: '#86868A', inner: '#5D5D60' }
  return { outer: '#BCBCC0', inner: '#8A8A8E' } // steel default
}

function FrontWatch({ w }: { w: TopWatch }) {
  const strap = strapStyle(w.strap)
  const cs = caseColor(w.caseMaterial)
  const dial = w.dialHex
  const uid = w.reference.replace(/[^a-z0-9]/gi, '')
  const darkDial = ['#111111', '#1F3F8A', '#1F4E33', '#5E3A1F', '#2D2D2F'].includes(dial)
  const indexColor = darkDial ? '#EEEDEC' : '#1E1D19'
  const handColor = darkDial ? '#EEEDEC' : '#1E1D19'

  // Strap link rows (8 segments)
  const linkY = [8, 40, 72, 104, 136, 168, 200]
  const bottomLinkY = [472, 504, 536, 568, 600, 632, 664]

  return (
    <svg viewBox="0 0 240 700" className="h-auto w-full drop-shadow-[0_40px_40px_rgba(0,0,0,0.45)]">
      <defs>
        <linearGradient id={`case-${uid}`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0%" stopColor={cs.outer} />
          <stop offset="55%" stopColor={cs.inner} />
          <stop offset="100%" stopColor={cs.outer} />
        </linearGradient>
        <radialGradient id={`dial-${uid}`} cx="42%" cy="35%" r="75%">
          <stop offset="0%" stopColor={dial} stopOpacity="1" />
          <stop offset="70%" stopColor={dial} stopOpacity="0.85" />
          <stop offset="100%" stopColor={dial} stopOpacity="0.55" />
        </radialGradient>
        <linearGradient id={`strap-${uid}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={strap.fill} stopOpacity="0.65" />
          <stop offset="50%" stopColor={strap.fill} stopOpacity="1" />
          <stop offset="100%" stopColor={strap.fill} stopOpacity="0.65" />
        </linearGradient>
      </defs>

      {/* ground shadow */}
      <ellipse cx="120" cy="694" rx="96" ry="6" fill="#000" opacity="0.28" />

      {/* TOP STRAP — tapered trapezoid */}
      <path d="M 82 0 L 158 0 L 170 240 L 70 240 Z" fill={`url(#strap-${uid})`} />
      {strap.kind === 'stitched' && (
        <>
          <path d="M 85 4 Q 80 120 75 236" stroke={strap.stitch} strokeWidth="0.6" strokeDasharray="3 4" fill="none" />
          <path d="M 155 4 Q 160 120 165 236" stroke={strap.stitch} strokeWidth="0.6" strokeDasharray="3 4" fill="none" />
        </>
      )}
      {strap.kind === 'links' &&
        linkY.map((y, i) => {
          const t = y / 240
          const x1 = 82 - t * 12
          const x2 = 158 + t * 12
          return (
            <line key={i} x1={x1 + 3} y1={y} x2={x2 - 3} y2={y} stroke="#000" strokeOpacity="0.35" strokeWidth="1" />
          )
        })}

      {/* CASE */}
      <circle cx="120" cy="350" r="100" fill={`url(#case-${uid})`} />
      <circle cx="120" cy="350" r="92" fill="#0B0A08" />
      <circle cx="120" cy="350" r="84" fill={`url(#dial-${uid})`} />

      {/* brand text on dial, tiny */}
      <text x="120" y="322" textAnchor="middle" fontSize="7" fontWeight="700" letterSpacing="0.2em" fontFamily="Lato,sans-serif" fill={indexColor} opacity="0.7">
        {w.brand.toUpperCase().slice(0, 12)}
      </text>
      <text x="120" y="334" textAnchor="middle" fontSize="4.5" letterSpacing="0.14em" fontFamily="Lato,sans-serif" fill={indexColor} opacity="0.45">
        {w.collection.toUpperCase()}
      </text>

      {/* hour indices */}
      {Array.from({ length: 12 }).map((_, i) => {
        const a = (i / 12) * Math.PI * 2 - Math.PI / 2
        const r1 = 76
        const r2 = i % 3 === 0 ? 64 : 70
        return (
          <line
            key={i}
            x1={120 + Math.cos(a) * r1}
            y1={350 + Math.sin(a) * r1}
            x2={120 + Math.cos(a) * r2}
            y2={350 + Math.sin(a) * r2}
            stroke={indexColor}
            strokeOpacity={i % 3 === 0 ? 0.95 : 0.55}
            strokeWidth={i % 3 === 0 ? 2.5 : 1.2}
            strokeLinecap="round"
          />
        )
      })}

      {/* date window at 3 */}
      <rect x="184" y="344" width="14" height="12" fill="#fff" stroke={cs.inner} strokeWidth="0.3" />
      <text x="191" y="354" textAnchor="middle" fontSize="9" fontWeight="600" fontFamily="Lato,sans-serif" fill="#111">28</text>

      {/* hands */}
      <line x1="120" y1="350" x2="120" y2="290" stroke={handColor} strokeWidth="3.2" strokeLinecap="round" />
      <line x1="120" y1="350" x2="158" y2="350" stroke={handColor} strokeWidth="2.6" strokeLinecap="round" />
      <line x1="120" y1="350" x2="120" y2="382" stroke="#D49E64" strokeWidth="1.4" strokeLinecap="round" />
      <circle cx="120" cy="350" r="4" fill="#D49E64" />

      {/* crown */}
      <rect x="218" y="346" width="8" height="12" rx="1.5" fill={cs.outer} />
      <rect x="219" y="348" width="6" height="8" rx="0.5" fill={cs.inner} opacity="0.6" />

      {/* BOTTOM STRAP */}
      <path d="M 70 460 L 170 460 L 158 700 L 82 700 Z" fill={`url(#strap-${uid})`} />
      {strap.kind === 'stitched' && (
        <>
          <path d="M 75 464 Q 80 580 85 696" stroke={strap.stitch} strokeWidth="0.6" strokeDasharray="3 4" fill="none" />
          <path d="M 165 464 Q 160 580 155 696" stroke={strap.stitch} strokeWidth="0.6" strokeDasharray="3 4" fill="none" />
        </>
      )}
      {strap.kind === 'links' &&
        bottomLinkY.map((y, i) => {
          const t = (y - 460) / 240
          const x1 = 70 + t * 12
          const x2 = 170 - t * 12
          return (
            <line key={i} x1={x1 + 3} y1={y} x2={x2 - 3} y2={y} stroke="#000" strokeOpacity="0.35" strokeWidth="1" />
          )
        })}

      {/* buckle */}
      <rect x="90" y="664" width="60" height="14" rx="1.5" fill={strap.kind === 'links' ? cs.outer : '#C89868'} opacity="0.85" />
      <rect x="108" y="667" width="24" height="8" rx="0.5" fill="#000" opacity="0.25" />
    </svg>
  )
}

function Chip({
  children,
  variant = 'glass',
  className = '',
}: {
  children: React.ReactNode
  variant?: 'glass' | 'solid' | 'dark'
  className?: string
}) {
  const style =
    variant === 'glass'
      ? 'border border-white/25 bg-white/15 text-paper backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.25)]'
      : variant === 'solid'
      ? 'bg-paper text-ink shadow-[0_12px_30px_rgba(0,0,0,0.35)]'
      : 'border border-white/10 bg-ink-deep/75 text-paper backdrop-blur-md shadow-[0_8px_20px_rgba(0,0,0,0.35)]'
  return (
    <div className={`pointer-events-none rounded-full px-3 py-1.5 ${style} ${className}`}>{children}</div>
  )
}

export default function WatchStage() {
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  const total = topWatches.length
  const timer = useRef<number | null>(null)
  const w = topWatches[idx]

  useEffect(() => {
    if (paused) return
    timer.current = window.setTimeout(() => setIdx((i) => (i + 1) % total), 8000)
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [idx, paused, total])

  return (
    <div
      className="relative flex h-full flex-col items-center justify-center"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* the watch — max width so the column stays compact */}
      <div className="relative w-full max-w-[340px]">
        <FrontWatch w={w} />

        {/* overlapping chips — absolute in watch-box coords */}
        {/* brand pill, top-left overlapping top strap */}
        <div className="absolute left-[-18%] top-[4%]">
          <Chip variant="solid">
            <div className="flex items-center gap-2">
              <BrandMonogram name={w.brand} size={20} />
              <span className="text-[10px] font-semibold uppercase tracking-eyebrow">{w.brand}</span>
            </div>
          </Chip>
        </div>

        {/* reference, top-right */}
        <div className="absolute right-[-18%] top-[6%]">
          <Chip variant="glass">
            <div className="flex flex-col">
              <span className="text-[8px] uppercase tracking-eyebrow text-gold">Ref</span>
              <span className="num text-[10px] tabular-nums">{w.reference}</span>
            </div>
          </Chip>
        </div>

        {/* dial chip, right side overlapping case */}
        <div className="absolute right-[-28%] top-[38%]">
          <Chip variant="glass">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full border border-white/40" style={{ background: w.dialHex }} />
              <div className="flex flex-col leading-tight">
                <span className="text-[8px] uppercase tracking-eyebrow text-gold">Dial</span>
                <span className="text-[10px] text-paper">{w.dial}</span>
              </div>
            </div>
          </Chip>
        </div>

        {/* case chip, left side overlapping case */}
        <div className="absolute left-[-30%] top-[44%]">
          <Chip variant="glass">
            <div className="flex flex-col leading-tight">
              <span className="text-[8px] uppercase tracking-eyebrow text-gold">Case</span>
              <span className="text-[10px] text-paper">{w.caseDiameter}</span>
              <span className="text-[9px] text-mute-2">{w.caseMaterial.split(' · ')[0]}</span>
            </div>
          </Chip>
        </div>

        {/* strap chip, lower-left overlapping strap */}
        <div className="absolute left-[-22%] top-[72%]">
          <Chip variant="dark">
            <div className="flex flex-col leading-tight">
              <span className="text-[8px] uppercase tracking-eyebrow text-gold">Strap</span>
              <span className="text-[10px]">{w.strap}</span>
            </div>
          </Chip>
        </div>

        {/* price, big, right side */}
        <div className="absolute right-[-26%] top-[66%]">
          <div className="rounded-lg bg-paper px-4 py-2.5 shadow-[0_18px_40px_rgba(0,0,0,0.4)]">
            <div className="text-[8px] uppercase tracking-eyebrow text-gold">Retail</div>
            <div className="num text-[22px] font-semibold leading-none text-ink">{fmtPrice(w.priceUsd)}</div>
          </div>
        </div>

        {/* model name, bottom overlapping bottom strap */}
        <div className="absolute bottom-[2%] left-1/2 -translate-x-1/2">
          <Chip variant="solid">
            <span className="text-[10px] font-semibold uppercase tracking-eyebrow">{w.model}</span>
          </Chip>
        </div>
      </div>

      {/* controls — below watch */}
      <div className="mt-6 flex w-full max-w-[340px] items-center justify-between">
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-eyebrow text-mute-2">
          <span className="num text-gold">{String(idx + 1).padStart(2, '0')}</span>
          <span>/ {String(total).padStart(2, '0')} · Top watches 2026</span>
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

      {/* progress dots */}
      <div className="mt-3 flex w-full max-w-[340px] items-center gap-1">
        {topWatches.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIdx(i)}
            className={`h-[3px] flex-1 rounded-full transition-colors ${i === idx ? 'bg-gold' : 'bg-white/15 hover:bg-white/30'}`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </div>
  )
}
