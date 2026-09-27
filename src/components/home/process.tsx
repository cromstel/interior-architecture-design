import { processStages } from '@/data/site'
import { RevealText } from '@/components/motion/reveal-text'
import { FadeIn } from '@/components/motion/fade-in'

export function Process() {
  return (
    <section className="relative overflow-hidden bg-cream px-6 py-24 md:px-10 md:py-44">
      {/* Subtle decorative hairline diamond — architectural geometry */}
      <div className="pointer-events-none absolute text-ink right-[3%] top-[8%] opacity-[0.06] md:right-[2%] md:top-[12%]">
        <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <polygon points="70,5 135,70 70,135 5,70" stroke="currentColor" strokeWidth="0.5" fill="none" />
          <circle cx="70" cy="70" r="25" stroke="currentColor" strokeWidth="0.25" fill="none" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl">
        <RevealText
          as="h2"
          text="Design Process"
          className="font-display text-[clamp(2.6rem,6vw,5.5rem)] font-light leading-none tracking-[-0.01em] text-ink"
        />
        <p className="meta-label mt-6">Six stages, from first conversation to final object</p>

        <div className="relative mt-16 md:mt-24">
          <div
            aria-hidden
            className="absolute bottom-4 left-[7px] top-4 hidden w-px bg-ink/12 md:left-2 md:block"
          />
          <ol className="space-y-0 md:ml-14">
            {processStages.map((stage, i) => (
              <li key={stage.number}>
                <FadeIn delay={0.05 * i}>
                  <div className="relative grid gap-3 border-b border-ink/10 py-10 md:grid-cols-[1fr_3fr] md:gap-12 md:py-12">
                    <div className="relative flex items-baseline gap-5 md:block md:gap-0">
                      <span
                        aria-hidden
                        className="absolute left-[-66px] top-[3.4rem] hidden h-[3px] w-[3px] rounded-full bg-ink md:block"
                      />
                      <span
                        aria-hidden
                        className="font-display text-[clamp(1.6rem,3.2vw,2.6rem)] font-light leading-none text-ink"
                      >
                        {stage.number}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-normal uppercase tracking-[var(--tracking-meta)] text-ink md:text-xl">
                        {stage.title}
                      </h3>
                      <p className="mt-4 max-w-xl font-sans text-sm font-light leading-relaxed text-stone">
                        {stage.body}
                      </p>
                    </div>
                  </div>
                </FadeIn>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  )
}