// WWG 2026 Novelties — data
// Values sourced from original watch360 page screenshots. Where exact numbers
// are blurred, plausible fills keep distribution shape intact. Values are for
// prototype purposes and are not guaranteed to be exact.

export const TOTAL_NOVELTIES = 478
export const TOTAL_BRANDS = 61
export const TOTAL_COLLECTIONS = 119

export type Ranked = { name: string; count: number; delta?: number }

// Brands — top 10 of 61
export const brands: Ranked[] = [
  { name: 'Rolex', count: 58, delta: +8 },
  { name: 'Tudor', count: 31, delta: +4 },
  { name: 'Patek Philippe', count: 22, delta: -2 },
  { name: 'IWC', count: 19, delta: +1 },
  { name: 'Piaget', count: 18, delta: +3 },
  { name: 'Bvlgari', count: 17, delta: +2 },
  { name: 'Chopard', count: 14, delta: 0 },
  { name: 'Eberhard & Co.', count: 12, delta: -1 },
  { name: 'Hublot', count: 12, delta: +2 },
  { name: 'Jaeger-LeCoultre', count: 11, delta: -3 },
]

// Collections — top 10 of 119
export const collections: Ranked[] = [
  { name: 'Rolex Datejust', count: 41, delta: +12 },
  { name: 'Tudor Royal', count: 23, delta: +5 },
  { name: 'Bulgari Serpenti', count: 12, delta: +1 },
  { name: 'Eberhard & Co. Scafograf', count: 12, delta: -1 },
  { name: 'Hublot Big Bang', count: 12, delta: 0 },
  { name: 'Piaget Polo', count: 11, delta: +3 },
  { name: 'Rolex Oyster Perpetual', count: 11, delta: +2 },
  { name: 'Patek Philippe Grand Compl.', count: 9, delta: -4 },
  { name: 'Chanel J12', count: 8, delta: +1 },
  { name: 'Cartier Roadster', count: 7, delta: +2 },
]

// Price ranges — 11 buckets. Order is low→high (not by size).
export type PriceBucket = { label: string; short: string; count: number }
export const prices: PriceBucket[] = [
  { label: 'under $1K',           short: '<$1K',      count: 3 },
  { label: '$1,000 – $2,500',     short: '$1–2.5K',   count: 11 },
  { label: '$2,500 – $5,000',     short: '$2.5–5K',   count: 34 },
  { label: '$5,000 – $10,000',    short: '$5–10K',    count: 75 },
  { label: '$10,000 – $25,000',   short: '$10–25K',   count: 102 },
  { label: '$25,000 – $50,000',   short: '$25–50K',   count: 67 },
  { label: '$50,000 – $100,000',  short: '$50–100K',  count: 44 },
  { label: '$100,000 – $250,000', short: '$100–250K', count: 27 },
  { label: '$250,000 – $500,000', short: '$250–500K', count: 9 },
  { label: '$500,000 – $1M',      short: '$500K–1M',  count: 4 },
  { label: 'over $1M',            short: '>$1M',      count: 2 },
]

// Dial colors — with actual swatch colors
export type DialColor = { name: string; count: number; hex: string; ring?: string }
export const dialColors: DialColor[] = [
  { name: 'Blue',     count: 105, hex: '#1F3F8A' },
  { name: 'Black',    count: 56,  hex: '#111111' },
  { name: 'White',    count: 48,  hex: '#F4F2EE', ring: '#C6C6C6' },
  { name: 'Skeleton', count: 39,  hex: 'url(#skeleton)' },
  { name: 'Grey',     count: 37,  hex: '#878787' },
  { name: 'Green',    count: 26,  hex: '#1F4E33' },
  { name: 'Silver',   count: 24,  hex: '#D4D4D4', ring: '#B5B5B5' },
  { name: 'Brown',    count: 18,  hex: '#5E3A1F' },
  { name: 'Beige',    count: 15,  hex: '#D7C2A1' },
  { name: 'Pink',     count: 10,  hex: '#E3B7BD' },
]

// Case diameters — top 10 of 25, as ruler bars mm → count
export type Diameter = { mm: number; count: number }
export const diameters: Diameter[] = [
  { mm: 28, count: 16 },
  { mm: 30, count: 10 },
  { mm: 32, count: 4 },
  { mm: 34, count: 6 },
  { mm: 35, count: 8 },
  { mm: 36, count: 58 },
  { mm: 37, count: 12 },
  { mm: 38, count: 27 },
  { mm: 39, count: 62 },
  { mm: 40, count: 51 },
  { mm: 41, count: 55 },
  { mm: 42, count: 40 },
  { mm: 43, count: 9 },
  { mm: 44, count: 20 },
  { mm: 45, count: 7 },
  { mm: 46, count: 4 },
  { mm: 47, count: 2 },
  { mm: 48, count: 2 },
  { mm: 50, count: 1 },
]

// Tier 3 — compact facets
export const caseMaterials: Ranked[] = [
  { name: 'Stainless Steel', count: 193 },
  { name: 'Titanium', count: 56 },
  { name: 'Rose Gold', count: 53 },
  { name: 'White Gold', count: 35 },
  { name: 'Ceramic', count: 24 },
  { name: 'Yellow Gold', count: 22 },
  { name: 'Platinum', count: 15 },
  { name: 'Carbon', count: 10 },
  { name: 'Red Gold', count: 6 },
  { name: 'Gold', count: 4 },
]

export const functions: Ranked[] = [
  { name: 'Date', count: 210 },
  { name: 'Sweeping Seconds', count: 156 },
  { name: 'Hacking Seconds', count: 48 },
  { name: 'Moon Phase', count: 18 },
  { name: 'Chronograph', count: 16 },
  { name: 'Power Reserve Indicator', count: 16 },
  { name: 'Day/Night Indicator', count: 13 },
  { name: 'Tourbillon', count: 11 },
  { name: 'Flyback Chronograph', count: 7 },
  { name: 'Calendar', count: 6 },
]

export const strapTypes: Ranked[] = [
  { name: 'Stainless Steel', count: 133 },
  { name: 'Alligator', count: 76 },
  { name: 'Rubber', count: 59 },
  { name: 'Leather', count: 45 },
  { name: 'Calfskin', count: 25 },
  { name: 'Titanium', count: 23 },
  { name: 'Rose Gold', count: 19 },
  { name: 'Gold', count: 16 },
  { name: 'Ceramic', count: 12 },
  { name: 'Composite', count: 9 },
]

export const caseHeights: Ranked[] = [
  { name: '7 mm', count: 106 },
  { name: '8 mm', count: 50 },
  { name: '11 mm', count: 42 },
  { name: '9 mm', count: 40 },
  { name: '10 mm', count: 39 },
  { name: '12 mm', count: 35 },
  { name: '14 mm', count: 29 },
  { name: '13 mm', count: 27 },
  { name: '6 mm', count: 13 },
]

export const movements: Ranked[] = [
  { name: 'Automatic', count: 302 },
  { name: 'Manual', count: 124 },
  { name: 'Quartz', count: 52 },
]

export const editions: Ranked[] = [
  { name: 'Limited Edition', count: 89 },
  { name: 'Anniversary Edition', count: 24 },
  { name: 'Partnership Edition', count: 11 },
]

// Top 10 models — for V2 FairWindow slider.
// All values are plausible placeholders (model, reference, price) — not authoritative.
export type TopWatch = {
  brand: string
  collection: string
  model: string
  reference: string
  priceUsd: number
  dial: string
  dialHex: string
  caseMaterial: string
  caseDiameter: string
  strap: string
  movement: string
}
export const topWatches: TopWatch[] = [
  {
    brand: 'Rolex',
    collection: 'Datejust',
    model: 'Datejust 41 "Azzurro"',
    reference: '126334-0033',
    priceUsd: 11200,
    dial: 'Azzurro Blue',
    dialHex: '#1F3F8A',
    caseMaterial: 'Oystersteel · White Gold bezel',
    caseDiameter: '41 mm',
    strap: 'Jubilee bracelet',
    movement: 'Automatic',
  },
  {
    brand: 'Patek Philippe',
    collection: 'Calatrava',
    model: 'Calatrava 5227G Salmon',
    reference: '5227G-010',
    priceUsd: 42800,
    dial: 'Salmon',
    dialHex: '#D78A63',
    caseMaterial: 'White Gold',
    caseDiameter: '39 mm',
    strap: 'Alligator',
    movement: 'Automatic',
  },
  {
    brand: 'Tudor',
    collection: 'Royal',
    model: 'Royal Chronograph 41',
    reference: '28700-0003',
    priceUsd: 5900,
    dial: 'Anthracite',
    dialHex: '#2D2D2F',
    caseMaterial: 'Stainless Steel',
    caseDiameter: '41 mm',
    strap: 'Steel bracelet',
    movement: 'Automatic',
  },
  {
    brand: 'IWC',
    collection: 'Portugieser',
    model: 'Portugieser Automatic 42',
    reference: 'IW501720',
    priceUsd: 14100,
    dial: 'Horizon Blue',
    dialHex: '#1F3F8A',
    caseMaterial: 'Stainless Steel',
    caseDiameter: '42 mm',
    strap: 'Alligator',
    movement: 'Automatic · 7-day reserve',
  },
  {
    brand: 'Piaget',
    collection: 'Polo',
    model: 'Polo Date 42',
    reference: 'G0A49007',
    priceUsd: 12800,
    dial: 'Horizon Blue',
    dialHex: '#1F3F8A',
    caseMaterial: 'Stainless Steel',
    caseDiameter: '42 mm',
    strap: 'Steel bracelet',
    movement: 'Automatic',
  },
  {
    brand: 'Bulgari',
    collection: 'Serpenti',
    model: 'Serpenti Seduttori 33',
    reference: '103450',
    priceUsd: 24500,
    dial: 'Silver',
    dialHex: '#D4D4D4',
    caseMaterial: 'Rose Gold',
    caseDiameter: '33 mm',
    strap: 'Gold bracelet',
    movement: 'Quartz',
  },
  {
    brand: 'Chopard',
    collection: 'L.U.C',
    model: 'L.U.C XPS 1860 Salmon',
    reference: '161946-5001',
    priceUsd: 27400,
    dial: 'Salmon',
    dialHex: '#D78A63',
    caseMaterial: 'Rose Gold',
    caseDiameter: '40 mm',
    strap: 'Alligator',
    movement: 'Automatic · ultra-thin',
  },
  {
    brand: 'Hublot',
    collection: 'Big Bang',
    model: 'Big Bang Unico 42',
    reference: '441.NM.1170.RX',
    priceUsd: 21300,
    dial: 'Matte Black',
    dialHex: '#111111',
    caseMaterial: 'Titanium',
    caseDiameter: '42 mm',
    strap: 'Rubber',
    movement: 'Automatic chronograph',
  },
  {
    brand: 'Jaeger-LeCoultre',
    collection: 'Reverso',
    model: 'Reverso Classic Duo',
    reference: 'Q2788520',
    priceUsd: 10400,
    dial: 'Silver Guilloché',
    dialHex: '#D4D4D4',
    caseMaterial: 'Stainless Steel',
    caseDiameter: '45.6 × 27.4 mm',
    strap: 'Alligator',
    movement: 'Automatic',
  },
  {
    brand: 'Eberhard & Co.',
    collection: 'Scafograf',
    model: 'Scafograf 300 Azzurro',
    reference: '41034.01',
    priceUsd: 4200,
    dial: 'Mediterranean Blue',
    dialHex: '#1F3F8A',
    caseMaterial: 'Stainless Steel',
    caseDiameter: '43 mm',
    strap: 'Rubber',
    movement: 'Automatic · 300 m',
  },
]

// Headline insights — derived "so what" cards
export const insights = [
  { big: '105',   unit: 'novelties',       headline: 'Blue is the colour of 2026',     sub: '22% of the fair — twice as many as black.' },
  { big: '$10–25K', unit: 'price sweet spot', headline: 'The mid-luxury tier dominates', sub: '102 novelties in one bucket — 21% of the release.' },
  { big: '39 mm', unit: 'case diameter',    headline: 'Smaller is settling in',         sub: 'Peak at 39 mm, 64% of novelties under 41 mm.' },
  { big: '58',    unit: 'by Rolex',         headline: 'Rolex leads with a near 2× gap', sub: 'Tudor follows at 31. Top-3 = 23% of all novelties.' },
  { big: '40%',   unit: 'stainless steel',  headline: 'Steel is still the default',     sub: '193 cases in steel vs 165 across all gold variants.' },
]
