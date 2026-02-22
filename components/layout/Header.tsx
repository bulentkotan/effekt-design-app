'use client'

import Link from 'next/link'

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg-white/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          <Link href="/" className="flex flex-col items-start">
            <span className="text-sm sm:text-base font-semibold tracking-brand-wide text-text-dark uppercase">
              Effekt Design
            </span>
            <span className="text-[10px] sm:text-xs tracking-brand text-text-muted uppercase">
              Landscape Design & Build
            </span>
          </Link>

          <a
            href="https://effekt-design.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs tracking-brand text-text-muted uppercase hover:text-brand-green transition-colors"
          >
            effekt-design.com
          </a>
        </div>
      </div>
    </header>
  )
}
