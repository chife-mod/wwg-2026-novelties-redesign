import { TOTAL_NOVELTIES, TOTAL_BRANDS, TOTAL_COLLECTIONS } from '../data'

/**
 * Ambient backdrop for V2 hero. Simulates fair-hall imagery with layered
 * radial gradients (warm stage lights) and a slow drift animation. When real
 * footage is available, this block gets replaced with a <video> element.
 */
export function FairBackdrop() {
  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* base scene — dark chocolate */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(160deg, #2A1C12 0%, #3A2618 38%, #1F140C 72%, #0F0906 100%)',
        }}
      />
      {/* warm stage pool */}
      <div
        className="absolute -top-24 left-[10%] h-[70%] w-[60%] rounded-full opacity-70 blur-3xl"
        style={{
          background:
            'radial-gradient(closest-side, rgba(212,158,100,0.40), rgba(212,158,100,0.08) 60%, transparent 100%)',
        }}
      />
      {/* second warm pool, lower-right */}
      <div
        className="absolute bottom-0 right-[6%] h-[55%] w-[45%] rounded-full opacity-40 blur-3xl"
        style={{
          background:
            'radial-gradient(closest-side, rgba(169,129,85,0.35), rgba(139,99,55,0.08) 55%, transparent 100%)',
        }}
      />
      {/* vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 40%, rgba(10,10,8,0.75) 100%)',
        }}
      />
      {/* grain */}
      <div
        className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
        style={{
          backgroundImage:
            'url("data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22120%22 height=%22120%22><filter id=%22n%22><feTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%222%22/></filter><rect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23n)%22 opacity=%220.5%22/></svg>")',
        }}
      />
      {/* Bottom fade-to-section. Нижний край backdrop'а (gradient уходит
          в #0F0906, плюс vignette) был заметно темнее, чем plain-фон
          секции #1F140C ниже 100vh — отсюда горизонтальный стык. Этот
          слой плавно переводит нижние ~45% backdrop'а в точно тот же
          #1F140C, поверх всех остальных слоёв. Стык становится
          градиентным переходом, который глаз не замечает. */}
      <div
        className="absolute inset-x-0 bottom-0 h-[45%]"
        style={{
          background:
            'linear-gradient(to bottom, rgba(31,20,12,0) 0%, rgba(31,20,12,0.6) 55%, #1F140C 100%)',
        }}
      />
    </div>
  )
}

export function FairWindowOverlay() {
  return (
    <div className="pointer-events-none absolute inset-0 z-20">
      {/* top-left: LIVE + location */}
      <div className="absolute left-6 top-6 flex items-center gap-2">
        <div className="flex items-center gap-2 rounded-full bg-ink-deep/85 px-3 py-1.5 backdrop-blur-sm">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-error opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-error" />
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-eyebrow text-paper">Live</span>
        </div>
        <div className="rounded-full bg-ink-deep/85 px-3 py-1.5 text-[10px] uppercase tracking-eyebrow text-paper backdrop-blur-sm">
          Geneva · Hall 1
        </div>
        <div className="rounded-full bg-ink-deep/85 px-3 py-1.5 text-[10px] uppercase tracking-eyebrow text-paper backdrop-blur-sm">
          Day 2 of 5
        </div>
      </div>

      {/* top-right: date */}
      <div className="absolute right-6 top-6">
        <div className="rounded-full border border-white/10 bg-ink-deep/60 px-3 py-1.5 text-[10px] uppercase tracking-eyebrow text-mute-2 backdrop-blur-sm">
          Watches &amp; Wonders 2026
        </div>
      </div>

      {/* bottom-left: anchor big number */}
      <div className="absolute bottom-8 left-8">
        <div className="flex items-end gap-6">
          <div>
            <div className="text-[10px] uppercase tracking-eyebrow text-gold">Novelties on show</div>
            <div className="num mt-1 text-[120px] font-light leading-[0.9] text-paper">{TOTAL_NOVELTIES}</div>
          </div>
          <div className="mb-3 border-l border-white/15 pl-6">
            <div className="flex items-baseline gap-2">
              <span className="num font-semibold text-paper">{TOTAL_BRANDS}</span>
              <span className="text-[10px] uppercase tracking-eyebrow text-mute-2">brands</span>
            </div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="num font-semibold text-paper">{TOTAL_COLLECTIONS}</span>
              <span className="text-[10px] uppercase tracking-eyebrow text-mute-2">collections</span>
            </div>
          </div>
        </div>
      </div>

      {/* bottom-right: video placeholder hint */}
      <div className="absolute bottom-6 right-6 flex items-center gap-2 text-[10px] uppercase tracking-eyebrow text-mute-3">
        <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
          <rect x="0.5" y="1.5" width="9" height="7" rx="1" stroke="currentColor" />
          <path d="M4 3.5l2.5 1.5L4 6.5v-3z" fill="currentColor" />
        </svg>
        Video feed · placeholder
      </div>
    </div>
  )
}
