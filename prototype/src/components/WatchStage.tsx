import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import tudorPhoto from '../assets/tudor-royal.webp'
import bulgariPhoto from '../assets/bulgari-serpenti.webp'
import iwcPhoto from '../assets/iwc-pilot.webp'

/**
 * CollectionStage — premium 3-slide hero slider.
 *
 * LAYOUT NOTE: фото-контейнер построен как CSS grid с одной ячейкой.
 * Все motion.img-слои (current + exiting) кладутся в ту же ячейку через
 * style={{ gridArea: '1 / 1' }} — они стекаются, а не укладываются
 * рядом. place-items-center центрирует каждый. Размер grid'а driven by
 * картинкой (intrinsic size) — чтобы не пришлось задавать явную
 * высоту, которая развалилась бы на других viewport'ах.
 *
 * ANIMATION — domino / premium easing:
 *   Фото — длинный ease-out cubic-bezier(0.22, 1, 0.36, 1), 1.3s по x,
 *   1.0s по opacity. Без spring — spring даёт оверштут, здесь он «шумит».
 *   Надпись стартует с delay 0.45s — часы к этому моменту прошли ~40% пути.
 *   Info-блок в mode="wait": сначала exit (с delay), потом enter (без).
 *   Это и есть эффект домино: дын — часы, дын — надпись.
 *
 *   Direction-aware: next → старый уходит влево, новый приходит справа.
 *
 * INTERACTIONS: click по часам → next. Arrow-стрелки → prev/next.
 * Клавиатура ←/→ когда фокус не в инпуте.
 */

type Slide = {
  brand: string
  name: string
  photo: string
}

const SLIDES: Slide[] = [
  { brand: 'Tudor',   name: 'Royal',    photo: tudorPhoto },
  { brand: 'Bulgari', name: 'Serpenti', photo: bulgariPhoto },
  { brand: 'IWC',     name: 'Pilot',    photo: iwcPhoto },
]

const EASE = [0.22, 1, 0.36, 1] as const

const photoVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
    scale: 0.97,
  }),
  // Вход задержан на 0.5s — старые часы успевают начать exit, появляется
  // короткая пауза пустоты, затем новые въезжают. Transition встроен
  // в variant, чтобы delay работал только на enter, а не на exit.
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

// Info — тайминги идентичны photoVariants: тот же delay 1.5s на enter,
// те же 4.0s/3.2s durations, тот же EASE. Амплитуда x меньше (28px вместо
// 100px) — для текста этого достаточно, иначе выглядит как отлёт.
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


// ——————————————————————————————————————— stage

export default function CollectionStage() {
  const [[idx, direction], setState] = useState<[number, number]>([0, 1])
  const [paused, setPaused] = useState(false)
  const total = SLIDES.length
  const timer = useRef<number | null>(null)
  const firstRun = useRef(true)
  const c = SLIDES[idx]

  const goTo = (nextIdx: number, dir: 1 | -1) => {
    setState([((nextIdx % total) + total) % total, dir])
  }

  const prev = () => goTo(idx - 1, -1)
  const next = () => goTo(idx + 1, 1)

  // auto-rotate: первый тик через 2.5s, чтобы пользователь сразу
  // увидел, что это слайдер, а не статичное фото. Дальше — каждые 9s.
  // Пауза на hover.
  useEffect(() => {
    if (paused) return
    const delay = firstRun.current ? 2500 : 9000
    firstRun.current = false
    timer.current = window.setTimeout(() => goTo(idx + 1, 1), delay)
    return () => {
      if (timer.current) window.clearTimeout(timer.current)
    }
  // goTo stable — deps intentionally limited to idx/paused
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, paused])

  // глобальная клавиатура: ← / → листают, если фокус не на input/textarea.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target && (e.target as HTMLElement).closest('input, textarea')) return
      // ← ключ: часы едут справа налево (motion leftward) → next()
      // → ключ: часы едут слева направо (motion rightward) → prev()
      if (e.key === 'ArrowLeft') next()
      else if (e.key === 'ArrowRight') prev()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  // prev/next are stable for this listener's lifetime per render — we
  // intentionally rebind on idx change so the latest closure is used.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx])

  return (
    <div
      className="relative flex h-full flex-col"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* huge photo — CSS grid one-cell, motion.img'ы стекаются через
          gridArea '1/1'. Clickable — клик по любой точке = next. */}
      <div
        className="relative grid min-h-0 flex-1 cursor-pointer place-items-center"
        onClick={next}
        role="button"
        tabIndex={-1}
        aria-label={`Next collection (current: ${c.brand} ${c.name})`}
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
            className="h-auto max-h-[620px] w-auto object-contain"
            alt={`${c.brand} ${c.name} — representative`}
            draggable={false}
          />
        </AnimatePresence>
      </div>

      {/* kicker below photo — items-baseline для выравнивания «Top collection»
          и «01 / 03» по одной baseline (num-класс с leading-1 иначе плыл). */}
      <div className="mt-6 flex items-baseline justify-between text-[11px] uppercase tracking-eyebrow text-mute-2">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-gold" />
          <span>Top collection</span>
        </div>
        <div className="num tabular-nums">
          <span className="text-gold">{String(idx + 1).padStart(2, '0')}</span>
          <span className="text-mute-3"> / {String(total).padStart(2, '0')}</span>
        </div>
      </div>

      {/* info block — brand eyebrow + collection name + arrows.
          Текст в grid-one-cell stacking: оба motion.div (old+new) сидят
          в одной ячейке (gridArea 1/1), поэтому ширина flex-контейнера
          не пляшет и стрелки справа не дёргаются. items-center на outer
          flex — ок, т.к. grid ячейка держит стабильную высоту (max из
          одинаковых по структуре divs = константа). */}
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
    </div>
  )
}
