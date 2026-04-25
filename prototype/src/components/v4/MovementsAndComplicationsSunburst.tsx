import { useMemo, useState } from 'react'
import { complicationsByMovement, movements } from '../../data'
import { DataTooltip } from '../common'

/**
 * MovementsAndComplicationsSunburst — V4 mid-tier bespoke viz.
 * Replaces FunctionsTileB + MovementTileF with one diagram.
 *   - Inner ring  = movement family (Auto / Manual / Quartz)
 *   - Outer ring  = top complications, anchored within parent family arc.
 *   - 3 colours only (gold / ink-deep / mute), outer at 62% opacity.
 *   - Centre disc carries `89% mechanical`.
 *   - Right legend strip lists top-6 complications with counts.
 *
 * Hover on outer segment → cross-highlight parent inner. Hover on inner →
 * keep family + children at full, dim other families.
 *
 * See docs/plans/2026-04-25-v4-bespoke-viz-spec.md (Tile 2).
 */

const SIZE = 200
const CX = SIZE / 2
const CY = SIZE / 2
const INNER_R0 = 36
const INNER_R1 = 70
const OUTER_R0 = 74
const OUTER_R1 = 100
const KERF = 1.5

const FAMILY_COLOR: Record<'auto' | 'manual' | 'quartz', string> = {
  auto: '#A98155',
  manual: '#1E1D19',
  quartz: '#C6C6C6',
}

const FAMILY_LABEL: Record<'auto' | 'manual' | 'quartz', string> = {
  auto: 'AUTO',
  manual: 'MANUAL',
  quartz: 'QUARTZ',
}

type Family = 'auto' | 'manual' | 'quartz'

function polar(cx: number, cy: number, r: number, angleRad: number) {
  return { x: cx + r * Math.cos(angleRad), y: cy + r * Math.sin(angleRad) }
}

/** Build SVG arc path between two angles at given inner/outer radii. */
function ringPath(
  cx: number,
  cy: number,
  r0: number,
  r1: number,
  a0: number,
  a1: number,
): string {
  const large = a1 - a0 > Math.PI ? 1 : 0
  const p0o = polar(cx, cy, r1, a0)
  const p1o = polar(cx, cy, r1, a1)
  const p1i = polar(cx, cy, r0, a1)
  const p0i = polar(cx, cy, r0, a0)
  return [
    `M ${p0o.x.toFixed(2)} ${p0o.y.toFixed(2)}`,
    `A ${r1} ${r1} 0 ${large} 1 ${p1o.x.toFixed(2)} ${p1o.y.toFixed(2)}`,
    `L ${p1i.x.toFixed(2)} ${p1i.y.toFixed(2)}`,
    `A ${r0} ${r0} 0 ${large} 0 ${p0i.x.toFixed(2)} ${p0i.y.toFixed(2)}`,
    'Z',
  ].join(' ')
}

export default function MovementsAndComplicationsSunburst() {
  const [hoveredFamily, setHoveredFamily] = useState<Family | null>(null)
  const [hoveredOuter, setHoveredOuter] = useState<{
    family: Family
    name: string
    count: number
  } | null>(null)

  const familyTotals = useMemo(() => {
    const totals = { auto: 0, manual: 0, quartz: 0 }
    for (const m of movements) {
      const k = m.name.toLowerCase() as Family
      totals[k] = m.count
    }
    return totals
  }, [])

  const totalMovements = familyTotals.auto + familyTotals.manual + familyTotals.quartz
  const mechanicalPct = Math.round(
    ((familyTotals.auto + familyTotals.manual) / totalMovements) * 100,
  )

  // Inner-ring arcs. Start at top (12 o'clock = -PI/2), clockwise.
  const innerArcs = useMemo(() => {
    const total = totalMovements
    let cursor = -Math.PI / 2
    const result: { family: Family; a0: number; a1: number; count: number }[] = []
    for (const family of ['auto', 'manual', 'quartz'] as Family[]) {
      const sweep = (familyTotals[family] / total) * Math.PI * 2
      result.push({ family, a0: cursor, a1: cursor + sweep, count: familyTotals[family] })
      cursor += sweep
    }
    return result
  }, [familyTotals, totalMovements])

  // Outer-ring arcs — for each family, top complications anchored within its arc.
  // Within a family arc, we partition by share of family-total (using the
  // crosstab counts), sorted by family-share desc.
  const outerArcs = useMemo(() => {
    const result: {
      family: Family
      name: string
      count: number
      a0: number
      a1: number
    }[] = []
    for (const inner of innerArcs) {
      const fam = inner.family
      const familyTotalForComps = complicationsByMovement.reduce(
        (acc, c) => acc + c[fam],
        0,
      )
      if (familyTotalForComps === 0) continue
      const sorted = [...complicationsByMovement]
        .filter((c) => c[fam] > 0)
        .sort((a, b) => b[fam] - a[fam])
      // Take top 5 for the family; remainder collapsed to "Other".
      const top = sorted.slice(0, 5)
      const restCount = sorted.slice(5).reduce((acc, c) => acc + c[fam], 0)
      const segments = top.map((c) => ({ name: c.name, count: c[fam] }))
      if (restCount > 0) segments.push({ name: 'Other', count: restCount })

      let cursor = inner.a0
      const sweepTotal = inner.a1 - inner.a0
      for (const seg of segments) {
        const sweep = (seg.count / familyTotalForComps) * sweepTotal
        result.push({
          family: fam,
          name: seg.name,
          count: seg.count,
          a0: cursor,
          a1: cursor + sweep,
        })
        cursor += sweep
      }
    }
    return result
  }, [innerArcs])

  // Top 6 complications by total — for the legend.
  const topComplications = useMemo(() => {
    const sorted = [...complicationsByMovement]
      .sort((a, b) => b.total - a.total)
      .slice(0, 6)
    return sorted
  }, [])

  // For hover-coupling: which family does a complication primarily belong to?
  function dominantFamily(c: (typeof complicationsByMovement)[number]): Family {
    if (c.auto >= c.manual && c.auto >= c.quartz) return 'auto'
    if (c.manual >= c.quartz) return 'manual'
    return 'quartz'
  }

  function isDimmed(family: Family, name?: string): boolean {
    if (hoveredOuter) {
      // Dim everything that isn't the hovered outer or its parent inner.
      if (name === hoveredOuter.name && family === hoveredOuter.family) return false
      if (!name && family === hoveredOuter.family) return false
      return true
    }
    if (hoveredFamily) {
      return family !== hoveredFamily
    }
    return false
  }

  return (
    <article
      className="rounded-sm border border-ink/5 bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.22)]"
      style={{ minHeight: 240 }}
    >
      <h3 className="text-[16px] font-bold uppercase leading-[1.3] tracking-[0.01em] text-gold">
        Movement &amp; complications
      </h3>

      <div className="mt-4 flex items-start gap-4">
        {/* Sunburst SVG */}
        <div className="relative shrink-0" style={{ width: SIZE, height: SIZE }}>
          <svg width={SIZE} height={SIZE} viewBox={`0 0 ${SIZE} ${SIZE}`}>
            {/* Outer ring */}
            {outerArcs.map((arc, i) => {
              const dim = isDimmed(arc.family, arc.name)
              const isActive =
                hoveredOuter?.family === arc.family && hoveredOuter.name === arc.name
              return (
                <path
                  key={`o-${i}`}
                  d={ringPath(CX, CY, OUTER_R0, OUTER_R1, arc.a0 + KERF / 200, arc.a1 - KERF / 200)}
                  fill={FAMILY_COLOR[arc.family]}
                  fillOpacity={isActive ? 1 : dim ? 0.15 : 0.62}
                  stroke="#EEEDEC"
                  strokeWidth={KERF}
                  style={{ cursor: 'pointer', transition: 'fill-opacity 150ms ease-out' }}
                  onMouseEnter={() =>
                    setHoveredOuter({ family: arc.family, name: arc.name, count: arc.count })
                  }
                  onMouseLeave={() => setHoveredOuter(null)}
                />
              )
            })}
            {/* Inner ring */}
            {innerArcs.map((arc, i) => {
              const dim = isDimmed(arc.family)
              const isActive = hoveredFamily === arc.family
              return (
                <g key={`i-${i}`}>
                  <path
                    d={ringPath(CX, CY, INNER_R0, INNER_R1, arc.a0 + KERF / 100, arc.a1 - KERF / 100)}
                    fill={FAMILY_COLOR[arc.family]}
                    fillOpacity={isActive ? 1 : dim ? 0.25 : 1}
                    stroke="#EEEDEC"
                    strokeWidth={KERF}
                    style={{ cursor: 'pointer', transition: 'fill-opacity 150ms ease-out' }}
                    onMouseEnter={() => setHoveredFamily(arc.family)}
                    onMouseLeave={() => setHoveredFamily(null)}
                  />
                  {/* Family label centred in segment */}
                  {(() => {
                    const mid = (arc.a0 + arc.a1) / 2
                    const labelR = (INNER_R0 + INNER_R1) / 2
                    const p = polar(CX, CY, labelR, mid)
                    const labelColor =
                      arc.family === 'auto'
                        ? '#1E1D19'
                        : arc.family === 'manual'
                        ? '#EEEDEC'
                        : '#3A3935'
                    return (
                      <g pointerEvents="none">
                        <text
                          x={p.x}
                          y={p.y - 3}
                          textAnchor="middle"
                          fontSize={9}
                          fontWeight={700}
                          fill={labelColor}
                          style={{
                            letterSpacing: '0.14em',
                            fontFamily: 'Lato, system-ui, sans-serif',
                          }}
                        >
                          {FAMILY_LABEL[arc.family]}
                        </text>
                        <text
                          x={p.x}
                          y={p.y + 9}
                          textAnchor="middle"
                          fontSize={11}
                          fontWeight={400}
                          fill={labelColor}
                          style={{
                            fontFamily: 'Lato, system-ui, sans-serif',
                            fontFeatureSettings: '"tnum"',
                          }}
                        >
                          {arc.count}
                        </text>
                      </g>
                    )
                  })()}
                </g>
              )
            })}
            {/* Centre disc */}
            <circle cx={CX} cy={CY} r={INNER_R0 - 2} fill="#FFFFFF" />
            <text
              x={CX}
              y={CY - 1}
              textAnchor="middle"
              fontSize={28}
              fontWeight={300}
              fill="#3A3935"
              style={{
                fontFamily: 'Lato, system-ui, sans-serif',
                fontFeatureSettings: '"tnum"',
              }}
            >
              {mechanicalPct}%
            </text>
            <text
              x={CX}
              y={CY + 14}
              textAnchor="middle"
              fontSize={9}
              fontWeight={600}
              fill="#7B7B7A"
              style={{
                letterSpacing: '0.14em',
                fontFamily: 'Lato, system-ui, sans-serif',
              }}
            >
              MECHANICAL
            </text>
          </svg>

          {/* Tooltip overlay (relative to chart container) */}
          {hoveredOuter && (
            <div
              className="pointer-events-none absolute z-10"
              style={{ left: '50%', top: -8, transform: 'translate(-50%, -100%)' }}
            >
              <DataTooltip arrow="bottom">
                <div className="text-[12px] font-semibold leading-tight text-paper">
                  {hoveredOuter.name} · {FAMILY_LABEL[hoveredOuter.family]}
                </div>
                <div className="num mt-0.5 text-[11px] tabular-nums leading-tight text-paper/70">
                  {hoveredOuter.count} novelties in family
                </div>
              </DataTooltip>
            </div>
          )}
        </div>

        {/* Legend */}
        <ul className="flex-1 space-y-1.5">
          {topComplications.map((c) => {
            const fam = dominantFamily(c)
            const isHover =
              hoveredOuter?.name === c.name ||
              (hoveredFamily != null && hoveredFamily === fam)
            return (
              <li
                key={c.name}
                className={`flex items-center gap-2 rounded-sm px-1.5 py-1 transition-colors ${
                  isHover ? 'bg-ink/5' : ''
                }`}
                onMouseEnter={() =>
                  setHoveredOuter({ family: fam, name: c.name, count: c[fam] })
                }
                onMouseLeave={() => setHoveredOuter(null)}
              >
                <span
                  className="block h-2 w-2 shrink-0 rounded-sm"
                  style={{ backgroundColor: FAMILY_COLOR[fam], opacity: 0.62 }}
                />
                <span className="flex-1 truncate text-[12px] leading-none text-ink">
                  {c.name}
                </span>
                <span className="num text-[12px] tabular-nums text-mute-3">
                  {c.total}
                </span>
              </li>
            )
          })}
        </ul>
      </div>
    </article>
  )
}
