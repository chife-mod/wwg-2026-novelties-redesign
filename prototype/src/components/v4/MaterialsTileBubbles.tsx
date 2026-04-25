import { useMemo, useState } from 'react'
import { materialBubbles } from '../../data'
import { DataTooltip } from '../common'

/**
 * MaterialsTileBubbles — V4 mid-tier bespoke viz.
 * NobleFinance-style dot-line bubble matrix: one row per case material,
 * dots = brands using that material, dot diameter ∝ sqrt(count).
 * Cross-cut "who owns which metal" is visible at a glance.
 *
 * - Sqrt scale, diameter clamped to [6, 28] px.
 * - Dots packed left-to-right, sorted by count desc.
 * - Monochrome ink-deep at 70% opacity; per-row leader in gold.
 * - Hover dot → ring + tooltip; other dots in row dim to 30%.
 * - Hover material label → all dots in row pulse, other rows dim.
 *
 * See docs/plans/2026-04-25-v4-bespoke-viz-spec.md (Tile 1).
 */

const ROW_HEIGHT = 34
const DOT_MIN = 6
const DOT_MAX = 28

// Global max for the sqrt scale — Rolex × Steel = 32. Used as the
// reference: a count of 32 maps to DOT_MAX (28px diameter).
const GLOBAL_MAX = 32

function dotDiameter(count: number): number {
  const d = DOT_MAX * Math.sqrt(count / GLOBAL_MAX)
  return Math.max(DOT_MIN, Math.min(DOT_MAX, d))
}

export default function MaterialsTileBubbles() {
  const [hoveredDot, setHoveredDot] = useState<{ row: number; idx: number } | null>(
    null,
  )
  const [hoveredRow, setHoveredRow] = useState<number | null>(null)

  // Pre-sort each row's brands by count desc for left-packed reading.
  const rows = useMemo(
    () =>
      materialBubbles.map((row) => ({
        ...row,
        brands: [...row.brands].sort((a, b) => b.count - a.count),
      })),
    [],
  )

  const grandTotal = useMemo(
    () => materialBubbles.reduce((acc, r) => acc + r.total, 0),
    [],
  )

  return (
    <article
      className="rounded-sm border border-ink/5 bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.22)]"
      style={{ minHeight: 320 }}
    >
      <h3 className="text-[16px] font-bold uppercase leading-[1.3] tracking-[0.01em] text-gold">
        Case materials
      </h3>

      <div className="relative mt-4">
        {rows.map((row, rIdx) => {
          const rowDimmed =
            hoveredRow != null && hoveredRow !== rIdx
              ? 0.4
              : hoveredDot != null && hoveredDot.row !== rIdx
              ? 1
              : 1
          const peakBrand = row.brands[0]?.brand
          return (
            <div
              key={row.material}
              className="grid items-center gap-3 border-b border-ink/[0.06] last:border-b-0"
              style={{
                gridTemplateColumns: '90px 1fr 84px',
                height: `${ROW_HEIGHT}px`,
                opacity: rowDimmed,
                transition: 'opacity 150ms ease-out',
              }}
            >
              <button
                type="button"
                onMouseEnter={() => setHoveredRow(rIdx)}
                onMouseLeave={() => setHoveredRow(null)}
                className="text-right text-[11px] font-semibold uppercase tracking-eyebrow text-mute-3 hover:text-ink"
              >
                {row.material}
              </button>

              <div className="relative flex h-full items-center gap-1">
                {row.brands.map((b, idx) => {
                  const d = dotDiameter(b.count)
                  const isPeak = b.brand === peakBrand
                  const isHovered =
                    hoveredDot?.row === rIdx && hoveredDot.idx === idx
                  const dimmedInRow =
                    hoveredDot?.row === rIdx && !isHovered ? 0.3 : 1
                  return (
                    <span
                      key={`${b.brand}-${idx}`}
                      onMouseEnter={() => setHoveredDot({ row: rIdx, idx })}
                      onMouseLeave={() => setHoveredDot(null)}
                      className="relative inline-flex shrink-0 cursor-pointer items-center justify-center transition-opacity duration-150 ease-out"
                      style={{
                        width: d,
                        height: d,
                        opacity: dimmedInRow,
                      }}
                      title={`${b.brand} · ${b.count}`}
                    >
                      <span
                        className="block rounded-full"
                        style={{
                          width: d,
                          height: d,
                          backgroundColor: isPeak ? '#A98155' : '#1E1D19',
                          opacity: isPeak ? 1 : 0.7,
                          boxShadow: isHovered
                            ? '0 0 0 2px #A98155'
                            : undefined,
                        }}
                      />
                      {isHovered && (
                        <div
                          className="pointer-events-none absolute z-10"
                          style={{
                            left: '50%',
                            bottom: `${d / 2 + 8}px`,
                            transform: 'translate(-50%, 0)',
                          }}
                        >
                          <DataTooltip arrow="bottom">
                            <div className="text-[12px] font-semibold leading-tight text-paper">
                              {b.brand} · {row.material}
                            </div>
                            <div className="num mt-0.5 text-[11px] tabular-nums leading-tight text-paper/70">
                              {b.count} novelties ·{' '}
                              {Math.round((b.count / row.total) * 100)}% of{' '}
                              {row.material}
                            </div>
                          </DataTooltip>
                        </div>
                      )}
                    </span>
                  )
                })}
              </div>

              <div className="flex items-baseline gap-2">
                <span className="num text-[14px] tabular-nums text-ink">
                  {row.total}
                </span>
                <span className="num text-[11px] tabular-nums text-mute-3">
                  {Math.round((row.total / grandTotal) * 100)}%
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </article>
  )
}
