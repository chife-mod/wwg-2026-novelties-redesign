import type { CSSProperties, ReactNode } from 'react'
import logoManifest from '../assets/logos-manifest.json'
import { useViewMode } from './ViewModeContext'
import { TOTAL_NOVELTIES } from '../data'

/**
 * formatCount — universal helper for distribution numbers.
 *
 * REVISED 2026-04-25 (Oleg, third time):
 * The Count/% toggle does NOT change main values anymore. "58 novelties for
 * Rolex" stays "58" in BOTH modes — it's a count, not a share, and switching
 * to % loses the sense of scale. The toggle's effect now lives ONLY in delta
 * chips (DeltaChip, DeltaChipPct), where "+8 novelties" vs "+16% growth"
 * carry equivalent meaning.
 *
 * This function therefore always returns the raw count. Kept as a hook (not
 * a plain `String()` call) to preserve every call site without churn — and to
 * leave a single place to revisit if a future viz needs share-of-total again.
 *
 * The `total` parameter is kept for signature compatibility but unused.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useFormatCount() {
  // mode no longer affects count rendering; deltas carry the toggle.
  return (count: number, _total: number = TOTAL_NOVELTIES) => String(count)
}

// Сгенерирован scripts/download_logos.cjs. Формат:
//   { "Rolex": { "file": "rolex.svg", "matchedSlug": "rolex" }, "Chanel": null, ... }
// null → лого не нашлось в MinIO → BrandLogo падает на BrandMonogram (инициалы).
const LOGOS = logoManifest as Record<string, { file: string } | null>

export function Eyebrow({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`font-sans text-[11px] font-medium uppercase tracking-eyebrow text-gold ${className}`}>
      {children}
    </span>
  )
}

export function SectionTitle({
  kicker,
  title,
  subtitle,
  count,
}: {
  kicker?: string
  title: string
  subtitle?: string
  count?: number
}) {
  return (
    <div className="flex items-end justify-between gap-8 border-b border-ink/10 pb-4">
      <div>
        {kicker && <div className="mb-2"><Eyebrow>{kicker}</Eyebrow></div>}
        <h2 className="font-sans text-[34px] leading-[1.05] text-ink">{title}</h2>
        {subtitle && <p className="mt-2 max-w-xl text-sm text-mute-3">{subtitle}</p>}
      </div>
      {typeof count === 'number' && (
        <div className="shrink-0 text-right">
          <div className="num font-sans text-[40px] leading-none text-ink">{count}</div>
          <Eyebrow className="text-mute-3">total</Eyebrow>
        </div>
      )}
    </div>
  )
}

/**
 * ShowMoreButton — bottom-of-list text affordance.
 *
 * Style (revised 2026-04-25 per Oleg): text-only, NOT a full-width button.
 * Centered text with leading "+" icon — universal "expand" affordance, plays
 * better than an arrow which read as "navigate to next page". Hover → gold.
 *
 * Click bubbles up to TileShell which opens the sandbox — no own onClick.
 */
export function ShowMoreButton({ total, shown }: { total: number; shown: number }) {
  const truncated = total > shown
  return (
    <div className="mt-4 flex justify-center">
      <button
        type="button"
        className="num inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-eyebrow text-mute-3 transition-colors hover:text-gold"
      >
        <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden>
          <path d="M5.5 1.5v8M1.5 5.5h8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <span>{truncated ? `Show all ${total}` : 'Show more'}</span>
      </button>
    </div>
  )
}

/**
 * DeltaChip — count-delta chip (e.g., "+8", "-2", "±0").
 *
 * REACTIVE TO ViewMode (added 2026-04-25):
 *   - mode='count' (default): render the absolute number "+8".
 *   - mode='pct' AND `count` (current value) provided: compute relative
 *     growth as delta / (count - delta) × 100 and render "+16%".
 *   - mode='pct' but no `count`: graceful fallback to absolute delta.
 *
 * Pass `count` everywhere data allows (Brands/Collections/etc. — Ranked has
 * both `count` and `delta`). The chip then honours the global toggle.
 */
export function DeltaChip({ delta, count }: { delta?: number; count?: number }) {
  const { mode } = useViewMode()
  if (delta === undefined) return null

  // Compute % when toggle is in pct mode AND we have base data.
  let pct: number | null = null
  if (mode === 'pct' && count !== undefined) {
    const base = count - delta
    if (base > 0) {
      pct = Math.round((delta / base) * 100)
    } else if (base === 0 && delta > 0) {
      pct = 100 // brand-new appearance: 0 → N = "+100%" floor
    }
  }

  const value = pct ?? delta
  const up = value > 0
  const flat = value === 0
  const sign = up ? '+' : flat ? '±' : ''
  const bg = up
    ? 'bg-success/15 text-success'
    : flat
    ? 'bg-ink/5 text-mute-3'
    : 'bg-error/15 text-error'

  return (
    <span className={`num inline-flex min-w-[42px] items-center justify-center rounded-sm px-1.5 py-1 text-[11px] font-medium leading-none tabular-nums ${bg}`}>
      {sign}
      {value}
      {pct !== null && '%'}
    </span>
  )
}

/**
 * DeltaChipPct — percent-delta chip (e.g., "+12%", "-7%").
 *
 * REACTIVE TO ViewMode (added 2026-04-25):
 *   - mode='pct' (default): render "+12%".
 *   - mode='count' AND `absDelta` provided: render absolute "+8".
 *   - mode='count' but no `absDelta`: graceful fallback to percent.
 *
 * Used by histogram-style tiles (Price/Diameter) where the source data is
 * already a YoY percent. Pass `absDelta` (count2026 - count2025) where
 * available so the toggle's count mode shows raw novelty deltas.
 *
 * Типографика и габариты (min-w 42, py-1, leading-none, items-center)
 * ИДЕНТИЧНЫ DeltaChip — это намеренно: пользователь привыкает к одной
 * форме дельты на всём дашборде.
 */
export function DeltaChipPct({ pct, absDelta }: { pct: number; absDelta?: number }) {
  const { mode } = useViewMode()
  const useAbs = mode === 'count' && absDelta !== undefined
  const value = useAbs ? absDelta! : pct
  const up = value > 0
  const flat = value === 0
  const sign = up ? '+' : flat ? '±' : ''
  const bg = up
    ? 'bg-success/15 text-success'
    : flat
    ? 'bg-ink/5 text-mute-3'
    : 'bg-error/15 text-error'
  return (
    <span
      className={`num inline-flex min-w-[42px] items-center justify-center rounded-sm px-1.5 py-1 text-[11px] font-medium leading-none tabular-nums ${bg}`}
    >
      {sign}
      {value}
      {!useAbs && '%'}
    </span>
  )
}

/**
 * Инициалы на тёмном круге с золотой обводкой.
 * Используется в оригинальной Watch360-плитке (Variant A) и как fallback
 * для BrandLogo, когда для бренда нет файла в MinIO.
 */
export function BrandMonogram({ name, size = 40 }: { name: string; size?: number }) {
  const initials = name
    .replace(/[&.]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full border border-gold/40 bg-ink-deep font-sans text-gold"
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {initials}
    </div>
  )
}

/**
 * Реальный логотип бренда, вписанный в квадратную площадку size×size
 * по object-contain. Без рамки и подложки — лого живёт как будто поверх
 * фона карточки. Если лого для бренда в manifest'е нет (null),
 * падаем на BrandMonogram — чтобы не было пустого места в ряду.
 *
 * Почему contain, а не cover: лого бывают разного формата — крона
 * Rolex'а приближена к квадрату, двойное C Шанель — тоже, но
 * «JLC» или «Eberhard & Co.» это скорее wordmark. Contain гарантирует,
 * что ни один лого не будет обрезан — он просто зажмётся в меньшую
 * сторону (высоту или ширину), как в бар-чартах Watch360 с Google-лого.
 */
export function BrandLogo({ name, size = 28 }: { name: string; size?: number }) {
  const logo = LOGOS[name]
  if (!logo) return <BrandMonogram name={name} size={size} />

  return (
    <div
      className="flex shrink-0 items-center justify-center"
      style={{ width: size, height: size }}
    >
      <img
        src={`${import.meta.env.BASE_URL}assets/logos/${logo.file}`}
        alt={name}
        className="max-h-full max-w-full object-contain"
        loading="lazy"
      />
    </div>
  )
}

/**
 * DataTooltip — ink-deep arrow tooltip used across V4 viz tiles.
 * Visually identical to the inline PriceTileD tooltip shell (rounded-sm,
 * bg-ink-deep, ±rotated-square arrow). Consumer is responsible for the
 * outer absolute positioning; this is the inner card.
 *
 * `arrow` controls which side the rotated-square caret pokes out:
 *   'bottom' — arrow at bottom centre (tooltip floats above its anchor)
 *   'top'    — arrow at top centre (tooltip floats below its anchor)
 *   'none'   — no arrow (e.g. when tooltip is far from the cursor anchor)
 */
export function DataTooltip({
  children,
  arrow = 'bottom',
  className = '',
  style,
}: {
  children: ReactNode
  arrow?: 'top' | 'bottom' | 'none'
  className?: string
  style?: CSSProperties
}) {
  return (
    <div
      className={`relative rounded-sm bg-ink-deep px-2.5 py-1 shadow-[0_8px_20px_rgba(0,0,0,0.25)] ${className}`}
      style={style}
    >
      {children}
      {arrow === 'bottom' && (
        <span
          aria-hidden
          className="absolute left-1/2 top-full h-2 w-2 -translate-x-1/2 -translate-y-1 rotate-45 bg-ink-deep"
        />
      )}
      {arrow === 'top' && (
        <span
          aria-hidden
          className="absolute left-1/2 bottom-full h-2 w-2 -translate-x-1/2 translate-y-1 rotate-45 bg-ink-deep"
        />
      )}
    </div>
  )
}

/**
 * EditorNote — Cormorant italic 18px paragraph below a tile's chart.
 * Top hairline separates it from the chart. Used by V4 flagship tiles
 * (Brands, MarketMap, Price). The font shift IS the marker — no eyebrow,
 * no badge, no "Insight" label (per V4 §4 / §7 anti-list).
 */
export function EditorNote({ text }: { text: string }) {
  return (
    <div className="mt-4 border-t border-ink/10 pt-4">
      <p
        className="text-[18px] italic leading-[1.4] text-ink/70"
        style={{ fontFamily: '"Cormorant Garamond", Georgia, serif' }}
      >
        {text}
      </p>
    </div>
  )
}

export function WatchPlaceholder({ name, size = 96 }: { name: string; size?: number }) {
  const initials = name
    .replace(/[&.]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
  return (
    <div
      className="relative"
      style={{ width: size, height: size }}
      aria-label={`${name} placeholder`}
    >
      {/* gold arc */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id={`arc-${name.replace(/[^a-z]/gi, '')}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D49E64" />
            <stop offset="100%" stopColor="#A98155" />
          </linearGradient>
        </defs>
        <circle
          cx="50"
          cy="50"
          r="47"
          fill="none"
          stroke={`url(#arc-${name.replace(/[^a-z]/gi, '')})`}
          strokeWidth="1.5"
          strokeDasharray="90 300"
          strokeDashoffset="-20"
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
        />
      </svg>
      {/* watch face placeholder */}
      <div className="absolute inset-[10%] flex items-center justify-center rounded-full bg-gradient-to-br from-[#2a2926] to-[#14130f] font-sans text-gold shadow-inner">
        <span style={{ fontSize: size * 0.2 }} className="tracking-wide">{initials}</span>
      </div>
      {/* crown dot */}
      <div
        className="absolute rounded-full bg-gold"
        style={{ width: size * 0.04, height: size * 0.1, right: size * 0.04, top: size * 0.44 }}
      />
    </div>
  )
}
