export default function Nav() {
  return (
    <header className="sticky top-0 z-30 border-b border-ink/10 bg-paper/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-8">
        <a href="/" className="flex items-center">
          <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="Watch360" className="h-8 w-auto" />
        </a>
        <nav className="hidden items-center gap-8 text-[13px] font-medium uppercase tracking-eyebrow text-ink md:flex">
          <a href="#" className="hover:text-gold">Brands</a>
          <a href="#" className="hover:text-gold">Watches</a>
          <a href="#" className="hover:text-gold">Novelties</a>
          <a href="#" className="hover:text-gold">Retailers</a>
          <a href="#" className="text-gold">Fairs</a>
          <a href="#" className="hover:text-gold">Explore</a>
        </nav>
        <div className="flex items-center gap-3">
          <a href="#" className="hidden text-[12px] font-medium uppercase tracking-eyebrow text-ink hover:text-gold md:inline">Log in</a>
          <a href="#" className="rounded-sm bg-ink-deep px-4 py-2 text-[12px] font-medium uppercase tracking-eyebrow text-paper hover:bg-ink">Get started</a>
        </div>
      </div>
    </header>
  )
}
