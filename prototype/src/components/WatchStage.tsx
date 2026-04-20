import { useEffect, useRef, useState } from 'react'
import { topWatches, dialColors, diameters, prices } from '../data'
import watchPhoto from '../assets/iwc-pilot-chrono.png'

const fmtPrice = (n: number) =>
  n >= 1000 ? `$${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}K` : `$${n.toLocaleString()}`

// ——————————————————————————————————————— fair-level highlights
const dialTotal = dialColors.reduce((a, b) => a + b.count, 0)
const leadDial = dialColors[0]
const dialShare = Math.round((leadDial.count / dialTotal) * 100)
const peakD = diameters.reduce((a, b) => (b.count > a.count ? b : a))
const peakP = prices.reduce((a, b) => (b.count > a.count ? b : a))

const HIGHLIGHTS = [
  { kicker: 'Dial', value: leadDial.name, meta: `${dialShare}% of fair`, swatch: leadDial.hex },
  { kicker: 'Wrist', value: `${peakD.mm} mm`, meta: 'peak diameter' },
  { kicker: 'Tier', value: peakP.short, meta: 'sweet spot' },
] as const

// ——————————————————————————————————————— stage

export default function WatchStage() {
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  const total = topWatches.length
  const timer = useRef<number | null>(null)
  const w = topWatches[idx]

  useEffect(() => {
    if (paused) return
    timer.current = window.setTimeout(() => setIdx((i) => (i + 1) % total), 9000)
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [idx, paused, total])

  const prev = () => setIdx((i) => (i - 1 + total) % total)
  const next = () => setIdx((i) => (i + 1) % total)

  return (
    <div
      className="relative flex h-full flex-col"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* ———————— TOP: heading + three fair highlights ———————— */}
      <header className="pb-5">
        <div className="flex items-center gap-2 text-[9px] uppercase tracking-eyebrow text-gold">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          <span>The stage</span>
        </div>
        <h2 className="mt-3 text-[26px] font-light leading-[1.1] text-paper">
          Three signals that<br />shape the fair
        </h2>
        <div className="mt-5 grid grid-cols-3 gap-3">
          {HIGHLIGHTS.map((h) => (
            <div key={h.kicker} className="border-l border-gold/40 pl-2.5">
              <div className="text-[8px] font-semibold uppercase tracking-eyebrow text-gold">{h.kicker}</div>
              <div className="mt-1 flex items-center gap-1.5">
                {'swatch' in h && h.swatch && (
                  <span className="h-2.5 w-2.5 rounded-full border border-white/30" style={{ background: h.swatch }} />
                )}
                <div className="num text-[15px] font-semibold leading-tight text-paper">{h.value}</div>
              </div>
              <div className="mt-0.5 text-[9px] uppercase tracking-eyebrow text-mute-3">{h.meta}</div>
            </div>
          ))}
        </div>
      </header>

      {/* ———————— MID: kicker + watch photo + dark plaque ———————— */}
      <div className="relative flex min-h-0 flex-1 flex-col">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-eyebrow text-mute-2">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            <span>
              Top <span className="num text-gold">{String(idx + 1).padStart(2, '0')}</span>
              <span className="text-mute-3"> of {String(total).padStart(2, '0')}</span> · most discussed
            </span>
          </div>
        </div>

        <div className="relative mt-2 flex min-h-0 flex-1 items-center justify-center overflow-visible">
          <img
            src={watchPhoto}
            alt={`${w.brand} ${w.model}`}
            className="h-full max-h-[520px] w-auto object-contain drop-shadow-[0_40px_50px_rgba(0,0,0,0.55)]"
          />

          {/* dark plaque overlapping watch, lower-left */}
          <div
            className="pointer-events-none absolute bottom-2 left-0 w-[188px] rounded-sm border border-white/10 px-3.5 py-3 text-paper backdrop-blur-md"
            style={{ background: 'rgba(14,8,4,0.85)', boxShadow: '0 24px 50px rgba(0,0,0,0.5)' }}
          >
            <div className="flex items-center justify-between">
              <span className="text-[8px] font-semibold uppercase tracking-eyebrow text-mute-2">Spec</span>
              <span className="rounded-sm bg-gold px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-eyebrow text-ink-deep">
                Pick {String(idx + 1).padStart(2, '0')}
              </span>
            </div>
            <dl className="mt-2.5 space-y-1.5 text-[10px]">
              <div className="flex items-center justify-between gap-2">
                <dt className="text-mute-3">Dial</dt>
                <dd className="flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full border border-white/30" style={{ background: w.dialHex }} />
                  <span className="text-paper">{w.dial}</span>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-mute-3">Case</dt>
                <dd className="text-paper">
                  <span className="num">{w.caseDiameter}</span>
                  <span className="text-mute-2"> · {w.caseMaterial.split(' · ')[0]}</span>
                </dd>
              </div>
              <div className="flex items-center justify-between gap-2">
                <dt className="text-mute-3">Strap</dt>
                <dd className="truncate text-paper">{w.strap}</dd>
              </div>
            </dl>
          </div>
        </div>
      </div>

      {/* ———————— BOTTOM: name + ref + arrows + dots ———————— */}
      <footer className="mt-4 border-t border-white/10 pt-4">
        <div className="flex items-end justify-between gap-4">
          <div className="min-w-0 flex-1">
            <div className="text-[10px] font-semibold uppercase tracking-eyebrow text-gold">{w.brand}</div>
            <h3 className="mt-1 text-[24px] font-light leading-[1.1] text-paper">{w.model}</h3>
            <div className="mt-2 flex items-center gap-2 text-[11px]">
              <span className="num tabular-nums text-mute-2">{w.reference}</span>
              <span className="h-1 w-1 rounded-full bg-mute-3" />
              <span className="num font-semibold text-paper">{fmtPrice(w.priceUsd)}</span>
            </div>
          </div>
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-paper transition hover:border-gold hover:bg-gold hover:text-ink-deep"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-paper transition hover:border-gold hover:bg-gold hover:text-ink-deep"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-1">
          {topWatches.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setIdx(i)}
              className={`h-[2px] flex-1 rounded-full transition-colors ${i === idx ? 'bg-gold' : 'bg-white/15 hover:bg-white/30'}`}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </footer>
    </div>
  )
}
