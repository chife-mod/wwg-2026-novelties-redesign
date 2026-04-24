import { brands } from '../../../data'
import { BrandLogo, DeltaChip } from '../../common'

/**
 * Variant E — per-row flex, name+bar как один блок, центрированный по логотипу.
 *
 * Гипотеза (из Figma-реконструкции): вместо жёсткого display:contents grid'а
 * (который выравнивает треки колонок между строками, но ломает вертикальную
 * оси внутри строки) — использовать per-row flex:
 *
 *   [rank] [logo] [ name + bar stack ............... ] [ count | delta ]
 *
 * Выравнивание:
 *   1. Строка = высота логотипа (32px). rank и logo — self-center по строке.
 *   2. name+bar — один блок, flex-1. Блок центрируется по центру логотипа
 *      (items-center на родителе). Внутри блока name сверху, bar снизу,
 *      mt-2 между ними.
 *   3. ПРАВАЯ часть (count + delta) выровнена с NAME по одной базовой линии
 *      (items-center на top-row блоке с leading-none — digit и имя имеют
 *      одинаковый 14px cap-height, visual baseline совпадает). Delta
 *      центрируется по вертикальному центру count'а — тот же items-center
 *      на mini-flex'е [count, delta].
 *
 * Cross-row column alignment (count edge, delta edge) больше не
 * гарантирован — но `justify-self-end` в D тоже не гарантировал ничего
 * кроме правого края, а 2-3 цифровые count'ы всё равно «плавали».
 * В обмен получаем корректную вертикаль внутри строки, что важнее.
 */
export default function BrandsTileE() {
  const list = brands.slice(0, 6)
  const max = list[0].count

  return (
    <article className="rounded-sm border border-ink/5 bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.22)]">
      <h3 className="text-[16px] font-bold uppercase leading-[1.3] tracking-[0.01em] text-gold">
        Top brands
      </h3>

      <ul className="mt-[30px] space-y-2">
        {list.map((b, i) => (
          <li key={b.name} className="flex items-center gap-3">
            {/* Rank — self-center, ширина фиксирована чтобы логотипы
                выстраивались по одной вертикали. */}
            <span className="num w-6 shrink-0 text-[12px] tabular-nums text-mute-3">
              {String(i + 1).padStart(2, '0')}
            </span>

            {/* Logo — опорная высота строки (32×32). */}
            <div className="shrink-0">
              <BrandLogo name={b.name} size={32} />
            </div>

            {/* Name+bar как один блок. items-center на <li> центрирует
                этот блок по вертикальному центру логотипа. */}
            <div className="min-w-0 flex-1">
              {/* Top row: name слева, [count, delta] справа.
                  items-center + leading-none на text — name и count
                  оказываются на одной базовой линии (одинаковый 14px
                  cap-height), а delta-chip центрируется по
                  вертикальному центру count'а. */}
              <div className="flex items-center justify-between gap-3">
                <span className="truncate text-[14px] leading-none text-ink">
                  {b.name}
                </span>
                <div className="flex shrink-0 items-center gap-2">
                  <span className="num text-[14px] leading-none tabular-nums text-ink">
                    {b.count}
                  </span>
                  <DeltaChip delta={b.delta} />
                </div>
              </div>

              {/* Bar — mt-2 под name+count. */}
              <div className="mt-2 h-[6px] w-full overflow-hidden rounded-[6px] bg-ink/[0.08]">
                <div
                  className="h-full rounded-[6px] bg-ink"
                  style={{ width: `${(b.count / max) * 100}%` }}
                />
              </div>
            </div>
          </li>
        ))}
      </ul>
    </article>
  )
}
