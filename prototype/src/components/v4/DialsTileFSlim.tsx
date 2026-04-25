import { dialColors } from '../../data'

/**
 * DialsTileFSlim — V4 mid-tier slimmed-down dials tile.
 * Sausage only (no bottom 6-row list). Top-3 inline labels under sausage
 * carry the editorial story without the redundant 7th list+bar.
 *
 * Wraps the same dataset as DialsTileF; that file is left untouched.
 */

export default function DialsTileFSlim() {
  const total = dialColors.reduce((sum, d) => sum + d.count, 0)
  const top3 = dialColors.slice(0, 3)

  return (
    <article
      className="rounded-sm border border-ink/5 bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.22)]"
      style={{ minHeight: 200 }}
    >
      <h3 className="text-[16px] font-bold uppercase leading-[1.3] tracking-[0.01em] text-gold">
        Dial colors
      </h3>

      {/* Full-width sausage — all 10 colours pinned proportionally */}
      <div
        className="mt-6 flex h-6 w-full overflow-hidden rounded-full border border-ink/5"
        aria-label="Colour distribution"
      >
        {dialColors.map((d) => {
          const isSkeleton = d.hex.startsWith('url')
          const style = isSkeleton
            ? {
                width: `${(d.count / total) * 100}%`,
                backgroundImage:
                  'repeating-linear-gradient(45deg, #B5B5B5 0 3px, #DADADA 3px 6px)',
              }
            : {
                width: `${(d.count / total) * 100}%`,
                backgroundColor: d.hex,
              }
          return <div key={d.name} style={style} title={`${d.name} · ${d.count}`} />
        })}
      </div>

      {/* Top-3 inline labels — swatch + name + count */}
      <ul className="mt-6 flex items-center gap-x-8 gap-y-2">
        {top3.map((d) => {
          const isSkeleton = d.hex.startsWith('url')
          const swatchStyle = isSkeleton
            ? {
                backgroundImage:
                  'repeating-linear-gradient(45deg, #B5B5B5 0 3px, #DADADA 3px 6px)',
              }
            : {
                backgroundColor: d.hex,
                borderColor: d.ring ?? undefined,
              }
          return (
            <li key={d.name} className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full border border-ink/10"
                style={swatchStyle}
                aria-hidden
              />
              <span className="text-[13px] leading-none text-ink">{d.name}</span>
              <span className="num text-[13px] tabular-nums text-ink">{d.count}</span>
              <span className="num text-[11px] tabular-nums text-mute-3">
                {Math.round((d.count / total) * 100)}%
              </span>
            </li>
          )
        })}
      </ul>

      <div className="mt-4 text-[10px] uppercase tracking-eyebrow text-mute-3">
        Top 3 of {dialColors.length} · {Math.round(((top3[0].count + top3[1].count + top3[2].count) / total) * 100)}% of fair
      </div>
    </article>
  )
}
