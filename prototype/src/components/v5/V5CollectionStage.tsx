import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import tudorPhoto from '../../assets/tudor-royal.webp'
import bulgariPhoto from '../../assets/bulgari-serpenti.webp'
import iwcPhoto from '../../assets/iwc-pilot.webp'

/**
 * V5 left part — "Most Covered Novelties" (was "Top collection" in V3/V4).
 *
 * Layout (per Oleg 2026-04-25):
 *   1. Photo on top (with 01/10 pagination overlay in the corner of the
 *      photo zone — discreet, not a full strip).
 *   2. Below photo: "Most Covered Novelties" eyebrow.
 *   3. Brand selector dropdown — top-10 brands. Pick one → its featured
 *      model becomes the slide.
 *   4. Brand label + model name + prev/next arrows (animated info block).
 *   5. Per-model metric trio (Articles · Sources · Countries).
 *
 * "Featured model" kicker is removed (Oleg: not needed — the brand
 * dropdown above carries that semantic).
 */

type Slide = {
  brand: string
  name: string
  photo: string
  // Per-model placeholder metrics. Realistic shape — actual numbers will
  // come from W360 article-tracking once data is wired.
  articles: number
  sources: number
  countries: number
}

// Top-10 brands with one featured novelty each. Photos cycle through the
// 3 we have; brand+model strings are realistic, metrics scale roughly with
// brand prominence (top maisons get more coverage).
const SLIDES: Slide[] = [
  { brand: 'Rolex',            name: 'Datejust',              photo: tudorPhoto,   articles: 41, sources: 28, countries: 19 },
  { brand: 'Tudor',            name: 'Royal',                 photo: tudorPhoto,   articles: 25, sources: 17, countries: 12 },
  { brand: 'Patek Philippe',   name: 'Grand Complications',   photo: bulgariPhoto, articles: 22, sources: 18, countries: 13 },
  { brand: 'IWC',              name: 'Pilot',                 photo: iwcPhoto,     articles: 22, sources: 16, countries: 11 },
  { brand: 'Piaget',           name: 'Polo',                  photo: bulgariPhoto, articles: 18, sources: 13, countries: 9  },
  { brand: 'Bvlgari',          name: 'Serpenti',              photo: bulgariPhoto, articles: 17, sources: 12, countries: 8  },
  { brand: 'Chopard',          name: 'Mille Miglia',          photo: tudorPhoto,   articles: 14, sources: 10, countries: 7  },
  { brand: 'Eberhard & Co.',   name: 'Scafograf',             photo: iwcPhoto,     articles: 12, sources: 8,  countries: 5  },
  { brand: 'Hublot',           name: 'Big Bang',              photo: iwcPhoto,     articles: 12, sources: 9,  countries: 6  },
  { brand: 'Jaeger-LeCoultre', name: 'Reverso',               photo: tudorPhoto,   articles: 11, sources: 8,  countries: 6  },
]

const EASE = [0.22, 1, 0.36, 1] as const

const photoVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
    scale: 0.97,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
    transition: {
      x: { duration: 4.0, ease: EASE, delay: 1.25 },
      opacity: { duration: 3.2, ease: EASE, delay: 1.25 },
      scale: { duration: 4.0, ease: EASE, delay: 1.25 },
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -100 : 100,
    opacity: 0,
    scale: 0.97,
    transition: {
      x: { duration: 4.0, ease: EASE },
      opacity: { duration: 3.2, ease: EASE },
      scale: { duration: 4.0, ease: EASE },
    },
  }),
}

const infoVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 28 : -28,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
    transition: {
      x: { duration: 4.0, ease: EASE, delay: 1.25 },
      opacity: { duration: 3.2, ease: EASE, delay: 1.25 },
    },
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -28 : 28,
    opacity: 0,
    transition: {
      x: { duration: 4.0, ease: EASE },
      opacity: { duration: 3.2, ease: EASE },
    },
  }),
}

/**
 * AnimatedNumber — smoothly counts from previous value to new on prop change.
 * 600ms ease-out cubic via rAF. Tabular-nums on the parent prevents width jitter.
 *
 * Why not framer-motion's useTransform? — we'd need a motion.span and the
 * round-trip through MotionValue is harder to read than a 12-line rAF loop.
 */
function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(value)
  const fromRef = useRef(value)

  useEffect(() => {
    const from = fromRef.current
    const to = value
    if (from === to) return
    const start = performance.now()
    const duration = 600
    let raf = 0

    const tick = (now: number) => {
      const t = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3) // ease-out cubic
      setDisplay(Math.round(from + (to - from) * eased))
      if (t < 1) {
        raf = requestAnimationFrame(tick)
      } else {
        fromRef.current = to
      }
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [value])

  return <>{display}</>
}

function ModelStat({ value, label }: { value: number; label: string }) {
  return (
    <div className="border-l border-white/25 pl-3">
      <div className="num text-[28px] font-light leading-none text-paper tabular-nums">
        <AnimatedNumber value={value} />
      </div>
      <div className="mt-1.5 text-[10px] uppercase tracking-eyebrow text-mute-2">
        {label}
      </div>
    </div>
  )
}

export default function V5CollectionStage() {
  const [[idx, direction], setState] = useState<[number, number]>([0, 1])
  const [paused, setPaused] = useState(false)
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const total = SLIDES.length
  const timer = useRef<number | null>(null)
  const firstRun = useRef(true)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const c = SLIDES[idx]

  const goTo = (nextIdx: number, dir: 1 | -1) => {
    setState([((nextIdx % total) + total) % total, dir])
  }
  const prev = () => goTo(idx - 1, -1)
  const next = () => goTo(idx + 1, 1)

  const selectBrand = (targetIdx: number) => {
    if (targetIdx === idx) {
      setDropdownOpen(false)
      return
    }
    const dir = targetIdx > idx ? 1 : -1
    goTo(targetIdx, dir)
    setDropdownOpen(false)
  }

  // Auto-rotate (first tick 2.5s, thereafter 9s). Pause on hover.
  useEffect(() => {
    if (paused) return
    const delay = firstRun.current ? 2500 : 9000
    firstRun.current = false
    timer.current = window.setTimeout(() => goTo(idx + 1, 1), delay)
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, paused])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target && (e.target as HTMLElement).closest('input, textarea')) return
      if (e.key === 'ArrowLeft') next()
      else if (e.key === 'ArrowRight') prev()
      else if (e.key === 'Escape') setDropdownOpen(false)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx])

  // Click outside dropdown closes it.
  useEffect(() => {
    if (!dropdownOpen) return
    const onPointer = (e: PointerEvent) => {
      const node = dropdownRef.current
      if (node && e.target instanceof Node && !node.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointer)
    return () => document.removeEventListener('pointerdown', onPointer)
  }, [dropdownOpen])

  return (
    <div
      className="relative flex h-full flex-col"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Photo zone — fills the top. Pagination moved out of the corner
          (Oleg 2026-04-25: it should sit on the same baseline as the eyebrow
          below, same size). */}
      <div
        className="relative grid min-h-0 flex-1 cursor-pointer place-items-center"
        onClick={next}
        role="button"
        tabIndex={-1}
        aria-label={`Next model (current: ${c.brand} ${c.name})`}
      >
        <AnimatePresence initial={false} custom={direction}>
          <motion.img
            key={idx}
            src={c.photo}
            custom={direction}
            variants={photoVariants}
            initial="enter"
            animate="center"
            exit="exit"
            style={{ gridArea: '1 / 1' }}
            className="h-auto max-h-[520px] w-auto object-contain"
            alt={`${c.brand} ${c.name} — representative`}
            draggable={false}
          />
        </AnimatePresence>
      </div>

      {/* Below photo — eyebrow + 01/10 pagination on one line, baseline-aligned.
          Both 11px uppercase eyebrow type so they read as a single strip. */}
      <div className="mt-6 flex items-baseline justify-between text-[11px] uppercase tracking-eyebrow text-mute-2">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          <span>Most Covered Novelties</span>
        </div>
        <div className="num tabular-nums">
          <span className="text-gold">{String(idx + 1).padStart(2, '0')}</span>
          <span className="text-mute-3"> / {String(total).padStart(2, '0')}</span>
        </div>
      </div>

      {/* Brand dropdown — picks from top-10. Click toggles open/close. */}
      <div ref={dropdownRef} className="relative mt-3">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            setDropdownOpen((v) => !v)
          }}
          aria-haspopup="listbox"
          aria-expanded={dropdownOpen}
          className="flex w-full items-center justify-between rounded-sm border border-white/15 bg-black/30 px-3 py-2 text-left text-[12px] uppercase tracking-eyebrow text-paper backdrop-blur-sm transition-colors hover:border-gold/60 hover:bg-black/40"
        >
          <span className="font-semibold">{c.brand}</span>
          <svg
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            className={`text-mute-2 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`}
          >
            <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {dropdownOpen && (
          <ul
            role="listbox"
            className="absolute left-0 right-0 z-30 mt-1 max-h-[320px] overflow-y-auto rounded-sm border border-white/15 bg-ink-deep/95 py-1 shadow-xl backdrop-blur-md"
          >
            {SLIDES.map((s, i) => {
              const on = i === idx
              return (
                <li key={s.brand}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={on}
                    onClick={(e) => {
                      e.stopPropagation()
                      selectBrand(i)
                    }}
                    className={`flex w-full items-center justify-between px-3 py-2 text-left text-[12px] uppercase tracking-eyebrow transition-colors ${
                      on
                        ? 'bg-gold/15 text-gold'
                        : 'text-mute-2 hover:bg-white/5 hover:text-paper'
                    }`}
                  >
                    <span className="font-semibold">{s.brand}</span>
                    <span className="num text-[10px] tabular-nums text-mute-3">{s.name}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {/* Brand + model name + arrows (same animated info block as V3/V4) */}
      <div className="mt-4 flex items-center gap-4">
        <div className="grid min-w-0 flex-1 grid-cols-[1fr]">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={idx}
              custom={direction}
              variants={infoVariants}
              initial="enter"
              animate="center"
              exit="exit"
              style={{ gridArea: '1 / 1' }}
            >
              <div className="text-[11px] font-semibold uppercase tracking-eyebrow text-gold">{c.brand}</div>
              <div className="mt-1 truncate text-[32px] font-light leading-[1.05] text-paper">{c.name}</div>
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={next}
            aria-label="Previous"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-paper transition hover:border-gold hover:bg-gold hover:text-ink-deep"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M9 2L4 7l5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
          <button
            type="button"
            onClick={prev}
            aria-label="Next"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-paper transition hover:border-gold hover:bg-gold hover:text-ink-deep"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 2l5 5-5 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
          </button>
        </div>
      </div>

      {/* Per-model metric trio — labels and dividers stay put, only the
          numbers tween from previous → new value (AnimatedNumber inside
          ModelStat). Per Oleg 2026-04-25: smooth count-up like 20→19→18,
          not a fade in/out of the whole block. */}
      <div className="mt-6 grid grid-cols-3 gap-4">
        <ModelStat value={c.articles}  label="Articles" />
        <ModelStat value={c.sources}   label="Sources" />
        <ModelStat value={c.countries} label="Countries" />
      </div>
    </div>
  )
}
