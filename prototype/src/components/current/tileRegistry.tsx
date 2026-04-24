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
import CollectionsTileB from './variants/CollectionsTileB'
import PriceTileB from './variants/PriceTileB'
import PriceTileC from './variants/PriceTileC'
import PriceTileD from './variants/PriceTileD'

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
      { key: 'D₁', label: 'Stress · large deltas with % suffix',            component: BrandsTileD1 },
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
      { key: 'D', label: 'After · YoY dot marker + gold hairline',        component: PriceTileD },
      { key: 'C', label: 'YoY techniques demo · pick a YoY approach',     component: PriceTileC },
      { key: 'B', label: 'Clean editorial — no kicker, no insight block', component: PriceTileB },
      { key: 'A', label: 'Before · original chunky bars',                 component: PriceTile },
    ],
  },
  {
    id: 'dials',
    label: 'Colour of the year',
    kicker: 'Dials',
    colSpan: 1,
    variants: [{ key: 'A', label: 'Stacked bar + swatches', component: DialTile }],
  },
  {
    id: 'straps',
    label: 'What hugs the wrist',
    kicker: 'Straps',
    colSpan: 1,
    variants: [{ key: 'A', label: 'Ranked list', component: StrapTile }],
  },
  {
    id: 'diameter',
    label: 'The year of 39 mm',
    kicker: 'On the wrist',
    colSpan: 2,
    variants: [{ key: 'A', label: 'Histogram', component: DiameterTile }],
  },
  {
    id: 'functions',
    label: 'What the movement does',
    kicker: 'Complications',
    colSpan: 1,
    variants: [{ key: 'A', label: 'Ranked list', component: FunctionsTile }],
  },
  {
    id: 'materials',
    label: 'The case material mix',
    kicker: 'Case metal',
    colSpan: 1,
    variants: [{ key: 'A', label: 'Ranked list', component: MaterialsTile }],
  },
  {
    id: 'heights',
    label: 'Slim wins the wrist',
    kicker: 'Profile',
    colSpan: 1,
    variants: [{ key: 'A', label: 'Ranked list', component: HeightsTile }],
  },
  {
    id: 'movement',
    label: 'How they tick',
    kicker: 'Movement',
    colSpan: 1,
    variants: [{ key: 'A', label: 'Segmented bar', component: MovementTile }],
  },
  {
    id: 'editions',
    label: 'Limited and milestone',
    kicker: 'Editions',
    colSpan: 2,
    variants: [{ key: 'A', label: 'Three cards', component: EditionsTile }],
  },
]
