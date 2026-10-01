import type { Metadata } from 'next'
import { buildMeta } from '@/lib/seo'
import { serviceDetail, processStages, engagement } from '@/data/site'
import { PageHero } from '@/components/page-hero'
import { FadeIn } from '@/components/motion/fade-in'
import { AnimatedRule } from '@/components/motion/animated-rule'
import { RevealText } from '@/components/motion/reveal-text'
import { lg } from '@/lib/image-variants'
import { srcSetFor } from '@/lib/responsive-image'

const hero = lg('/images/hero/hero-services.avif')

export const metadata: Metadata = buildMeta({
  title: 'Services — Citgroup & Vale',
  description:
    'Interior architecture, residential interiors, renovation, furniture and art, and hospitality — the five disciplines citgroup & Vale practises, and how an engagement begins.',
  path: '/services/',
  ogImage: '/images/og/services.jpg',
  ogImageAlt: 'Interior architecture, residential interiors, renovation, furniture and art, and hospitality — the five disciplines practised by citgroup & Vale.',
})

export default function ServicesPage() {
  return (
    <>
      <link rel="preload" as="image" imageSrcSet={srcSetFor(hero)} imageSizes="100vw" />
      <PageHero
        src={hero}
        alt="A plastered interior wall in warm ochre, its niches holding the day's light."
        eyebrow="Five disciplines"
        title="Services"
        lede="We work across five disciplines that in practice overlap almost completely — a townhouse renovation is architecture, interiors, millwork, furniture, and art, and treating them separately is what makes projects slow down."
        crumb="Services"
      />

      <section aria-labelledby="disciplines" className="px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-7xl">
          <AnimatedRule />
          <h2 id="disciplines" className="sr-only">
            Disciplines
          </h2>

          <ol>
            {serviceDetail.map((service, i) => (
              <li key={service.title} className="border-b border-ink/10">
                <FadeIn delay={0.04 * (i % 2)}>
                  <div className="grid gap-8 py-12 md:grid-cols-12 md:gap-10 md:py-16">
                    <div className="md:col-span-5">
                      <p className="font-display text-sm italic text-stone">
                        {String(i + 1).padStart(2, '0')}
                      </p>
                      <h3 className="mt-3 font-display text-[clamp(1.7rem,3.6vw,2.9rem)] font-light leading-[1.02] tracking-[-0.01em] text-ink">
                        {service.title}
                      </h3>
                      <p className="mt-5 max-w-sm font-sans text-sm font-light leading-relaxed text-stone">
                        {service.body}
                      </p>
                    </div>

                    <div className="md:col-span-6 md:col-start-7">
                      <p className="meta-label">Scope</p>
                      <ul className="mt-5 space-y-3">
                        {service.scope.map((item) => (
                          <li
                            key={item}
                            className="flex gap-4 font-sans text-sm font-light leading-relaxed text-charcoal"
                          >
                            <span aria-hidden className="mt-2.5 h-px w-4 shrink-0 bg-ink/30" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </FadeIn>
              </li>
            ))}
          </ol>
          <AnimatedRule />
        </div>
      </section>

      <section aria-labelledby="engagement" className="bg-ivory px-6 py-20 md:px-10 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-3">
              <RevealText
                as="h2"
                id="engagement"
                text="How it begins"
                className="font-display text-[clamp(2rem,4.4vw,3.6rem)] font-light leading-none tracking-[-0.01em] text-ink"
              />
            </div>
            <div className="md:col-span-8 md:col-start-5">
              {engagement.map((step, i) => (
                <FadeIn key={step.phase} delay={0.06 * i}>
                  <div className="border-t border-ink/10 py-8 last:border-b md:py-10">
                    <h3 className="font-display text-[clamp(1.3rem,2.4vw,1.9rem)] font-light leading-tight text-ink">
                      {step.phase}
                    </h3>
                    <p className="mt-3 max-w-xl font-sans text-sm font-light leading-relaxed text-stone md:text-base">
                      {step.detail}
                    </p>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="process" className="px-6 py-20 md:px-10 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 flex items-end justify-between gap-6 md:mb-20">
            <RevealText
              as="h2"
              id="process"
              text="Design process"
              className="font-display text-[clamp(2.2rem,5vw,4.2rem)] font-light leading-none tracking-[-0.01em] text-ink"
            />
            <p className="meta-label hidden pb-2 md:block">Six stages</p>
          </div>

          <ol className="border-t border-ink/10">
            {processStages.map((stage) => (
              <li key={stage.number} className="border-b border-ink/10">
                <div className="grid gap-4 py-8 md:grid-cols-12 md:gap-10 md:py-9">
                  <p className="font-display text-[clamp(1.3rem,2.6vw,2rem)] font-light leading-none text-ink/30 md:col-span-2">
                    {stage.number}
                  </p>
                  <h3 className="font-display text-[clamp(1.2rem,2.2vw,1.6rem)] font-light leading-tight text-ink md:col-span-4">
                    {stage.title}
                  </h3>
                  <p className="max-w-xl font-sans text-sm font-light leading-relaxed text-stone md:col-span-6">
                    {stage.body}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}
