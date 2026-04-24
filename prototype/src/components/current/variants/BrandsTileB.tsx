import { brands } from '../../../data'
import { BrandLogo, DeltaChip } from '../../common'

/**
 * Variant C — Watch360 native layout с двумя отличиями от Variant B:
 *   1. Explicit rank numbers «№ 01 / № 02 / № 03» — возвращаем клиентский
 *      запрос явной иерархии.
 *   2. Real brand logos вместо кружочков-монограмм. Лого живёт в 28×28 боксе,
 *      object-contain — как в бар-чартах Watch360 с Google-лого: любая
 *      пропорция лого помещается либо по высоте, либо по ширине.
 *      Если файла нет в manifest'е — BrandLogo сам падает на BrandMonogram,
 *      чтобы не было пустого места.
 *
 * Гипотеза: «тяжёлая» версия (номера + лого) читается авторитетнее, но
 * проиграет по чистоте композиции Variant B. Сравним.
 */
export default function BrandsTileB() {
  const list = brands.slice(0, 6)
  const max = list[0].count

  return (
    <article className="rounded-sm border border-ink/5 bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.22)]">
      <h3 className="text-[16px] font-bold uppercase leading-[1.3] tracking-[0.01em] text-ink">
        Top brands at the fair
      </h3>

      <ul className="mt-[30px] space-y-3">
        {list.map((b, i) => (
          <li
            key={b.name}
            className="grid grid-cols-[auto_28px_minmax(0,1fr)_auto_auto] items-center gap-3"
          >
            <span className="num w-9 text-[12px] tabular-nums text-mute-3">
              № {String(i + 1).padStart(2, '0')}
            </span>
            <BrandLogo name={b.name} size={28} />
            <div className="min-w-0">
              <div className="truncate text-[14px] leading-none text-ink">{b.name}</div>
              <div className="mt-2 h-[6px] w-full overflow-hidden rounded-[6px] bg-ink/[0.08]">
                <div
                  className="h-full rounded-[6px] bg-ink"
                  style={{ width: `${(b.count / max) * 100}%` }}
                />
              </div>
            </div>
            <span className="num text-[14px] tabular-nums text-ink">{b.count}</span>
            <DeltaChip delta={b.delta} />
          </li>
        ))}
      </ul>
    </article>
  )
}
