import Link from 'next/link'
import { RevealText } from '@/components/motion/reveal-text'
import { FadeIn } from '@/components/motion/fade-in'

export function Intro() {
  return (
    <section className="relative overflow-hidden px-6 py-32 md:px-10 md:py-48">
      {/* Subtle decorative hairline — architectural cross motif */}
      <div className="pointer-events-none absolute text-ink right-[5%] top-[20%] opacity-[0.05] md:right-[8%] md:top-[25%]">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <line x1="60" y1="10" x2="60" y2="110" stroke="currentColor" strokeWidth="0.5" />
          <line x1="10" y1="60" x2="110" y2="60" stroke="currentColor" strokeWidth="0.25" />
          <rect x="45" y="45" width="30" height="30" stroke="currentColor" strokeWidth="0.25" />
        </svg>
      </div>

      <RevealText
        as="p"
        text="citgroup & Vale is a New York interior architecture studio creating thoughtful residential and hospitality spaces across the city and beyond."
        className="max-w-4xl font-display text-[clamp(1.9rem,4.4vw,3.6rem)] font-light leading-[1.15] tracking-[-0.01em] text-ink"
        stagger={0.05}
      />

      <div className="mt-14 flex flex-col gap-10 md:mt-20 md:flex-row md:items-end md:justify-between">
        <FadeIn delay={0.1}>
          <p className="max-w-md font-sans text-base font-light leading-relaxed text-stone">
            Our work balances architecture, natural materials, craftsmanship, and contemporary
            living to create interiors that feel considered rather than decorated.
          </p>
        </FadeIn>
        <FadeIn delay={0.2}>
          <Link
            href="#studio"
            className="group inline-flex items-center gap-3 font-sans text-[11px] font-normal uppercase tracking-[var(--tracking-meta)] text-ink"
          >
            About the Studio
            <span
              aria-hidden
              className="inline-block transition-transform duration-500 ease-out group-hover:translate-x-1.5"
            >
              →
            </span>
          </Link>
        </FadeIn>
      </div>
    </section>
  )
}