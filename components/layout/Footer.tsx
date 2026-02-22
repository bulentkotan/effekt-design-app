export default function Footer() {
  return (
    <footer className="border-t border-border bg-bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <p className="text-xs tracking-brand-wide text-text-dark uppercase font-medium">
              Effekt Design
            </p>
            <p className="text-xs text-text-muted mt-1">
              Landscape Design & Build — Dubai, UAE
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 text-xs text-text-muted">
            <a
              href="mailto:paula@effekt-design.com"
              className="hover:text-brand-green transition-colors"
            >
              paula@effekt-design.com
            </a>
            <span className="hidden sm:inline">·</span>
            <a
              href="tel:+971551392887"
              className="hover:text-brand-green transition-colors"
            >
              +971 55 139 2887
            </a>
            <span className="hidden sm:inline">·</span>
            <a
              href="https://effekt-design.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-brand-green transition-colors"
            >
              effekt-design.com
            </a>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-border text-center">
          <p className="text-xs text-text-muted">
            &copy; {new Date().getFullYear()} Effekt Design. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
