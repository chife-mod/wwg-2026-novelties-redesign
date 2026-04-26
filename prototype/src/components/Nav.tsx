import { useEffect, useRef, useState } from 'react'
import type { Version } from './VersionSwitcher'

const VERSIONS: Version[] = ['v5', 'v4', 'v3', 'v2', 'v1']

/**
 * Top navigation.
 *
 * - Hosts prototype version dropdown (replaces old VersionSwitcher strip).
 * - Auto-hide on scroll (Oleg 2026-04-26): scroll down → header slides up
 *   off-screen; smallest upward scroll → it slides back in. Same idiom as
 *   Linear/Notion. Always visible at the very top of the page.
 *
 * `fixed` instead of `sticky` so the slide-up doesn't shift document flow.
 * App.tsx adds a 64px spacer to compensate for the lost reserved space.
 */
export default function Nav({
  version,
  onVersionChange,
}: {
  version: Version
  onVersionChange: (v: Version) => void
}) {
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const lastY = useRef(0)

  // Scroll-direction listener: hide on scroll-down, reveal on scroll-up.
  // Hysteresis (5px down, 2px up) prevents jitter at sub-frame movements.
  // Always visible when within 10px of the top.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY
      if (y < 10) {
        setHidden(false)
      } else if (y > lastY.current + 5) {
        setHidden(true)
      } else if (y < lastY.current - 2) {
        setHidden(false)
      }
      lastY.current = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Click-outside / Escape closes the dropdown.
  useEffect(() => {
    if (!open) return
    const onPointer = (e: PointerEvent) => {
      const node = ref.current
      if (node && e.target instanceof Node && !node.contains(e.target)) {
        setOpen(false)
      }
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <header
      className={`fixed left-0 right-0 top-0 z-30 border-b border-ink/10 bg-paper/80 backdrop-blur transition-transform duration-300 ease-out ${
        hidden ? '-translate-y-full' : 'translate-y-0'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-8">
        <a href="/" className="flex items-center">
          <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="Watch360" className="h-8 w-auto" />
        </a>
        <nav className="hidden items-center gap-8 text-[13px] font-medium uppercase tracking-eyebrow text-ink md:flex">
          <a href="#" className="hover:text-gold">Brands</a>
          <a href="#" className="hover:text-gold">Watches</a>
          <a href="#" className="hover:text-gold">Novelties</a>
          <a href="#" className="hover:text-gold">Retailers</a>
          <a href="#" className="text-gold">Fairs</a>
          <a href="#" className="hover:text-gold">Explore</a>
        </nav>
        <div className="flex items-center gap-3">
          {/* Prototype version selector — small dropdown anchored to nav.
              `Prototype` eyebrow on the left signals it's not a real product
              entry, just a demo affordance for switching variants. */}
          <div ref={ref} className="relative">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-haspopup="listbox"
              aria-expanded={open}
              className="num flex items-center gap-1.5 rounded-sm border border-ink/15 bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-eyebrow text-ink transition-colors hover:border-gold/60 hover:text-gold"
              title="Prototype variant"
            >
              <span className="text-mute-3">Prototype</span>
              <span className="text-gold">{version.toUpperCase()}</span>
              <svg
                width="9"
                height="9"
                viewBox="0 0 10 10"
                fill="none"
                className={`text-mute-3 transition-transform ${open ? 'rotate-180' : ''}`}
              >
                <path d="M2 4l3 3 3-3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            {open && (
              <ul
                role="listbox"
                className="absolute right-0 top-full z-40 mt-1 min-w-[120px] overflow-hidden rounded-sm border border-ink/15 bg-white py-1 shadow-lg"
              >
                {VERSIONS.map((v) => {
                  const on = v === version
                  return (
                    <li key={v}>
                      <button
                        type="button"
                        role="option"
                        aria-selected={on}
                        onClick={() => {
                          onVersionChange(v)
                          setOpen(false)
                        }}
                        className={`num flex w-full items-center px-3 py-1.5 text-left text-[12px] font-semibold uppercase tracking-eyebrow transition-colors ${
                          on
                            ? 'bg-gold/15 text-gold'
                            : 'text-ink hover:bg-ink/5 hover:text-gold'
                        }`}
                      >
                        {v.toUpperCase()}
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
          <a href="#" className="hidden text-[12px] font-medium uppercase tracking-eyebrow text-ink hover:text-gold md:inline">Log in</a>
          <a href="#" className="rounded-sm bg-ink-deep px-4 py-2 text-[12px] font-medium uppercase tracking-eyebrow text-paper hover:bg-ink">Get started</a>
        </div>
      </div>
    </header>
  )
}
