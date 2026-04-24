import type { ReactElement } from 'react'
import {
  BrandsTile as BrandsTileOriginal,
  CollectionsTile,
  PriceTile,
  DialTile,
  StrapTile,
  DiameterTile,
  FunctionsTile,
  MaterialsTile,
  HeightsTile,
  MovementTile,
  EditionsTile,
} from '../V2RightGrid'
import BrandsTileA from './variants/BrandsTileA'
import BrandsTileB from './variants/BrandsTileB'
import BrandsTileD from './variants/BrandsTileD'
import BrandsTileD1 from './variants/BrandsTileD1'
import BrandsTileE from './variants/BrandsTileE'
import CollectionsTileB from './variants/CollectionsTileB'
import PriceTileB from './variants/PriceTileB'
import PriceTileC from './variants/PriceTileC'
import PriceTileD from './variants/PriceTileD'
import PriceTileE from './variants/PriceTileE'
import StrapsTileB from './variants/StrapsTileB'
import StrapsTileC from './variants/StrapsTileC'
import DialsTileB from './variants/DialsTileB'
import DialsTileC from './variants/DialsTileC'
import DialsTileD from './variants/DialsTileD'
import DialsTileE from './variants/DialsTileE'
import DialsTileF from './variants/DialsTileF'
import DiameterTileB from './variants/DiameterTileB'
import DiameterTileC from './variants/DiameterTileC'
import DiameterTileD from './variants/DiameterTileD'
import FunctionsTileB from './variants/FunctionsTileB'
import MaterialsTileB from './variants/MaterialsTileB'
import HeightsTileB from './variants/HeightsTileB'
import MovementTileB from './variants/MovementTileB'
import MovementTileC from './variants/MovementTileC'
import MovementTileD from './variants/MovementTileD'
import MovementTileE from './variants/MovementTileE'
import MovementTileF from './variants/MovementTileF'
import EditionsTileB from './variants/EditionsTileB'
import EditionsTileC from './variants/EditionsTileC'
import EditionsTileD from './variants/EditionsTileD'

export type TileVariant = {
  key: string // 'A' | 'B' | 'C' | ...
  label: string
  component: () => ReactElement
}

export type TileEntry = {
  id: string
  label: string
  kicker: string
  colSpan: 1 | 2
  variants: TileVariant[]
}

/**
 * Registry of every analytic tile on the Current grid.
 *
 * To add a new hypothesis / variant for a tile:
 *   1. Build the variant component somewhere (e.g. src/components/current/variants/BrandsTileHoneycomb.tsx)
 *   2. Push a new entry to that tile's `variants` array below: { key: 'B', label: 'Honeycomb', component: BrandsTileHoneycomb }
 *   3. On the main grid the active variant is chosen per-tile (default = first); hover arrows cycle on the tile,
 *      and clicking the tile opens the sandbox showing all variants stacked.
 */
export const TILES: TileEntry[] = [
  {
    id: 'top-brands',
    label: 'Top brands at the fair',
    kicker: 'Maisons',
    colSpan: 1,
    // Порядок в массиве = порядок в Sandbox. Новый — первым (Z-reading слева-сверху),
    // оригинал уезжает вправо-вниз. На главном дашборде variants[0] — дефолт.
    variants: [
      { key: 'D',  label: 'After · gold title, bare numbers, bigger logos', component: BrandsTileD },
      { key: 'E',  label: 'Sandbox · name+count+delta в одну строку над баром', component: BrandsTileE },
      { key: 'D₁', label: '(Large deltas) · stress-test with 3-4 digit % values', component: BrandsTileD1 },
      { key: 'C',  label: 'After · with № 01 rank numbers',                 component: BrandsTileB },
      { key: 'B',  label: 'After · Watch360 native',                        component: BrandsTileA },
      { key: 'A',  label: 'Before · original',                              component: BrandsTileOriginal },
    ],
  },
  {
    id: 'top-collections',
    label: 'Top collections',
    kicker: 'Lines',
    colSpan: 1,
    variants: [
      { key: 'B', label: 'After · gold title, brand logos, bare numbers', component: CollectionsTileB },
      { key: 'A', label: 'Before · original',                             component: CollectionsTile },
    ],
  },
  {
    id: 'price',
    label: 'Price ranges',
    kicker: 'Price',
    colSpan: 2,
    // Дефолт на морде — D (production YoY с dot+gold line техникой).
    // C — research card, B — editorial без YoY, A — оригинал.
    variants: [
      { key: 'D', label: 'After · floating tooltip above peak bar',       component: PriceTileD },
      { key: 'E', label: 'Alt · counts in dedicated row, 14px rhythm',    component: PriceTileE },
      { key: 'C', label: 'YoY techniques demo · pick a YoY approach',     component: PriceTileC },
      { key: 'B', label: 'Clean editorial — no kicker, no insight block', component: PriceTileB },
      { key: 'A', label: 'Before · original chunky bars',                 component: PriceTile },
    ],
  },
  {
    id: 'dials',
    label: 'Dial colors',
    kicker: 'Dials',
    colSpan: 1,
    variants: [
      { key: 'F', label: 'After · sausage сверху под title, list с barchart\'ами',    component: DialsTileF },
      { key: 'E', label: 'Sandbox · sausage ВНИЗУ под bar-chart\'ами',                component: DialsTileE },
      { key: 'D', label: 'Sandbox · editorial hero + sausage, no row-bars',           component: DialsTileD },
      { key: 'C', label: 'Sandbox · vertical sausage on the right',                   component: DialsTileC },
      { key: 'B', label: 'Earlier · inline sausage in header',                        component: DialsTileB },
      { key: 'A', label: 'Before · stacked bar + swatches',                           component: DialTile },
    ],
  },
  {
    id: 'straps',
    label: 'Strap materials',
    kicker: 'Straps',
    colSpan: 1,
    variants: [
      { key: 'C', label: 'After · sausage сверху под title, list с barchart\'ами', component: StrapsTileC },
      { key: 'B', label: 'Earlier · inline sausage in header',                     component: StrapsTileB },
      { key: 'A', label: 'Before · original with Leather/Bracelets insight',       component: StrapTile },
    ],
  },
  {
    id: 'diameter',
    label: 'Case diameters',
    kicker: 'On the wrist',
    colSpan: 2,
    variants: [
      { key: 'D', label: 'After · counts in dedicated row, 14px rhythm',       component: DiameterTileD },
      { key: 'C', label: 'Earlier · counts above bars (11px, collided)',       component: DiameterTileC },
      { key: 'B', label: 'Earlier · counts only in running tooltip',           component: DiameterTileB },
      { key: 'A', label: 'Before · ruler with segment insights',               component: DiameterTile },
    ],
  },
  {
    id: 'functions',
    label: 'Complications',
    kicker: 'Complications',
    colSpan: 1,
    variants: [
      { key: 'B', label: 'After · gold title, bare numbers, deltas, no insight', component: FunctionsTileB },
      { key: 'A', label: 'Before · original with editorial title',               component: FunctionsTile },
    ],
  },
  {
    id: 'materials',
    label: 'Case materials',
    kicker: 'Case metal',
    colSpan: 1,
    variants: [
      { key: 'B', label: 'After · gold title, swatch, deltas, no insight', component: MaterialsTileB },
      { key: 'A', label: 'Before · original with editorial title',         component: MaterialsTile },
    ],
  },
  {
    id: 'heights',
    label: 'Case heights',
    kicker: 'Profile',
    colSpan: 1,
    variants: [
      { key: 'B', label: 'After · gold title, bare numbers, deltas, no insight', component: HeightsTileB },
      { key: 'A', label: 'Before · original with «Slim wins the wrist»',         component: HeightsTile },
    ],
  },
  {
    id: 'movement',
    label: 'Movement functions',
    kicker: 'Movement',
    colSpan: 1,
    // F — дефолт на морде: hand-crafted 60-tick watch-face dial раскрашен
    // по долям категорий. E остаётся в sandbox'е как предыдущий приём
    // (сплошные дуги) — не удаляем, чтобы видеть эволюцию.
    variants: [
      { key: 'F', label: 'After · 60-tick dial, watch-face segmented donut',      component: MovementTileF },
      { key: 'E', label: 'Earlier · big donut, minimal legend with square chips', component: MovementTileE },
      { key: 'B', label: 'Earlier · donut 220 with barcharts in legend',          component: MovementTileB },
      { key: 'C', label: 'Sandbox · vertical sausage + big legend',               component: MovementTileC },
      { key: 'D', label: 'Sandbox · concentric Apple-Watch-style rings',          component: MovementTileD },
      { key: 'A', label: 'Before · horizontal segmented bar',                     component: MovementTile },
    ],
  },
  {
    id: 'editions',
    label: 'Special editions',
    kicker: 'Editions',
    colSpan: 2,
    // B — причёсанный A (без right-metric, gold-h3). C — референс «big
    // plates + legend» со штриховкой. На морде дефолт — B (safe cleanup);
    // после ревью решим, катим ли C.
    variants: [
      { key: 'D', label: 'After · striped plates with counts top-left',     component: EditionsTileD },
      { key: 'C', label: 'Sandbox · big striped plates + legend below',     component: EditionsTileC },
      { key: 'B', label: 'Sandbox · cleaned A, gold h3, no right-metric',   component: EditionsTileB },
      { key: 'A', label: 'Before · three cards with right-side 26% metric', component: EditionsTile },
    ],
  },
]
