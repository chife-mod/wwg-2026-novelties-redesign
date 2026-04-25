import { strapTypes } from '../../data'

/**
 * StrapsCompact — V4 compact-tier inline summary.
 * Top-3 strap materials only. No bars, no chart — three numbers + names
 * in a single horizontal rhythm, one line per material with a thin
 * proportional bar underneath. Compact bg-paper/60 tile (§5 row 6).
 */

export default function StrapsCompact() {
  const top = strapTypes.slice(0, 3)
  const max = top[0].count
  const total = strapTypes.reduce((acc, s) => acc + s.count, 0)

  return (
    <article
      className="rounded-sm border border-ink/5 bg-paper/60 p-5 shadow-[0_8px_20px_rgba(0,0,0,0.14)]"
      style={{ minHeight: 132 }}
    >
      <h3 className="text-[14px] font-bold uppercase leading-[1.3] tracking-[0.01em] text-gold">
        Strap materials
      </h3>

      <ul className="mt-3 space-y-2">
        {top.map((s, i) => {
          const isPeak = i === 0
          return (
            <li key={s.name} className="flex items-center gap-3">
              <span
                className={`flex-1 truncate text-[13px] leading-none ${
                  isPeak ? 'font-medium text-ink' : 'text-ink'
                }`}
              >
                {s.name}
              </span>
              <div className="h-[5px] w-[80px] overflow-hidden rounded-[3px] bg-ink/[0.08]">
                <div
                  className="h-full rounded-[3px]"
                  style={{
                    width: `${(s.count / max) * 100}%`,
                    backgroundColor: isPeak ? '#A98155' : '#1E1D19',
                  }}
                />
              </div>
              <span className="num text-[13px] tabular-nums text-ink">
                {s.count}
              </span>
            </li>
          )
        })}
      </ul>

      <div className="mt-2 text-[10px] uppercase tracking-eyebrow text-mute-3">
        Top 3 of 10 · {Math.round(((top[0].count + top[1].count + top[2].count) / total) * 100)}% of fair
      </div>
    </article>
  )
}
