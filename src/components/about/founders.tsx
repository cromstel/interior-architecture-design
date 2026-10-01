import { site } from '@/data/config'
import { FadeIn } from '@/components/motion/fade-in'
import { lg } from '@/lib/image-variants'
import { srcSetFor } from '@/lib/responsive-image'

/**
 * The founders section of the About page.
 *
 * Extracted from the page so the About route and the homepage studio section
 * stay in step; the About page is the fuller treatment and the homepage teaser
 * deliberately links here rather than repeating the copy.
 *
 * The `sizes` below is a pixel cap, not a viewport percentage, and that is
 * load-bearing. The image sits in `col-span-4` of a 12-column grid nested inside
 * a `col-span-9` column of a `max-w-7xl` container, so it settles at about
 * 290px and stops growing however wide the viewport gets:
 *
 *   container  = min(1280px, 100vw - 80px)      (max-w-7xl, md:px-10)
 *   col width  = (container - 11 x 40px) / 12
 *   content    = 9 cols + 8 gaps
 *   portrait   = 4 cols + 3 gaps  ->  290px at full width
 *
 * Expressed in `vw` it kept climbing past 290px on large screens, which makes
 * the browser select a larger candidate than the box can ever display: the
 * original `32vw` promised 320px for a 196px box at a 1000px viewport, a 1.6x
 * overstatement that forced the 1200w file where the 800w tier is plenty. The
 * founders' only tiers are 800w and 1200w (no `-lg` exists), so the ceiling here
 * is 600px — comfortably above the box at any DPR worth serving.
 */
export function Founders() {
  return (
    <section aria-labelledby="founders" className="bg-ivory px-6 py-20 md:px-10 md:py-32">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-12 md:gap-10">
          <h2 id="founders" className="meta-label md:col-span-3">
            Founders
          </h2>

          <div className="md:col-span-9 md:col-start-4">
            {site.founders.map((founder, i) => (
              <FadeIn key={founder.name} delay={0.05 * i}>
                <article
                  className={
                    i === 0
                      ? 'grid gap-8 md:grid-cols-12 md:items-start md:gap-10'
                      : 'grid gap-8 border-t border-ink/10 pt-16 md:grid-cols-12 md:items-start md:gap-10 md:pt-24'
                  }
                >
                  <div className="md:col-span-4">
                    <div className="relative aspect-[4/5] overflow-hidden bg-sand">
                      <img
                        src={lg(founder.image)}
                        srcSet={srcSetFor(lg(founder.image))}
                        sizes="(min-width: 768px) 300px, calc(100vw - 3rem)"
                        alt={founder.imageAlt}
                        loading="lazy"
                        decoding="async"
                        className="block h-full w-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="md:col-span-8 md:col-start-5">
                    <h3 className="font-display text-[clamp(1.8rem,3.4vw,2.9rem)] font-light leading-none text-ink">
                      {founder.name}
                    </h3>
                    <p className="meta-label mt-3">{founder.role}</p>
                    <p className="mt-6 max-w-xl font-sans text-sm font-light leading-relaxed text-stone md:text-base">
                      {founder.bio}
                    </p>
                    {founder.focus && (
                      <>
                        <div className="mt-8 flex flex-wrap gap-x-8 gap-y-3">
                          {founder.focus.map((area) => (
                            <p
                              key={area}
                              className="font-sans text-[10px] font-light uppercase tracking-[var(--tracking-meta)] text-stone"
                            >
                              {area}
                            </p>
                          ))}
                        </div>
                        {founder.note && (
                          <p className="mt-8 max-w-xl border-l border-ink/15 pl-6 font-display text-lg font-light italic leading-[1.5] text-charcoal">
                            {founder.note}
                          </p>
                        )}
                      </>
                    )}
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
