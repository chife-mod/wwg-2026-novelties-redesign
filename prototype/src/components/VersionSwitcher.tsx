// Versioning convention (set 2026-04-25):
//   v1 = Editorial Report (original cover story)
//   v2 = The Window (hero-slider + sticky-collection rail)
//   v3 = "current" — canonical tile-variant sandbox page
//   v4 = Editorial+ — new editorial-grade right grid (MarketMap, etc.)
//   v5 = V3 with PriceTile swapped for MarketMap (under Price ranges header)
//
// Switcher order is REVERSED (newest leftmost) per Oleg 2026-04-25:
//   [V5] [V4] [V3] [V2] [V1]
// Labels are bare V-numbers — no descriptive subtitles, no keyboard hint chip.
export type Version = 'v1' | 'v2' | 'v3' | 'v4' | 'v5'

const versions: { id: Version; kicker: string }[] = [
  { id: 'v5', kicker: 'V5' },
  { id: 'v4', kicker: 'V4' },
  { id: 'v3', kicker: 'V3' },
  { id: 'v2', kicker: 'V2' },
  { id: 'v1', kicker: 'V1' },
]

export default function VersionSwitcher({
  active,
  onChange,
}: {
  active: Version
  onChange: (v: Version) => void
}) {
  return (
    <div className="w-full bg-ink-deep text-paper">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between px-8 py-2.5">
        <div className="flex items-center gap-3 text-[10px] uppercase tracking-eyebrow text-mute-2">
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-gold" />
          Prototype · switch view
        </div>
        <div className="flex items-center gap-1">
          {versions.map((v) => {
            const on = v.id === active
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => onChange(v.id)}
                className={`group relative rounded-sm px-3 py-1.5 text-[11px] font-medium uppercase tracking-eyebrow transition-colors ${
                  on ? 'text-gold' : 'text-mute-3 hover:text-paper'
                }`}
              >
                <span className="num">{v.kicker}</span>
                {on && <span className="absolute -bottom-0.5 left-3 right-3 h-px bg-gold" />}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
