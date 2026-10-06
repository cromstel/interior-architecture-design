import { site } from '@/data/config'
import { RevealText } from '@/components/motion/reveal-text'
import { FadeIn } from '@/components/motion/fade-in'
import { ParallaxImage } from '@/components/motion/parallax-image'

export function Studio() {
  return (
    <section id="studio" className="relative scroll-mt-24 overflow-hidden bg-sand px-6 py-28 md:px-10 md:py-44">
      {/* Decorative geometric shape: subtle hairline circle, architectural motif */}
      <div className="pointer-events-none absolute text-ink right-[-5%] top-[10%] opacity-[0.07] md:right-[-2%] md:top-[15%]">
        <svg width="420" height="420" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
          <circle cx="100" cy="100" r="95" stroke="currentColor" strokeWidth="0.5" />
          <circle cx="100" cy="100" r="65" stroke="currentColor" strokeWidth="0.25" />
          <line x1="100" y1="5" x2="100" y2="195" stroke="currentColor" strokeWidth="0.25" />
          <line x1="5" y1="100" x2="195" y2="100" stroke="currentColor" strokeWidth="0.25" />
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl">
        <RevealText
          as="h2"
          text="The Studio"
          className="font-display text-[clamp(2.6rem,6vw,5.5rem)] font-light leading-none tracking-[-0.01em] text-ink"
        />
        <p className="meta-label-sand mt-6">Founders</p>

        {/* Three founders, one row, all portraits on the same baseline.

            The two-founder version staggered the second card down
            (`i === 1 ? 'md:mt-24 lg:mt-32'`), which read as deliberate with a pair
            and as misalignment with three: the right-hand portrait sat 96-128px
            below the others. Removing the offset is the whole fix, so the cards
            now share one `items-start` row with no per-item margin.

            The `sizes` is derived from the grid, not guessed. A flat pixel number
            cannot describe this box, because the column is fluid below its cap
            and only stops growing once `max-w-7xl` is reached. Measured widths:
            363px at 1440, 355px at 900, 327px at 390. So each band is the grid
            arithmetic, with `min()` pinning the 3-column band to its 363px
            ceiling:

              container      = min(1280px, 100vw - padding)
              3 cols, gap-24 = (100vw - 80 - 2 x 96) / 3 = (100vw - 272) / 3
              2 cols, gap-24 = (100vw - 80 - 96) / 2     = (100vw - 176) / 2
              2 cols, gap-16 = (100vw - 48 - 64) / 2     = (100vw - 112) / 2
              1 col          = 100vw - 48

            A flat `288px` for the middle band, tried first, understated the real
            box by 67px at 900 -- which makes the browser pick a smaller candidate
            than the frame can display. Over-declaring only costs a larger file;
            under-declaring costs sharpness, so the bands are exact.

            Declaring `vw` here was the earlier bug on this section: `45vw`
            over-selected badly, promising 864px for a 592px box at 1920. And the
            two-column cap it left behind, `608px`, was itself wrong for the
            `md:gap-24` it sat in -- 592px, not 608. */}
        <div className="mt-16 grid grid-cols-1 gap-16 sm:grid-cols-2 md:mt-28 md:gap-24 lg:grid-cols-3">
          {site.founders.map((founder) => (
            <article key={founder.name} className="md:mt-0">
              <FadeIn>
                {founder.image ? (
                  <ParallaxImage
                    src={founder.image}
                    alt={founder.imageAlt ?? ''}
                    ratio="portrait"
                    amount={0.07}
                    sizes="(min-width: 1024px) min(363px, calc((100vw - 272px) / 3)), (min-width: 768px) calc((100vw - 176px) / 2), (min-width: 640px) calc((100vw - 112px) / 2), calc(100vw - 3rem)"
                  />
                ) : (
                  // A founder without a portrait gets a typographic tile rather
                  // than a broken image. Same 3/4 box, same ink-on-sand palette,
                  // so the row stays aligned while a photograph is outstanding.
                  <div
                    aria-hidden
                    className="flex aspect-[3/4] items-end bg-ink/[0.06] p-6 md:p-8"
                  >
                    <span className="font-display text-[clamp(2.4rem,5vw,3.6rem)] font-light leading-none tracking-[-0.01em] text-ink/25">
                      {founder.name
                        .split(' ')
                        .map((part) => part[0])
                        .join('')}
                    </span>
                  </div>
                )}
              </FadeIn>
              <div className="mt-8 md:mt-10">
                <h3 className="font-display text-[clamp(1.8rem,3.4vw,2.9rem)] font-light leading-none text-ink">
                  {founder.name}
                </h3>
                <p className="meta-label-sand mt-3">{founder.role}</p>
                <p className="mt-6 max-w-sm font-sans text-sm font-light leading-relaxed text-charcoal">
                  {founder.bio}
                </p>
              </div>
            </article>
          ))}
        </div>

        <FadeIn delay={0.15} className="mt-24 md:mt-32">
          <p className="max-w-4xl font-display text-[clamp(1.6rem,3.4vw,2.7rem)] font-light leading-[1.25] text-ink">
            {site.story}
          </p>
        </FadeIn>
      </div>
    </section>
  )
}