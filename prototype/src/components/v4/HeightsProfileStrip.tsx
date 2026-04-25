import { heightBuckets } from '../../data'

/**
 * HeightsProfileStrip — V4 compact-tier silhouette strip.
 * Six height-scaled silhouettes (3px-per-mm), baseline-aligned, peak in gold.
 * No hover state — compact tile per V4 §7 anti-list item 4.
 *
 * See docs/plans/2026-04-25-v4-bespoke-viz-spec.md (Tile 3).
 */

const MM_TO_PX = 3
const SILHOUETTE_W = 56

export default function HeightsProfileStrip() {
  const peakIdx = heightBuckets.reduce(
    (acc, b, i, arr) => (b.count > arr[acc].count ? i : acc),
    0,
  )

  return (
    <article
      className="rounded-sm border border-ink/5 bg-paper/60 p-5 shadow-[0_8px_20px_rgba(0,0,0,0.14)]"
      style={{ minHeight: 132 }}
    >
      <h3 className="text-[14px] font-bold uppercase leading-[1.3] tracking-[0.01em] text-gold">
        Case heights
      </h3>

      <div className="mt-3">
        {/* Count labels above */}
        <div className="flex items-end justify-between px-1">
          {heightBuckets.map((b, i) => (
            <div
              key={b.key}
              className={`num text-center text-[13px] tabular-nums leading-none ${
                i === peakIdx ? 'font-semibold text-gold' : 'text-ink'
              }`}
              style={{ width: SILHOUETTE_W }}
            >
              {b.count}
            </div>
          ))}
        </div>

        {/* Silhouettes — baseline aligned */}
        <div className="mt-2 flex items-end justify-between border-b border-ink/10 px-1 pb-px">
          {heightBuckets.map((b, i) => {
            const h = b.mmMid * MM_TO_PX
            const isPeak = i === peakIdx
            return (
              <div
                key={b.key}
                className="flex justify-center"
                style={{ width: SILHOUETTE_W }}
              >
                <div
                  className="rounded-t-[5px]"
                  style={{
                    width: 36,
                    height: h,
                    backgroundColor: isPeak ? '#A98155' : '#1E1D19',
                  }}
                  aria-label={`${b.mmLabel}: ${b.count} novelties`}
                />
              </div>
            )
          })}
        </div>

        {/* mm range labels below */}
        <div className="mt-2 flex items-start justify-between px-1">
          {heightBuckets.map((b, i) => (
            <div
              key={b.key}
              className={`text-center text-[10px] uppercase tracking-eyebrow ${
                i === peakIdx ? 'text-gold' : 'text-mute-3'
              }`}
              style={{ width: SILHOUETTE_W }}
            >
              {b.mmLabel}
            </div>
          ))}
        </div>
      </div>
    </article>
  )
}
