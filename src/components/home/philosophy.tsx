import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
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

          <div className="mt-10 max-w-2xl space-y-6 md:mt-12">
            <p className="font-sans text-sm font-light leading-relaxed text-stone md:text-base">
              This is an unfashionable position, and it is deliberate. The temptation in interior
              work is to treat the room as a surface to be finished — to arrive at the end of a
              project with everything specified and nothing resolved. We work the other way around.
              A room is settled long before anything is placed in it, by the height of its ceiling,
              by the direction it faces, and by what the light does across an ordinary afternoon in
              March. Everything after that is a matter of not getting in the way.
            </p>

            <p className="font-sans text-sm font-light leading-relaxed text-stone md:text-base">
              The second discipline is subtraction. Twice as many materials are brought to a project
              as will ever survive in the finished room, and the work is holding the line — letting
              each remaining material be itself rather than competing for attention. A room with
              three honest materials feels richer than one with nine that are merely present, and it
              is far easier to live in.
            </p>

            <p className="font-sans text-sm font-light leading-relaxed text-stone md:text-base">
              The third is time. Stone is honed rather than polished because a hand will reach for
              it every day. Timber is left to silver where weather will reach it, and deepened
              where it will not. A finish chosen for how it looks on the day it is installed is a
              finish that will be wrong within a year; the work should improve for as long as the
              building stands.
            </p>

            <p className="font-sans text-sm font-light leading-relaxed text-stone md:text-base">
              In an old building, the original should still be readable a century from now. New work
              is reversible wherever it can be, and honest about what it is — we do not disguise the
              new as old, and we do not strip away what was there in order to make our own decision
              look cleaner. The house was standing before us, and it will be standing after.
            </p>
          </div>

          <FadeIn delay={0.1} className="mt-10">
            <Link
              href="/about/"
              className="group inline-flex items-center gap-3 font-sans text-[11px] uppercase tracking-[var(--tracking-meta)] text-ink"
            >
              Read the studio’s approach
              <ArrowUpRight
                size={13}
                strokeWidth={1.5}
                className="transition-transform duration-500 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </Link>
          </FadeIn>
        </FadeIn>
      </div>
    </section>
  )
}