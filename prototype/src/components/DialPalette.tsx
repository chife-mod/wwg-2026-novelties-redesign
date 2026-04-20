import { dialColors } from '../data'
import { Eyebrow } from './common'

export default function DialPalette() {
  const total = dialColors.reduce((a, b) => a + b.count, 0)
  return (
    <section className="mx-auto max-w-[1440px] px-8 py-10">
      <div className="mb-6 flex items-end justify-between">
        <div>
          <Eyebrow>The palette of 2026</Eyebrow>
          <h3 className="mt-2 font-sans text-[28px] leading-tight text-ink">
            A year that went blue
          </h3>
          <p className="mt-2 max-w-xl text-[13px] text-mute-3">
            Swatch width proportional to the share of novelties. Blue alone accounts for nearly a quarter of
            the fair — more than twice the volume of black.
          </p>
        </div>
        <div className="text-right">
          <div className="num font-sans text-[28px] leading-none text-ink">{dialColors[0].count}</div>
          <Eyebrow className="text-mute-3">{dialColors[0].name.toLowerCase()} dials</Eyebrow>
        </div>
      </div>

      <div className="rounded-sm border border-ink/10 bg-white p-2">
        <svg width="0" height="0" className="absolute">
          <defs>
            <pattern id="skeleton" patternUnits="userSpaceOnUse" width="8" height="8" patternTransform="rotate(35)">
              <rect width="8" height="8" fill="#EEEDEC" />
              <line x1="0" y1="0" x2="0" y2="8" stroke="#A98155" strokeWidth="0.8" />
              <line x1="4" y1="0" x2="4" y2="8" stroke="#8B6337" strokeWidth="0.8" />
            </pattern>
          </defs>
        </svg>
        <div className="flex h-48 w-full items-stretch gap-1">
          {dialColors.map((c) => {
            const share = (c.count / total) * 100
            const dark = ['#111111', '#1F3F8A', '#1F4E33', '#5E3A1F'].includes(c.hex)
            return (
              <div
                key={c.name}
                className="group relative flex flex-col justify-end overflow-hidden rounded-sm"
                style={{ flexGrow: c.count, flexBasis: 0, minWidth: 36 }}
              >
                <div
                  className="absolute inset-0"
                  style={{
                    background: c.hex.startsWith('url') ? c.hex : c.hex,
                    boxShadow: c.ring ? `inset 0 0 0 1px ${c.ring}` : undefined,
                  }}
                />
                <div
                  className={`relative z-10 flex h-full flex-col justify-between p-3 ${
                    dark ? 'text-white/90' : 'text-ink'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <span className="font-sans text-[10px] uppercase tracking-eyebrow opacity-80">
                      {c.name}
                    </span>
                    <span className="num font-sans text-[12px] opacity-80">
                      {share.toFixed(0)}%
                    </span>
                  </div>
                  <div className="num font-sans text-[28px] leading-none">{c.count}</div>
                </div>
              </div>
            )
          })}
        </div>
        <div className="mt-3 flex items-center justify-between px-2 text-[10px] uppercase tracking-eyebrow text-mute-3">
          <span>{total} novelties classified · top 10 of 18</span>
          <span>Darker tones lead — 41% combined for blue · black · grey</span>
        </div>
      </div>
    </section>
  )
}
