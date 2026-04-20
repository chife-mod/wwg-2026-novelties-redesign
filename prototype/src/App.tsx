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
import WatchStage from './components/WatchStage'
import V2RightGrid from './components/V2RightGrid'
import { brands, collections, TOTAL_BRANDS, TOTAL_COLLECTIONS } from './data'

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
    <section className="relative isolate overflow-hidden text-paper" style={{ background: '#1F140C' }}>
      <FairBackdrop />
      {/* top meta strip: LIVE, Geneva */}
      <div className="pointer-events-none absolute left-0 right-0 top-0 z-20">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between px-8 pt-6">
          <div className="flex items-center gap-2">
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
          <div className="rounded-full border border-white/10 bg-ink-deep/60 px-3 py-1.5 text-[10px] uppercase tracking-eyebrow text-mute-2 backdrop-blur-sm">
            Watches &amp; Wonders 2026
          </div>
        </div>
      </div>

      <div className="relative z-10 mx-auto max-w-[1440px] px-8 pb-12 pt-20">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[340px_1fr]" style={{ minHeight: 820 }}>
          <WatchStage />
          <V2RightGrid />
        </div>
      </div>
    </section>
  )
}

function V2() {
  return (
    <>
      <V2Hero />
      <HeadlineInsights />
      <PriceCurve />
      <DialPalette />
      <DiameterRuler />
      <ByTheNumbers />
    </>
  )
}

export default function App() {
  const [version, setVersion] = useState<Version>('v2')

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target && (e.target as HTMLElement).closest('input, textarea')) return
      if (e.key === '1') setVersion('v1')
      if (e.key === '2') setVersion('v2')
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  return (
    <div className="min-h-screen bg-paper text-ink">
      <VersionSwitcher active={version} onChange={setVersion} />
      <Nav />
      {version === 'v1' ? <V1 /> : <V2 />}
      <FooterStrip />
    </div>
  )
}
