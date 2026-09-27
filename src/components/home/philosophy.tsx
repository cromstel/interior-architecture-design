import { RevealText } from '@/components/motion/reveal-text'
import { FadeIn } from '@/components/motion/fade-in'

export function Philosophy() {
  return (
    <section className="relative overflow-hidden px-6 py-36 md:px-10 md:py-56">
      {/* Subtle decorative hairline square — architectural motif */}
      <div className="pointer-events-none absolute text-ink left-[8%] top-[15%] opacity-[0.06] md:left-[5%] md:top-[20%]">
        <svg width="160" height="160" viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <rect x="10" y="10" width="140" height="140" stroke="currentColor" strokeWidth="0.5" />
          <line x1="10" y1="80" x2="150" y2="80" stroke="currentColor" strokeWidth="0.25" />
          <line x1="80" y1="10" x2="80" y2="150" stroke="currentColor" strokeWidth="0.25" />
          <circle cx="80" cy="80" r="35" stroke="currentColor" strokeWidth="0.25" />
        </svg>
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <RevealText
          as="h2"
          text="We design spaces meant to become more beautiful with time."
          className="text-balance font-display text-[clamp(2.6rem,7vw,6.5rem)] font-light leading-[1.02] tracking-[-0.015em] text-ink"
          stagger={0.07}
        />
        <FadeIn delay={0.2} className="mt-14 md:mt-20">
          <p className="max-w-2xl font-sans text-base font-light leading-relaxed text-stone md:text-lg">
            Our approach begins with architecture and proportion. Materials are chosen for how they
            age, light is treated as part of the architecture, and every object is considered in
            relation to the space around it.
          </p>
        </FadeIn>
      </div>
    </section>
  )
}