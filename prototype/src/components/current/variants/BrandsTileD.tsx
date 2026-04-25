import { brands } from '../../../data'
import { BrandLogo, DeltaChip, ShowMoreButton, useFormatCount } from '../../common'

/**
 * Variant D — короче, мягче, «эдиториал».
 *
 * Отличия от Variant C:
 *   1. Заголовок укорочен до «Top brands» и перекрашен в gold (#A98155) —
 *      тот же оттенок, что использовался kicker'ом «MAISONS» в оригинальной
 *      версии A. Идея: заголовок сам работает eyebrow'ом, цвет-акцент
 *      выполняет роль иерархии.
 *   2. Убран префикс «№» — только голые номера «01 / 02 / 03». Ранг
 *      читается быстрее, колонка уже (w-6 вместо w-9).
 *   3. Row height = 32px, logo 32×32, row gap 8px (space-y-2). Строка
 *      выше, чем в C (там было ~28 с gap 12), но плотнее по вертикали —
 *      итого лист из 6 строк ~240 вместо ~228. Лого стало заметнее,
 *      бар остался той же ширины (колонка гибкая, не зависит от лого).
 */
export default function BrandsTileD() {
  const list = brands.slice(0, 10)
  const max = list[0].count
  const fmt = useFormatCount()

  return (
    <article className="rounded-sm border border-ink/5 bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.22)]">
      <h3 className="text-[16px] font-bold uppercase leading-[1.3] tracking-[0.01em] text-gold">
        Top brands
      </h3>

      {/*
        Общий grid на весь список (см. BrandsTileD1 для длинного объяснения):
        `display: contents` на <li> превращает детей в прямых grid-items <ul>,
        и треки колонок count/delta становятся едиными для всех 6 строк.
      */}
      {/*
        Per-row grid паттерн (как в CollectionsTileB) — каждая <li> сама
        по себе grid с min-h-[32px]. items-center центрирует все ячейки
        по центру 32px-строки. Это единый паттерн для всех list-тайлов,
        чтобы выравнивание count/delta было консистентным везде.
      */}
      <ul className="mt-[30px] space-y-2">
        {list.map((b, i) => (
          <li
            key={b.name}
            className="grid min-h-[32px] grid-cols-[auto_32px_minmax(0,1fr)_auto_auto] items-center gap-3"
          >
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
            <span className="num text-[14px] tabular-nums text-ink">{fmt(b.count)}</span>
            <DeltaChip delta={b.delta} count={b.count} />
          </li>
        ))}
      </ul>
      <ShowMoreButton total={brands.length} shown={list.length} />
    </article>
  )
}
