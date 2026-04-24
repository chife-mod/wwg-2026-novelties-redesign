import { dialColors } from '../../../data'
import { DeltaChip } from '../../common'

/**
 * Variant C — sandbox exploration вертикальной колбасы.
 *
 * Отличие от B: колбаса не горизонтально напротив заголовка, а
 * вертикально на правом краю плитки, рядом со списком. Список со всеми
 * 5 колонками (rank / swatch / name+bar / count / delta) сдвигается влево,
 * на освободившееся правое поле ставится 20px-широкая стрипа на всю
 * высоту списка.
 *
 * Высота стрипы автоматически равна высоте <ul> через flex items-stretch.
 * Сегменты внутри — flex-col, высоты пропорциональны count (top=Blue,
 * bottom=Pink). Skeleton — диагональная штриховка, как в B.
 *
 * Плюсы vs B: больше разрешение мелких сегментов (240px vs 180px),
 * освобождает header. Минусы: ломает конвенцию «delta — крайне справа»
 * (теперь delta не крайний правый элемент), добавляет колонку к 300px
 * плитке, вертикальный stacked bar не так узнаваем как горизонтальный.
 */
export default function DialsTileC() {
  const list = dialColors.slice(0, 6)
  const max = list[0].count
  const total = dialColors.reduce((sum, d) => sum + d.count, 0)

  return (
    <article className="rounded-sm border border-ink/5 bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.22)]">
      <h3 className="text-[16px] font-bold uppercase leading-[1.3] tracking-[0.01em] text-gold">
        Dial colors
      </h3>

      <div className="mt-[30px] flex items-stretch gap-4">
        <ul className="flex-1 space-y-2">
          {list.map((d, i) => {
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
              <li
                key={d.name}
                className="grid min-h-[32px] grid-cols-[auto_32px_minmax(0,1fr)_auto_auto] items-center gap-3"
              >
                <span className="num w-6 text-[12px] tabular-nums text-mute-3">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span
                  className="h-8 w-8 rounded-full border border-ink/10"
                  style={swatchStyle}
                  aria-hidden
                />
                <div className="min-w-0">
                  <div className="truncate text-[14px] leading-none text-ink">{d.name}</div>
                  <div className="mt-2 h-[6px] w-full overflow-hidden rounded-[6px] bg-ink/[0.08]">
                    <div
                      className="h-full rounded-[6px] bg-ink"
                      style={{ width: `${(d.count / max) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="num text-[14px] tabular-nums text-ink">{d.count}</span>
                <DeltaChip delta={d.delta ?? 0} />
              </li>
            )
          })}
        </ul>

        {/* Вертикальная колбаса — 20px wide, full list height */}
        <div
          className="flex w-5 flex-col overflow-hidden rounded-full border border-ink/5"
          aria-label="Colour distribution"
        >
          {dialColors.map((d) => {
            const isSkeleton = d.hex.startsWith('url')
            const pct = (d.count / total) * 100
            const style = isSkeleton
              ? {
                  height: `${pct}%`,
                  backgroundImage:
                    'repeating-linear-gradient(45deg, #B5B5B5 0 3px, #DADADA 3px 6px)',
                }
              : {
                  height: `${pct}%`,
                  backgroundColor: d.hex,
                }
            return <div key={d.name} style={style} title={`${d.name} · ${d.count}`} />
          })}
        </div>
      </div>
    </article>
  )
}
