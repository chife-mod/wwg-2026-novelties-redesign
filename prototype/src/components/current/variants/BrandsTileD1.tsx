import { brands } from '../../../data'
import { BrandLogo } from '../../common'

/**
 * Variant D₁ — stress-test большого delta.
 *
 * Copy of BrandsTileD, но с синтетическими 3- и 4-значными дельтами и
 * `%`-суффиксом — ровно как на живом дашборде Watch360 в рабочем скрине.
 * Смысл: посмотреть, как ведёт себя колонка дельт, когда приходят
 * настоящие year-over-year проценты и бейдж физически растягивается.
 *
 * Зачем отдельный компонент: в data.ts дельты — абсолютные числа
 * (+8, -3, 0). Меня вариант сознательно подменяет данные только в
 * этом тайле, чтобы не испортить остальным плиткам ни форму, ни
 * семантику. На морде по-прежнему рендерится Variant D с нормальными
 * числами; D₁ живёт только в Sandbox'е как «а что если».
 */

// Злые проценты — формирую вручную, чтобы покрыть типовые кейсы:
// маленький, средний, 3-значный, 4-значный, отрицательный с 3 цифрами, flat.
const STRESS_DELTAS_PCT = [+127, +1267, -98, +42, +834, -215]

/**
 * Локальная копия DeltaChip с `%`-суффиксом.
 * Не тащу в общий common.tsx, чтобы остальные тайлы продолжали показывать
 * абсолютные числа без процентов (абсолютные читабельнее для «штук на выставке»).
 */
function DeltaChipPct({ delta }: { delta: number }) {
  const up = delta > 0
  const flat = delta === 0
  const sign = up ? '+' : flat ? '±' : ''
  const bg = up
    ? 'bg-success/15 text-success'
    : flat
    ? 'bg-ink/5 text-mute-3'
    : 'bg-error/15 text-error'
  return (
    <span
      className={`num inline-flex min-w-[42px] justify-center rounded-sm px-1.5 py-0.5 text-[11px] font-medium tabular-nums ${bg}`}
    >
      {sign}
      {delta}%
    </span>
  )
}

export default function BrandsTileD1() {
  const list = brands.slice(0, 6)
  const max = list[0].count

  return (
    <article className="rounded-sm border border-ink/5 bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.22)]">
      <h3 className="text-[16px] font-bold uppercase leading-[1.3] tracking-[0.01em] text-gold">
        Top brands <span className="text-mute-3">(large deltas)</span>
      </h3>

      {/*
        Один общий grid на весь список — чтобы все 6 строк делили общие треки.
        CSS-трюк: <li class="contents"> выкидывает <li> из бокс-модели, но
        сохраняет семантику «ряд списка». Дети <li> становятся прямыми
        grid-items <ul> → колонки count и delta выстраиваются по MAX ширине
        через все строки, а `justify-self-end` получает пространство,
        чтобы прибить правые края.
      */}
      <ul className="mt-[30px] grid grid-cols-[auto_32px_minmax(0,1fr)_auto_auto] auto-rows-[minmax(32px,auto)] items-center gap-x-3 gap-y-2">
        {list.map((b, i) => (
          <li key={b.name} className="contents">
            <span className="num w-6 text-[12px] tabular-nums text-mute-3">
              {String(i + 1).padStart(2, '0')}
            </span>
            <BrandLogo name={b.name} size={32} />
            <div className="min-w-0">
              <div className="truncate text-[14px] leading-none text-ink">{b.name}</div>
              <div className="mt-2 h-[6px] w-full overflow-hidden rounded-[6px] bg-ink/[0.08]">
                <div
                  className="h-full rounded-[6px] bg-ink"
                  style={{ width: `${(b.count / max) * 100}%` }}
                />
              </div>
            </div>
            <span className="num justify-self-end text-[14px] tabular-nums text-ink">
              {b.count}
            </span>
            <span className="justify-self-end">
              <DeltaChipPct delta={STRESS_DELTAS_PCT[i]} />
            </span>
          </li>
        ))}
      </ul>
    </article>
  )
}
