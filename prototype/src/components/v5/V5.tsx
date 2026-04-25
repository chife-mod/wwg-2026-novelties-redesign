import {
  TOTAL_BRANDS,
  TOTAL_COUNTRIES,
  TOTAL_NOVELTIES,
  TOTAL_SOURCES,
  HERO_DELTAS,
} from '../../data'
import { FairBackdrop } from '../FairWindow'
import ViewModeToggle from '../ViewModeToggle'
import V5CollectionStage from './V5CollectionStage'
import V5RightGrid from './V5RightGrid'

/**
 * V5 — V3's hero + tile grid, with three V5-specific changes:
 *   1. Right-grid: Price slot swapped for MarketMap (V5RightGrid).
 *   2. Left-side: V5CollectionStage replaces V3/V4's CollectionStage —
 *      brand selector tabs, repositioned pagination, per-model metric trio.
 *   3. ViewModeToggle (Count/%) restored 2026-04-25 — Oleg explicitly didn't
 *      ask for it to be hidden; my earlier read was wrong.
 *
 * No "V5" indicator chip in the meta strip — version-labels live in the
 * top VersionSwitcher only, never in the editorial canvas.
 */

function HeroDeltaPct({ pct }: { pct: number }) {
  const up = pct > 0
  const flat = pct === 0
  const color = up
    ? 'text-[#3FD3CD]'
    : flat
    ? 'text-mute-2'
    : 'text-[#FF7680]'
  const sign = up ? '+' : ''
  return (
    <span
      className={`num inline-flex items-center gap-[3px] text-[12px] font-medium leading-none tabular-nums ${color}`}
    >
      {!flat && (
        <svg width="7" height="7" viewBox="0 0 7 7" aria-hidden>
          {up ? (
            <path d="M3.5 0.5 L6.5 5.5 L0.5 5.5 Z" fill="currentColor" />
          ) : (
            <path d="M3.5 6.5 L6.5 1.5 L0.5 1.5 Z" fill="currentColor" />
          )}
        </svg>
      )}
      <span>
        {sign}
        {pct}%
      </span>
    </span>
  )
}

function HeroStat({
  value,
  label,
  delta,
}: {
  value: number
  label: string
  delta?: number
}) {
  return (
    <div className="border-l border-white/25 pl-4">
      <div className="flex items-start gap-[6px]">
        <div className="num text-[44px] font-light leading-none text-paper">{value}</div>
        {delta !== undefined && (
          <div className="-mt-[2px]">
            <HeroDeltaPct pct={delta} />
          </div>
        )}
      </div>
      <div className="mt-2 text-[11px] uppercase tracking-eyebrow text-mute-2">{label}</div>
    </div>
  )
}

export default function V5() {
  return (
    <section className="relative text-paper" style={{ background: '#1F140C' }}>
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[100vh] overflow-hidden">
        <FairBackdrop />
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-8">
        <div className="grid grid-cols-1 items-center gap-10 pt-6 lg:grid-cols-[440px_minmax(0,1fr)]">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-error opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-error" />
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-eyebrow">Watches &amp; Wonders Live</span>
            </div>
            <div className="rounded-full bg-black/40 px-3 py-1.5 text-[10px] uppercase tracking-eyebrow backdrop-blur-sm">Geneva</div>
            <div className="rounded-full bg-black/40 px-3 py-1.5 text-[10px] uppercase tracking-eyebrow backdrop-blur-sm">April 2026</div>
          </div>
          <div className="flex justify-start lg:justify-end">
            <ViewModeToggle />
          </div>
        </div>

        <div className="grid grid-cols-1 items-end gap-10 pb-6 pt-6 lg:grid-cols-[440px_minmax(0,1fr)]">
          <h1 className="text-[72px] font-light leading-[0.94] tracking-tight text-paper md:text-[96px]">
            Novelties
          </h1>
          <div className="grid grid-cols-4 gap-6">
            <HeroStat value={TOTAL_BRANDS} label="Brands" delta={HERO_DELTAS.brands} />
            <HeroStat value={TOTAL_NOVELTIES} label="Novelties presented" delta={HERO_DELTAS.novelties} />
            <HeroStat value={TOTAL_SOURCES} label="Sources" delta={HERO_DELTAS.sources} />
            <HeroStat value={TOTAL_COUNTRIES} label="Countries" delta={HERO_DELTAS.countries} />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-10 pb-20 lg:grid-cols-[440px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-20 lg:self-start" style={{ maxHeight: 'calc(100vh - 96px)' }}>
            <V5CollectionStage />
          </aside>
          <div className="min-w-0">
            <V5RightGrid />
          </div>
        </div>
      </div>
    </section>
  )
}
