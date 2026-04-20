import type { Ranked } from '../data'
import { DeltaChip, Eyebrow, WatchPlaceholder, BrandMonogram } from './common'

export default function TopList({
  kicker,
  title,
  items,
  total,
  variant = 'brand',
}: {
  kicker: string
  title: string
  items: Ranked[]
  total: number
  variant?: 'brand' | 'collection'
}) {
  const max = Math.max(...items.map((i) => i.count))
  const top3 = items.slice(0, 3)
  const rest = items.slice(3)

  return (
    <section className="rounded-sm border border-ink/10 bg-white">
      <header className="flex items-end justify-between gap-8 border-b border-ink/10 px-8 pt-8 pb-6">
        <div>
          <Eyebrow>{kicker}</Eyebrow>
          <h3 className="mt-2 font-sans text-[28px] leading-tight text-ink">{title}</h3>
        </div>
        <div className="text-right">
          <div className="num font-sans text-[32px] leading-none text-ink">{total}</div>
          <Eyebrow className="text-mute-3">represented</Eyebrow>
        </div>
      </header>

      {/* podium */}
      <div className="grid grid-cols-3 gap-px bg-ink/10 border-b border-ink/10">
        {top3.map((item, idx) => {
          const rankLabel = ['I', 'II', 'III'][idx]
          const sizes = [112, 96, 88][idx]
          return (
            <div key={item.name} className="relative flex flex-col items-center gap-3 bg-white px-6 pb-6 pt-8">
              <span className="absolute left-4 top-3 font-sans text-[11px] font-semibold uppercase tracking-eyebrow text-gold">{rankLabel}</span>
              <WatchPlaceholder name={item.name} size={sizes} />
              <div className="mt-1 flex items-center gap-2">
                <BrandMonogram name={item.name.split(' ')[0]} size={20} />
                <span className="text-[13px] font-medium text-ink">{item.name}</span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="num font-sans text-[30px] leading-none text-ink">{item.count}</span>
                <span className="text-[11px] uppercase tracking-eyebrow text-mute-3">novelties</span>
                <DeltaChip delta={item.delta} />
              </div>
              <div className="text-[10px] uppercase tracking-eyebrow text-mute-3">
                {((item.count / total) * 100).toFixed(1)}% share
              </div>
            </div>
          )
        })}
      </div>

      {/* rest */}
      <ul className="divide-y divide-ink/5 px-2">
        {rest.map((item, i) => {
          const rank = i + 4
          const pct = (item.count / max) * 100
          return (
            <li key={item.name} className="group grid grid-cols-[32px_32px_1fr_auto_56px] items-center gap-3 px-4 py-2.5 hover:bg-paper/60">
              <span className="num font-sans text-[12px] font-medium tabular-nums text-mute-3">{rank}</span>
              <BrandMonogram name={variant === 'collection' ? item.name.split(' ')[0] : item.name.split(' ')[0]} size={24} />
              <div className="min-w-0">
                <div className="truncate text-[13px] text-ink">{item.name}</div>
                <div className="mt-1 h-[3px] w-full overflow-hidden rounded-full bg-ink/5">
                  <div className="h-full rounded-full bg-ink" style={{ width: `${pct}%` }} />
                </div>
              </div>
              <span className="num text-[13px] tabular-nums text-ink">{item.count}</span>
              <div className="text-right">
                <DeltaChip delta={item.delta} />
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
