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
import { FairBackdrop, FairWindowOverlay } from './components/FairWindow'
import TopWatchesSlider from './components/TopWatchesSlider'
import GlassStacks from './components/GlassStacks'
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
    </>
  )
}

function V2Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-ink-deep text-paper">
      <FairBackdrop />
      <FairWindowOverlay />
      <div className="relative z-10 mx-auto max-w-[1440px] px-8 py-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.35fr_1fr]" style={{ minHeight: 820 }}>
          <div className="relative flex items-center">
            <div className="w-full">
              <TopWatchesSlider />
            </div>
          </div>
          <GlassStacks />
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
      {version === 'v1' && (
        <>
          <PriceCurve />
          <DialPalette />
          <DiameterRuler />
          <ByTheNumbers />
        </>
      )}
      <FooterStrip />
    </div>
  )
}
