import { prices } from '../data'
import { Eyebrow } from './common'

export default function PriceCurve() {
  const max = Math.max(...prices.map((p) => p.count))
  const total = prices.reduce((a, b) => a + b.count, 0)
  const leadIdx = prices.findIndex((p) => p.count === max)

  // build smooth path using cardinal-ish interpolation
  const W = 1000
  const H = 260
  const padX = 40
  const padY = 24
  const innerW = W - padX * 2
  const innerH = H - padY * 2
  const stepX = innerW / (prices.length - 1)
  const pts = prices.map((p, i) => {
    const x = padX + i * stepX
    const y = padY + innerH - (p.count / max) * innerH
    return { x, y, ...p }
  })

  // smooth path using bezier control handles derived from neighbouring slopes
  const smooth = (points: typeof pts) => {
    if (points.length < 2) return ''
    const out = [`M ${points[0].x} ${points[0].y}`]
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i - 1] ?? points[i]
      const p1 = points[i]
      const p2 = points[i + 1]
      const p3 = points[i + 2] ?? points[i + 1]
      const cp1x = p1.x + (p2.x - p0.x) / 6
      const cp1y = p1.y + (p2.y - p0.y) / 6
      const cp2x = p2.x - (p3.x - p1.x) / 6
      const cp2y = p2.y - (p3.y - p1.y) / 6
      out.push(`C ${cp1x} ${cp1y} ${cp2x} ${cp2y} ${p2.x} ${p2.y}`)
    }
    return out.join(' ')
  }
  const linePath = smooth(pts)
  const fillPath = `${linePath} L ${pts[pts.length - 1].x} ${padY + innerH} L ${pts[0].x} ${padY + innerH} Z`

  return (
    <section className="mx-auto max-w-[1440px] px-8 py-12">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <Eyebrow>The price landscape</Eyebrow>
          <h3 className="mt-2 font-sans text-[28px] leading-tight text-ink">
            Where the fair spends its attention
          </h3>
          <p className="mt-2 max-w-xl text-[13px] text-mute-3">
            Distribution of novelties across all eleven price tiers — the long tail, the sweet spot and the
            exceptional high-end, in a single shape.
          </p>
        </div>
        <div className="text-right">
          <div className="num font-sans text-[28px] leading-none text-ink">{prices[leadIdx].short}</div>
          <Eyebrow className="text-mute-3">peak tier · {pts[leadIdx].count} pcs</Eyebrow>
        </div>
      </div>

      <div className="rounded-sm border border-ink/10 bg-white p-6">
        <svg viewBox={`0 0 ${W} ${H + 40}`} className="w-full">
          <defs>
            <linearGradient id="price-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#D49E64" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#D49E64" stopOpacity="0.02" />
            </linearGradient>
          </defs>
          {/* horizontal grid */}
          {[0.25, 0.5, 0.75].map((frac) => (
            <line
              key={frac}
              x1={padX}
              x2={W - padX}
              y1={padY + innerH * (1 - frac)}
              y2={padY + innerH * (1 - frac)}
              stroke="#3A3935"
              strokeOpacity="0.06"
            />
          ))}
          {/* fill */}
          <path d={fillPath} fill="url(#price-fill)" />
          {/* line */}
          <path d={linePath} fill="none" stroke="#A98155" strokeWidth="2" />
          {/* dots */}
          {pts.map((p, i) => (
            <g key={p.short}>
              <circle
                cx={p.x}
                cy={p.y}
                r={i === leadIdx ? 6 : 3}
                fill={i === leadIdx ? '#D49E64' : '#3A3935'}
                stroke="#fff"
                strokeWidth={i === leadIdx ? 2 : 1}
              />
              {i === leadIdx && (
                <g>
                  <line x1={p.x} x2={p.x} y1={p.y - 12} y2={padY} stroke="#A98155" strokeDasharray="2 3" />
                  <text
                    x={p.x}
                    y={padY - 6}
                    textAnchor="middle"
                    fontFamily="Lato, sans-serif"
                    fontWeight={700}
                    fontSize="16"
                    fill="#A98155"
                  >
                    {p.count}
                  </text>
                </g>
              )}
            </g>
          ))}
          {/* x axis labels */}
          {pts.map((p) => (
            <text
              key={p.short}
              x={p.x}
              y={H + 16}
              textAnchor="middle"
              fontFamily="Lato, sans-serif"
              fontSize="10"
              fill="#7B7B7A"
              letterSpacing="0.06em"
            >
              {p.short}
            </text>
          ))}
        </svg>
        <div className="mt-4 grid grid-cols-3 gap-4 border-t border-ink/10 pt-4 text-[11px] text-mute-3">
          <div>
            <Eyebrow className="text-mute-3">Sub $5K</Eyebrow>
            <div className="num mt-1 text-[16px] text-ink">{prices.slice(0, 3).reduce((a, b) => a + b.count, 0)} <span className="text-mute-3">pcs</span></div>
          </div>
          <div>
            <Eyebrow className="text-mute-3">$5K–50K · the sweet spot</Eyebrow>
            <div className="num mt-1 text-[16px] text-ink">{prices.slice(3, 6).reduce((a, b) => a + b.count, 0)} <span className="text-mute-3">pcs</span></div>
          </div>
          <div>
            <Eyebrow className="text-mute-3">$50K+</Eyebrow>
            <div className="num mt-1 text-[16px] text-ink">{prices.slice(6).reduce((a, b) => a + b.count, 0)} <span className="text-mute-3">pcs</span></div>
          </div>
        </div>
      </div>
      <div className="mt-2 text-right text-[10px] uppercase tracking-eyebrow text-mute-3">
        Based on {total} priced novelties
      </div>
    </section>
  )
}
