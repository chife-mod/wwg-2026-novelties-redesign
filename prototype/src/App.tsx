import Nav from './components/Nav'
import HeroStrip from './components/HeroStrip'
import HeadlineInsights from './components/HeadlineInsights'
import TopList from './components/TopList'
import PriceCurve from './components/PriceCurve'
import DialPalette from './components/DialPalette'
import DiameterRuler from './components/DiameterRuler'
import ByTheNumbers from './components/ByTheNumbers'
import FooterStrip from './components/FooterStrip'
import { brands, collections, TOTAL_BRANDS, TOTAL_COLLECTIONS } from './data'

export default function App() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Nav />
      <HeroStrip />
      <HeadlineInsights />
      <section className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 px-8 py-12 lg:grid-cols-2">
        <TopList kicker="Maisons" title="Top brands at the fair" items={brands} total={TOTAL_BRANDS} variant="brand" />
        <TopList kicker="Lines" title="Top collections" items={collections} total={TOTAL_COLLECTIONS} variant="collection" />
      </section>
      <PriceCurve />
      <DialPalette />
      <DiameterRuler />
      <ByTheNumbers />
      <FooterStrip />
    </div>
  )
}
