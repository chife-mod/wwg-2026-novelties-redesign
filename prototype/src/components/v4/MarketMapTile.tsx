import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import {
  BRAND_PRICE_MATRIX,
  TOP_12_BRANDS,
  brands as brandsData,
  prices,
  editorNotes,
} from '../../data'
import { BrandLogo, DataTooltip, EditorNote, useFormatCount } from '../common'

/**
 * MarketMapTile — V4 signature flagship.
 * Brand × price-bucket heatmap, 12 rows × 11 cols.
 *
 * Encoding: 5-band stratified gold ramp (paper → 4 gold tints → solid gold).
 * Bands derived from `count / max` thresholds (0, 0.20, 0.40, 0.70, 1.0).
 * Empty cell → 2px ink/15 dot (preserves grid scaffold without "wallpaper").
 *
 * Hover (mouse): cross-highlight row + col to opacity-0.85, mute everything
 * else to 0.25; brand label and price label go gold-bold; row-sum strip
 * segment at hovered column lights to peak gold.
 *
 * Tap (touch): tap cell to lock; tap outside grid to release.
 *
 * Tooltip: floating near cursor, anchored above the hovered cell, with
 * edge clamping. 4 facts in 2 lines: brand · bucket // count · % of brand
 * · % of bucket. Reuses <DataTooltip> from common.tsx.
 *
 * Editor's Note slot at bottom — Cormorant italic, present-state copy.
 *
 * See docs/plans/2026-04-25-v4-marketmap-spec.md for the full design.
 */

// 5-band gold ramp. Faint band darkened to #DCC29C (~1.45 contrast vs paper);
// non-empty cells also get an inset gold@40 hairline for additional presence.
const STOPS = ['#EEEDEC', '#DCC29C', '#CFAA7C', '#BC9061', '#A98155'] as const

function bandIdx(n: number, max: number): 0 | 1 | 2 | 3 | 4 {
  if (n === 0) return 0
  const r = n / max
  if (r <= 0.2) return 1
  if (r <= 0.4) return 2
  if (r <= 0.7) return 3
  return 4
}

// Brand name shown in label rail. Some brands have shorter display names.
const DISPLAY_NAME: Record<string, string> = {
  'Patek Philippe': 'Patek Philippe',
  'Jaeger-LeCoultre': 'Jaeger-LeCoultre',
  'Eberhard & Co.': 'Eberhard & Co.',
}

type CellRef = { r: number; c: number }

/**
 * Props:
 *   title          — header label (default "Market map"). V5 reuses this tile
 *                    under the "Price ranges" slot, so we accept an override.
 *   showNote       — render the bottom Cormorant editorial note (default true).
 *                    V5 cuts the editorial layer, so it passes false.
 *   topN           — how many brand rows to render (default 12). V5 "large"
 *                    variant uses 10 to match top-N convention.
 *   rowHeight      — pixel height of each cell row (default 22). Larger values
 *                    increase legibility at the cost of total tile height.
 *   showLogos      — render BrandLogo column (default true). When false, the
 *                    label rail can be narrower, which gives more horizontal
 *                    room for price-bucket cells (so "$250K+" fits).
 *   labelRailWidth — label-column width in px (default 180). Drop to ~130 when
 *                    logos are off.
 *   nameSize       — brand-name font-size in px (default 12).
 *   minHeight      — explicit minHeight in px. If omitted, the tile sizes to
 *                    its content.
 */
export default function MarketMapTile({
  title = 'Market map',
  showNote = true,
  topN = 12,
  rowHeight = 22,
  showLogos = true,
  labelRailWidth = 180,
  nameSize = 12,
  minHeight = 400,
}: {
  title?: string
  showNote?: boolean
  topN?: number
  rowHeight?: number
  showLogos?: boolean
  labelRailWidth?: number
  nameSize?: number
  minHeight?: number
} = {}) {
  // Slice matrix and brand list to topN. Both arrays come from data.ts in
  // brand-rank order (Rolex first, etc.), so a head slice = top-N by total.
  const brands = TOP_12_BRANDS.slice(0, topN)
  const matrix = BRAND_PRICE_MATRIX.slice(0, topN)
  const cols = prices.length
  const railTemplate = `${labelRailWidth}px repeat(${cols}, 1fr)`
  const [hovered, setHovered] = useState<CellRef | null>(null)
  const [locked, setLocked] = useState<CellRef | null>(null)
  const active = locked ?? hovered

  const gridRef = useRef<HTMLDivElement>(null)
  const fmt = useFormatCount()

  // Precomputed sums and max — recomputed when topN changes (i.e., per variant).
  // Sums reflect ONLY the visible brands so subtitle totals stay honest.
  const { rowSums, colSums, max, totalAll, colMax } = useMemo(() => {
    const rowSums = matrix.map((row) => row.reduce((a, b) => a + b, 0))
    const colSums: number[] = new Array(cols).fill(0)
    let max = 0
    for (const row of matrix) {
      for (let c = 0; c < row.length; c++) {
        colSums[c] += row[c]
        if (row[c] > max) max = row[c]
      }
    }
    const totalAll = rowSums.reduce((a, b) => a + b, 0)
    const colMax = Math.max(...colSums)
    return { rowSums, colSums, max, totalAll, colMax }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topN])

  // Tap-to-release lock: pointerdown outside the grid clears the lock.
  useEffect(() => {
    if (!locked) return
    const handler = (e: PointerEvent) => {
      const node = gridRef.current
      if (node && e.target instanceof Node && !node.contains(e.target)) {
        setLocked(null)
      }
    }
    document.addEventListener('pointerdown', handler)
    return () => document.removeEventListener('pointerdown', handler)
  }, [locked])

  // Top-3 columns by total — surface their counts above the row-sum strip.
  const topColIdxs = useMemo(() => {
    const idxs = colSums.map((sum, i) => ({ sum, i }))
    idxs.sort((a, b) => b.sum - a.sum)
    return new Set(idxs.slice(0, 3).map((x) => x.i))
  }, [colSums])

  const activeCellCount = active != null ? matrix[active.r][active.c] : 0
  const activeBrandTotal = active != null ? rowSums[active.r] : 0
  const activeColTotal = active != null ? colSums[active.c] : 0

  return (
    <article
      className="rounded-sm border border-ink/5 bg-white p-7 shadow-[0_24px_48px_rgba(0,0,0,0.26)]"
      style={{ minHeight }}
    >
      <header className="flex items-end justify-between">
        <div>
          <h3 className="text-[18px] font-bold uppercase leading-[1.3] tracking-[0.01em] text-gold">
            {title}
          </h3>
          <p className="mt-1 text-[12px] text-mute-3">
            Top {topN} brands × {cols} price tiers · {totalAll} novelties
          </p>
        </div>
        <div className="flex items-center gap-2 text-[10px] uppercase tracking-eyebrow text-mute-3">
          <span>fewer</span>
          <span className="flex h-[10px] gap-px">
            {STOPS.map((stop, i) => (
              <span
                key={i}
                className="block w-[14px]"
                style={{
                  backgroundColor: stop,
                  boxShadow:
                    i > 0 && i < 4
                      ? 'inset 0 0 0 1px rgba(169,129,85,0.40)'
                      : undefined,
                }}
              />
            ))}
          </span>
          <span>more</span>
        </div>
      </header>

      <div
        ref={gridRef}
        className="relative mt-6"
        role="img"
        aria-label={`Heatmap of top ${topN} brands by price tier`}
      >
        {/* Top column-count labels (top-3 columns only) — 14px row */}
        <div
          className="grid h-4 items-end"
          style={{ gridTemplateColumns: railTemplate, gap: '1px' }}
        >
          <div />
          {colSums.map((sum, c) => {
            const show = topColIdxs.has(c) || active?.c === c
            const isActive = active?.c === c
            return (
              <div
                key={c}
                className={`text-center text-[10px] tabular-nums transition-colors ${
                  isActive
                    ? 'font-semibold text-gold'
                    : show
                    ? 'text-mute-3'
                    : 'text-transparent'
                }`}
              >
                {sum}
              </div>
            )
          })}
        </div>

        {/* Row-sum strip — 10px tall, gold-ramp coloured per column total */}
        <div
          className="mt-1 grid"
          style={{ gridTemplateColumns: railTemplate, gap: '1px' }}
        >
          <div />
          {colSums.map((sum, c) => {
            const isActive = active?.c === c
            const idx = isActive ? 4 : bandIdx(sum, colMax)
            return (
              <div
                key={c}
                className="h-[10px] transition-opacity duration-150 ease-out"
                style={{
                  backgroundColor: STOPS[idx],
                  boxShadow:
                    idx > 0 && idx < 4
                      ? 'inset 0 0 0 1px rgba(169,129,85,0.40)'
                      : undefined,
                  opacity: active && !isActive ? 0.4 : 1,
                }}
              />
            )
          })}
        </div>

        {/* Spacer between strip and matrix */}
        <div className="h-3" />

        {/* Matrix grid — 12 brand rows */}
        <div
          className="grid"
          style={{ gridTemplateColumns: railTemplate, gap: '1px' }}
        >
          {brands.map((brand, r) => {
            const isActiveRow = active?.r === r
            return (
              <Fragment key={brand}>
                <div
                  className="flex items-center pr-3 transition-opacity duration-150 ease-out"
                  style={{
                    height: rowHeight,
                    gap: showLogos ? 12 : 0,
                    opacity: active && !isActiveRow ? 0.55 : 1,
                  }}
                >
                  {showLogos && <BrandLogo name={brand} size={Math.round(rowHeight * 0.82)} />}
                  <span
                    className={`overflow-hidden truncate whitespace-nowrap transition-colors ${
                      isActiveRow ? 'font-semibold text-gold' : 'text-ink'
                    }`}
                    style={{ fontSize: nameSize, lineHeight: 1.2 }}
                  >
                    {DISPLAY_NAME[brand] ?? brand}
                  </span>
                </div>
                {matrix[r].map((n, c) => {
                  const isActiveCell = active?.r === r && active.c === c
                  const isAxisMate =
                    active != null && (active.r === r || active.c === c)
                  const dim = active != null && !isAxisMate
                  const idx = bandIdx(n, max)
                  const fill = STOPS[idx]
                  const opacity = isActiveCell ? 1 : dim ? 0.25 : isAxisMate ? 0.85 : 1
                  return (
                    <div
                      key={c}
                      className="relative cursor-pointer transition-opacity duration-150 ease-out"
                      style={{
                        height: rowHeight,
                        backgroundColor: fill,
                        opacity,
                        boxShadow:
                          idx > 0 && idx < 4
                            ? 'inset 0 0 0 1px rgba(169,129,85,0.40)'
                            : undefined,
                      }}
                      onMouseEnter={() => setHovered({ r, c })}
                      onMouseLeave={() => setHovered(null)}
                      onClick={(e) => {
                        // Don't bubble — TileShell wrapper would open sandbox.
                        e.stopPropagation()
                        setLocked((prev) =>
                          prev?.r === r && prev?.c === c ? null : { r, c },
                        )
                      }}
                    >
                      {n === 0 && (
                        <span className="absolute left-1/2 top-1/2 h-[2px] w-[2px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-ink/15" />
                      )}
                    </div>
                  )
                })}
              </Fragment>
            )
          })}
        </div>

        {/* Bottom price-axis labels */}
        <div
          className="mt-3 grid"
          style={{ gridTemplateColumns: railTemplate, gap: '1px' }}
        >
          <div />
          {prices.map((p, c) => {
            const isActive = active?.c === c
            return (
              <div
                key={c}
                className={`text-center text-[11px] tabular-nums transition-colors ${
                  isActive ? 'font-semibold text-gold' : 'text-mute-3'
                }`}
              >
                {p.short}
              </div>
            )
          })}
        </div>

        {/* Floating tooltip — anchored above the active cell */}
        {active != null && (
          <FloatingTooltip
            r={active.r}
            c={active.c}
            cols={cols}
            rowHeight={rowHeight}
            labelRailWidth={labelRailWidth}
            brand={DISPLAY_NAME[brands[active.r]] ?? brands[active.r]}
            bucket={prices[active.c].short}
            count={activeCellCount}
            brandShare={
              activeBrandTotal > 0
                ? Math.round((activeCellCount / activeBrandTotal) * 100)
                : 0
            }
            bucketShare={
              activeColTotal > 0
                ? Math.round((activeCellCount / activeColTotal) * 100)
                : 0
            }
            brandYoY={
              brandsData.find((b) => b.name === brands[active.r])?.delta
            }
            fmt={fmt}
          />
        )}
      </div>

      {showNote && <EditorNote text={editorNotes.marketMap} />}
    </article>
  )
}

/**
 * FloatingTooltip — positions itself relative to the matrix grid using
 * percentages on the wrapping container. Edge handling: if cell is in
 * row 0 (top), arrow flips to top and the tooltip sits below the cell.
 */
function FloatingTooltip({
  r,
  c,
  cols,
  rowHeight,
  labelRailWidth,
  brand,
  bucket,
  count,
  brandShare,
  bucketShare,
  brandYoY,
  fmt,
}: {
  r: number
  c: number
  cols: number
  rowHeight: number
  labelRailWidth: number
  brand: string
  bucket: string
  count: number
  brandShare: number
  bucketShare: number
  brandYoY?: number
  fmt: (n: number, total?: number) => string
}) {
  // Geometry approximation — derived from gridTemplateColumns:
  // labelRailWidth + cols equal cells + (cols-1) gaps. Compute position in %
  // of the grid container. Using inline style with calc() keeps us off
  // measured DOM dimensions.
  const flipUp = r <= 1 // top two rows: place tooltip BELOW the cell
  // Each cell vertical: rowHeight + 1px gap. Stack offsets:
  //   col-label(16+4) + strip(10) + spacer(12) + r * (rowHeight+1) = pre-cell y
  const cellTopPx = 16 + 4 + 10 + 12 + r * (rowHeight + 1)
  const cellMidY = cellTopPx + rowHeight / 2
  const yPx = flipUp ? cellMidY + rowHeight - 4 : cellMidY - rowHeight + 4

  // Horizontal: rail + 1px gap before col 0; remaining = cols cells with gaps.
  // left = rail + 1 + (c + 0.5) * cellWidth, where cellWidth =
  // (containerWidth - rail - 1 - (cols-1)) / cols.
  const remainingGap = cols - 1
  const leftCalc = `calc(${labelRailWidth}px + 1px + (100% - ${labelRailWidth}px - 1px - ${remainingGap}px) / ${cols} * ${
    c + 0.5
  } + ${c}px)`

  return (
    <div
      className="pointer-events-none absolute z-10"
      style={{
        left: leftCalc,
        top: `${yPx}px`,
        transform: flipUp ? 'translate(-50%, 0)' : 'translate(-50%, -100%)',
      }}
    >
      <DataTooltip arrow={flipUp ? 'top' : 'bottom'}>
        <div className="text-[12px] font-semibold leading-tight text-paper">
          {brand} · {bucket}
        </div>
        <div className="num mt-0.5 text-[11px] tabular-nums leading-tight text-paper/70">
          {fmt(count)} novelties · {brandShare}% of {brand.split(' ')[0]} ·{' '}
          {bucketShare}% of bucket
        </div>
        {brandYoY !== undefined && (
          <div className="num mt-1 flex items-center gap-1 border-t border-white/15 pt-1 text-[10px] uppercase tracking-eyebrow tabular-nums">
            <span className="text-mute-2">{brand.split(' ')[0]} YoY</span>
            <span
              className={
                brandYoY > 0
                  ? 'text-[#3FD3CD] font-semibold'
                  : brandYoY < 0
                  ? 'text-[#FF7680] font-semibold'
                  : 'text-mute-2'
              }
            >
              {brandYoY > 0 ? '+' : ''}
              {brandYoY}%
            </span>
          </div>
        )}
      </DataTooltip>
    </div>
  )
}
