import { editorNotes } from '../../data'
import { EditorNote } from '../common'
import BrandsTileD from '../current/variants/BrandsTileD'
import CollectionsTileB from '../current/variants/CollectionsTileB'
import PriceTileD from '../current/variants/PriceTileD'
import DiameterTileD from '../current/variants/DiameterTileD'
import EditionsTileD from '../current/variants/EditionsTileD'
import MarketMapTile from './MarketMapTile'
import MaterialsTileBubbles from './MaterialsTileBubbles'
import MovementsAndComplicationsSunburst from './MovementsAndComplicationsSunburst'
import HeightsProfileStrip from './HeightsProfileStrip'
import StrapsCompact from './StrapsCompact'
import DialsTileFSlim from './DialsTileFSlim'

/**
 * V4RightGrid — the editorial right column.
 * Tier hierarchy per docs/plans/2026-04-25-v4-design.md §5:
 *   Row 1: Brands (col-6) + Collections (col-6) — flagship pair, p-7, shadow-lg
 *   Row 2: MarketMap (col-12) — flagship NEW, 400px
 *   Row 3: Price (col-12) — flagship, 280px
 *   Row 4: MaterialsBubbles (col-6) + Diameter (col-6)
 *   Row 5: MovementsSunburst (col-6) + DialsSlim (col-6)
 *   Row 6: HeightsProfile (col-4) + StrapsCompact (col-4) + Editions (col-4)
 *
 * Editor's Notes wrap Brands, MarketMap (inside the tile already), and Price.
 * Brands/MarketMap/Price are the only flagships that get notes per §4.
 */

export default function V4RightGrid() {
  return (
    <div className="grid grid-cols-12 gap-4">
      {/* Row 1 — Brands + Collections (paired flagship) */}
      <div className="col-span-6">
        <BrandsTileD />
        {/* Editor's Note for the Brands+Collections pair lives under Brands. */}
        <div className="mx-1">
          <EditorNote text={editorNotes.brands} />
        </div>
      </div>
      <div className="col-span-6">
        <CollectionsTileB />
      </div>

      {/* Row 2 — MarketMap flagship (note is rendered inside the tile) */}
      <div className="col-span-12">
        <MarketMapTile />
      </div>

      {/* Row 3 — Price flagship + Editor's Note */}
      <div className="col-span-12">
        <PriceTileD />
        <div className="mx-1">
          <EditorNote text={editorNotes.price} />
        </div>
      </div>

      {/* Row 4 — MaterialsBubbles + Diameter */}
      <div className="col-span-6">
        <MaterialsTileBubbles />
      </div>
      <div className="col-span-6">
        <DiameterTileD />
      </div>

      {/* Row 5 — MovementsSunburst + DialsSlim */}
      <div className="col-span-6">
        <MovementsAndComplicationsSunburst />
      </div>
      <div className="col-span-6">
        <DialsTileFSlim />
      </div>

      {/* Row 6 — Heights + Straps + Editions (compact strip) */}
      <div className="col-span-4">
        <HeightsProfileStrip />
      </div>
      <div className="col-span-4">
        <StrapsCompact />
      </div>
      <div className="col-span-4">
        <EditionsTileD />
      </div>
    </div>
  )
}
