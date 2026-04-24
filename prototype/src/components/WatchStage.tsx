import { useEffect, useRef, useState } from 'react'
import { topCollections, TOTAL_COLLECTIONS } from '../data'
import { BrandMonogram, DeltaChip } from './common'
import watchPhoto from '../assets/iwc-pilot-chrono.png'

// ——————————————————————————————————————— modal

function ShowMoreModal({ onClose }: { onClose: () => void }) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const max = topCollections[0].count
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-8 backdrop-blur-md"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-[780px] rounded-sm bg-paper p-8 text-ink shadow-[0_40px_80px_rgba(0,0,0,0.55)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full border border-ink/15 text-ink transition hover:border-ink hover:bg-ink hover:text-paper"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" /></svg>
        </button>

        <div className="text-[11px] font-semibold uppercase tracking-eyebrow text-gold">Watches &amp; Wonders 2026</div>
        <div className="mt-2 flex items-baseline justify-between gap-8">
          <h3 className="text-[28px] font-light leading-tight text-ink">All top collections</h3>
          <div className="text-right">
            <div className="num text-[28px] font-light leading-none text-ink">{TOTAL_COLLECTIONS}</div>
            <div className="text-[10px] uppercase tracking-eyebrow text-mute-3">active lines</div>
          </div>
        </div>

        <table className="mt-6 w-full text-[12px]">
          <thead>
            <tr className="border-y border-ink/10 text-[9px] uppercase tracking-eyebrow text-mute-3">
              <th className="w-8 py-2 text-left font-medium">#</th>
              <th className="py-2 text-left font-medium">Collection</th>
              <th className="w-[180px] py-2 text-left font-medium">Share</th>
              <th className="w-14 py-2 text-right font-medium">Pieces</th>
              <th className="w-14 py-2 text-right font-medium">YoY</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink/5">
            {topCollections.map((c, i) => (
              <tr key={c.fullName} className="group">
                <td className="num py-3 text-mute-3">{String(i + 1).padStart(2, '0')}</td>
                <td className="py-3">
                  <div className="flex items-center gap-3">
                    <BrandMonogram name={c.brand} size={24} />
                    <div className="min-w-0">
                      <div className="text-[13px] font-medium text-ink">{c.name}</div>
                      <div className="text-[10px] uppercase tracking-eyebrow text-mute-3">{c.brand}</div>
                    </div>
                  </div>
                </td>
                <td className="py-3">
                  <div className="h-[3px] w-full overflow-hidden rounded-full bg-ink/5">
                    <div className="h-full rounded-full bg-gold" style={{ width: `${(c.count / max) * 100}%` }} />
                  </div>
                </td>
                <td className="num py-3 text-right tabular-nums text-ink">{c.count}</td>
                <td className="py-3 text-right"><DeltaChip delta={c.delta} /></td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-5 flex items-center justify-between text-[10px] uppercase tracking-eyebrow text-mute-3">
          <span>Source · Watch360 analytics</span>
          <a href="#" className="text-gold hover:underline">Open ranked collections →</a>
        </div>
      </div>
    </div>
  )
}

// ——————————————————————————————————————— stage

export default function CollectionStage() {
  const [idx, setIdx] = useState(0)
  const [paused, setPaused] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const total = topCollections.length
  const timer = useRef<number | null>(null)
  const c = topCollections[idx]

  useEffect(() => {
    if (paused || showModal) return
    timer.current = window.setTimeout(() => setIdx((i) => (i + 1) % total), 9000)
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  }, [idx, paused, showModal, total])

  const prev = () => setIdx((i) => (i - 1 + total) % total)
  const next = () => setIdx((i) => (i + 1) % total)

  return (
    <>
      <div
        className="relative flex h-full flex-col"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {/* huge photo — fills top */}
        <div className="relative flex min-h-0 flex-1 items-center justify-center">
          <img
            src={watchPhoto}
            alt={`${c.brand} ${c.name} — representative`}
            className="h-full max-h-[620px] w-auto object-contain drop-shadow-[0_60px_70px_rgba(0,0,0,0.65)]"
          />
        </div>

        {/* kicker below photo */}
        <div className="mt-6 flex items-center justify-between text-[11px] uppercase tracking-eyebrow text-mute-2">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-gold" />
            <span>Top collection</span>
          </div>
          <div className="num tabular-nums">
            <span className="text-gold">{String(idx + 1).padStart(2, '0')}</span>
            <span className="text-mute-3"> / {String(total).padStart(2, '0')}</span>
          </div>
        </div>

        {/* info block — logo + collection name + arrows */}
        <div className="mt-4 flex items-center gap-4">
          <BrandMonogram name={c.brand} size={40} />
          <div className="min-w-0 flex-1">
            <div className="text-[11px] font-semibold uppercase tracking-eyebrow text-gold">{c.brand}</div>
            <div className="truncate text-[22px] font-light leading-tight text-paper">{c.name}</div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-paper transition hover:border-gold hover:bg-gold hover:text-ink-deep"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-paper transition hover:border-gold hover:bg-gold hover:text-ink-deep"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </button>
          </div>
        </div>

        {/* show all — subtle link */}
        <button
          type="button"
          onClick={() => setShowModal(true)}
          className="mt-4 self-start text-[10px] font-semibold uppercase tracking-eyebrow text-gold transition hover:text-gold-light"
        >
          View all {TOTAL_COLLECTIONS} →
        </button>
      </div>

      {showModal && <ShowMoreModal onClose={() => setShowModal(false)} />}
    </>
  )
}
