export default function FooterStrip() {
  return (
    <footer className="mt-12 border-t border-ink/10 bg-ink-deep text-paper">
      <div className="mx-auto flex max-w-[1440px] flex-col gap-6 px-8 py-10 md:flex-row md:items-end md:justify-between">
        <div>
          <div className="font-sans text-[10px] uppercase tracking-eyebrow text-gold">
            Methodology
          </div>
          <p className="mt-2 max-w-2xl text-[12px] leading-relaxed text-mute-2">
            Counts reflect novelties registered in the Watch360 catalogue for Watches &amp; Wonders Geneva 2026
            as of the report date. Deltas compare against WWG 2025. Price tiers use the manufacturer&apos;s
            suggested retail price in USD. Dial, case and strap taxonomies follow Watch360&apos;s classification.
          </p>
        </div>
        <div className="flex items-center gap-8 text-[11px] uppercase tracking-eyebrow text-mute-2">
          <div>
            <div className="text-gold">Report date</div>
            <div className="mt-1 text-paper">April 2026</div>
          </div>
          <div>
            <div className="text-gold">Dataset</div>
            <div className="mt-1 text-paper">478 novelties · 61 brands</div>
          </div>
          <div>
            <div className="text-gold">Version</div>
            <div className="mt-1 text-paper">V1 · Cover Story</div>
          </div>
        </div>
      </div>
    </footer>
  )
}
