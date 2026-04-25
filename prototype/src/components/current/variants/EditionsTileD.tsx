import { useEffect, useRef, useState } from 'react'
import { editions } from '../../../data'
import { DeltaChip } from '../../common'

/**
 * Variant D — полосатые плиты + inline-легенда «chip + name + count + delta».
 *
 * Что стало:
 *   — Легенда снова несёт числа и дельты (клиент просил delta везде).
 *     Одна горизонтальная строка: [chip] Limited 89 +14, [chip] Anniversary
 *     24 −3, [chip] Partnership 11 +6. Выровнена по левому краю, с
 *     зазором gap-x-10 между парами.
 *   — На плите число живёт дублирующе — как акцентная цифра «массы».
 *     Когда плита сужается (узкий вьюпорт или узкая пропорция), цифра
 *     адаптивно прячется: ResizeObserver ловит ширину плиты < 72px и
 *     снимает её. Легенда внизу всё равно покрывает данные, так что
 *     потеря числа на плите не страшна.
 *   — minWidth с плит снят — пусть Partnership на узком вьюпорте
 *     сжимается до настоящей пропорции, а не держит форсированный floor.
 *
 * Штриховка: 3px шаг, low-contrast тона (fabric/guilloché sample).
 */

const COLOR: Record<
  string,
  { base: string; stripe: string; fg: string }
> = {
  'Limited Edition':     { base: '#A98155', stripe: '#B28B5E', fg: '#FFFFFF' },
  'Anniversary Edition': { base: '#1E1D19', stripe: '#2A2824', fg: '#FFFFFF' },
  'Partnership Edition': { base: '#C6C6C6', stripe: '#D0D0D0', fg: '#1E1D19' },
}

// Порог, ниже которого число на плите снимается. «11» при 36px font-light
// занимает ~24px, плюс left-3 (12px) = 36px, плюс 8px воздуха = 44px.
// «89» / «24» сидят на заведомо широких плитах, общий минимум 44
// работает для всех.
const NUM_MIN_WIDTH = 44

type PlateProps = {
  edition: (typeof editions)[number]
  color: { base: string; stripe: string; fg: string }
  pct: number
}

function EditionPlate({ edition, color, pct }: PlateProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [fits, setFits] = useState(true)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => {
      setFits(entry.contentRect.width >= NUM_MIN_WIDTH)
    })
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="relative overflow-hidden rounded-sm"
      style={{
        width: `${pct}%`,
        background: `repeating-linear-gradient(45deg, ${color.base} 0 3px, ${color.stripe} 3px 6px)`,
      }}
      aria-label={`${edition.name}: ${edition.count}`}
    >
      {fits && (
        <div
          className="num absolute left-3 top-2 text-[36px] font-light leading-none tabular-nums"
          style={{ color: color.fg }}
        >
          {edition.count}
        </div>
      )}
    </div>
  )
}

export default function EditionsTileD() {
  const total = editions.reduce((a, b) => a + b.count, 0)

  return (
    <article className="rounded-sm border border-ink/5 bg-white p-6 shadow-[0_20px_40px_rgba(0,0,0,0.22)]">
      <h3 className="text-[16px] font-bold uppercase leading-[1.3] tracking-[0.01em] text-gold">
        Special editions
      </h3>

      <div className="mt-6 flex h-[140px] gap-2">
        {editions.map((e) => (
          <EditionPlate
            key={e.name}
            edition={e}
            color={COLOR[e.name] ?? { base: '#999', stripe: '#BBB', fg: '#FFF' }}
            pct={(e.count / total) * 100}
          />
        ))}
      </div>

      {/* Легенда — inline, одна строка, слева: chip + name + count + delta.
          gap-x-10 (~40px) между парами, gap-2 внутри пары. */}
      <ul className="mt-4 flex flex-wrap items-center gap-x-10 gap-y-2">
        {editions.map((e) => (
          <li key={e.name} className="flex items-center gap-2">
            <span
              className="h-[10px] w-[10px] rounded-[2px]"
              style={{ backgroundColor: COLOR[e.name]?.base ?? '#999' }}
              aria-hidden
            />
            <span className="text-[14px] leading-none text-ink">
              {e.name.replace(' Edition', '')}
            </span>
            <span className="num text-[14px] tabular-nums text-ink">{e.count}</span>
            <DeltaChip delta={e.delta ?? 0} count={e.count} />
          </li>
        ))}
      </ul>
    </article>
  )
}
