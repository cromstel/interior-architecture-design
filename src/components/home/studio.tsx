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
        <p className="meta-label mt-6">Founders</p>

        <div className="mt-16 grid gap-16 md:mt-28 md:grid-cols-2 md:gap-24">
          {site.founders.map((founder, i) => (
            <article
              key={founder.name}
              className={i === 1 ? 'md:mt-24 lg:mt-32' : 'md:mt-0'}
            >
              <FadeIn>
                <ParallaxImage
                  src={founder.image}
                  alt={founder.imageAlt}
                  ratio="portrait"
                  amount={0.07}
                  sizes="(min-width: 768px) 45vw, 100vw"
                />
              </FadeIn>
              <div className="mt-8 md:mt-10">
                <h3 className="font-display text-[clamp(1.8rem,3.4vw,2.9rem)] font-light leading-none text-ink">
                  {founder.name}
                </h3>
                <p className="meta-label mt-3">{founder.role}</p>
                <p className="mt-6 max-w-sm font-sans text-sm font-light leading-relaxed text-stone">
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