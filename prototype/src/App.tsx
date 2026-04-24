import { useEffect, useState } from 'react'
import Nav from './components/Nav'
import HeroStrip from './components/HeroStrip'
import HeadlineInsights from './components/HeadlineInsights'
import TopList from './components/TopList'
import PriceCurve from './components/PriceCurve'
import DialPalette from './components/DialPalette'
import DiameterRuler from './components/DiameterRuler'
import ByTheNumbers from './components/ByTheNumbers'
import FooterStrip from './components/FooterStrip'
import VersionSwitcher, { type Version } from './components/VersionSwitcher'
import { FairBackdrop } from './components/FairWindow'
import CollectionStage from './components/WatchStage'
import V2RightGrid from './components/V2RightGrid'
import CurrentRightGrid from './components/current/CurrentRightGrid'
import BrandsTileD from './components/current/variants/BrandsTileD'
import BrandsTileD1 from './components/current/variants/BrandsTileD1'
import {
  brands,
  collections,
  TOTAL_BRANDS,
  TOTAL_COLLECTIONS,
  TOTAL_NOVELTIES,
  TOTAL_SOURCES,
  TOTAL_COUNTRIES,
  HERO_DELTAS,
} from './data'

/**
 * HeroDeltaPct — премиальная YoY-дельта для hero-метрик.
 *
 * Осознанно НЕ boxy-chip (как в DeltaChipPct в common.tsx и как в
 * референсе клиента — там плашка с background). Вместо этого:
 *   — тонкий триангл-глиф (7×7) + число в цвете,
 *   — цвета ярче стандартных success/error (те задизайнены под
 *     белые плитки; на dark chocolate #1F140C они тухнут).
 *     Teal #3FD3CD и salmon #FF7680 — на 2 стопа светлее токенов,
 *     читаются поверх backdrop'а без фоновой подложки,
 *   — tabular-nums + leading-none + tight gap — один глазной
 *     блок вместо «число + чип».
 *
 * Итог: дельта живёт как акцентный «ассистент» у большого числа,
 * не отвлекая и не ломая editorial-ритм.
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

/**
 * HeroStat — одна колонка верхней meta-сетки hero (4 штуки в ряд).
 * Большое число + inline дельта справа сверху (items-start, чтобы
 * дельта прибивалась к cap-height цифры) + подпись внизу.
 * Левая hairline граница border-l — визуальный разделитель колонок.
 */
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

function V1() {
  return (
    <>
      <HeroStrip />
      <HeadlineInsights />
      <section className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 px-8 py-12 lg:grid-cols-2">
        <TopList kicker="Maisons" title="Top brands at the fair" items={brands} total={TOTAL_BRANDS} variant="brand" />
        <TopList kicker="Lines"   title="Top collections"       items={collections} total={TOTAL_COLLECTIONS} variant="collection" />
      </section>
      <PriceCurve />
      <DialPalette />
      <DiameterRuler />
      <ByTheNumbers />
    </>
  )
}

function V2Hero() {
  return (
    <section className="relative text-paper" style={{ background: '#1F140C' }}>
      {/* ambient backdrop pinned to first viewport */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[100vh] overflow-hidden">
        <FairBackdrop />
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-8">
        {/* top meta strip */}
        <div className="flex flex-wrap items-center gap-2 pt-6">
          <div className="flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-error opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-error" />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-eyebrow">Watches &amp; Wonders Live</span>
          </div>
          <div className="rounded-full bg-black/40 px-3 py-1.5 text-[10px] uppercase tracking-eyebrow backdrop-blur-sm">Geneva</div>
          <div className="rounded-full bg-black/40 px-3 py-1.5 text-[10px] uppercase tracking-eyebrow backdrop-blur-sm">April 2026</div>
          <div className="rounded-full bg-black/40 px-3 py-1.5 text-[10px] uppercase tracking-eyebrow backdrop-blur-sm">Day 2 of 5</div>
        </div>

        {/* H1 + totals in one row */}
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

        {/* main grid — sticky left + scrolling right */}
        <div className="grid grid-cols-1 gap-10 pb-20 lg:grid-cols-[440px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-20 lg:self-start" style={{ maxHeight: 'calc(100vh - 96px)' }}>
            <CollectionStage />
          </aside>
          <div className="min-w-0">
            <V2RightGrid />
          </div>
        </div>
      </div>
    </section>
  )
}

function V2() {
  return <V2Hero />
}

function CurrentHero() {
  return (
    <section className="relative text-paper" style={{ background: '#1F140C' }}>
      {/* ambient backdrop pinned to first viewport */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[100vh] overflow-hidden">
        <FairBackdrop />
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-8">
        {/* top meta strip */}
        <div className="flex flex-wrap items-center gap-2 pt-6">
          <div className="flex items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-error opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-error" />
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-eyebrow">Watches &amp; Wonders Live</span>
          </div>
          <div className="rounded-full bg-black/40 px-3 py-1.5 text-[10px] uppercase tracking-eyebrow backdrop-blur-sm">Geneva</div>
          <div className="rounded-full bg-black/40 px-3 py-1.5 text-[10px] uppercase tracking-eyebrow backdrop-blur-sm">April 2026</div>
          <div className="rounded-full bg-black/40 px-3 py-1.5 text-[10px] uppercase tracking-eyebrow backdrop-blur-sm">Day 2 of 5</div>
        </div>

        {/* H1 + totals in one row */}
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

        {/* main grid — sticky left + scrolling right */}
        <div className="grid grid-cols-1 gap-10 pb-20 lg:grid-cols-[440px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-20 lg:self-start" style={{ maxHeight: 'calc(100vh - 96px)' }}>
            <CollectionStage />
          </aside>
          <div className="min-w-0">
            <CurrentRightGrid />
          </div>
        </div>
      </div>
    </section>
  )
}

function Current() {
  return <CurrentHero />
}

// Preview-route для экспорта в Figma: ?preview=brands-d рендерит
// одну плитку BrandsTileD на тёмном фоне (чтобы shadow читалась),
// без nav/hero/switcher. Ширина колонки ≈ реальная на дашборде
// (~480 при 2-col grid и padding).
function previewFromUrl(): string | null {
  if (typeof window === 'undefined') return null
  return new URLSearchParams(window.location.search).get('preview')
}

export default function App() {
  const preview = previewFromUrl()
  if (preview === 'brands-d') {
    return (
      <div className="min-h-screen bg-ink-deep p-10">
        <div className="mx-auto" style={{ width: 480 }}>
          <BrandsTileD />
        </div>
      </div>
    )
  }
  if (preview === 'brands-d1') {
    return (
      <div className="min-h-screen bg-ink-deep p-10">
        <div className="mx-auto" style={{ width: 480 }}>
          <BrandsTileD1 />
        </div>
      </div>
    )
  }

  const [version, setVersion] = useState<Version>('current')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target && (e.target as HTMLElement).closest('input, textarea')) return
      if (e.key === '1') setVersion('current')
      if (e.key === '2') setVersion('v1')
      if (e.key === '3') setVersion('v2')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // Root bg — dark chocolate на версиях, где герой тёмный (current/v2).
  // Иначе на скролле между hero и FooterStrip'ом виден paper-seam 48px
  // (mt-12 у footer'а). На V1 (editorial page на paper) — остаётся paper.
  const rootBg = version === 'v1' ? '#EEEDEC' : '#1F140C'

  return (
    <div className="min-h-screen text-ink" style={{ background: rootBg }}>
      <VersionSwitcher active={version} onChange={setVersion} />
      <Nav />
      {version === 'v1' && <V1 />}
      {version === 'v2' && <V2 />}
      {version === 'current' && <Current />}
      <FooterStrip />
    </div>
  )
}
