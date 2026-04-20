export type Version = 'v1' | 'v2'

const versions: { id: Version; label: string; kicker: string }[] = [
  { id: 'v2', label: 'The Window',       kicker: 'V2' },
  { id: 'v1', label: 'Editorial Report', kicker: 'V1' },
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
                className={`group relative flex items-baseline gap-2 rounded-sm px-3 py-1.5 text-[11px] uppercase tracking-eyebrow transition-colors ${
                  on ? 'text-paper' : 'text-mute-2 hover:text-paper'
                }`}
              >
                <span className={`num font-medium ${on ? 'text-gold' : 'text-mute-3'}`}>{v.kicker}</span>
                <span>{v.label}</span>
                {on && <span className="absolute -bottom-0.5 left-3 right-3 h-px bg-gold" />}
              </button>
            )
          })}
          <span className="ml-3 hidden rounded-sm border border-white/15 px-2 py-0.5 text-[10px] uppercase tracking-eyebrow text-mute-2 md:inline">
            press 1 / 2
          </span>
        </div>
      </div>
    </div>
  )
}
