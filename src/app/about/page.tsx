import type { Metadata } from 'next'
import { buildMeta } from '@/lib/seo'
import { site } from '@/data/config'
import { studioStory } from '@/data/site'
import { PageHeader } from '@/components/page-header'
import { FadeIn } from '@/components/motion/fade-in'
import { AnimatedRule } from '@/components/motion/animated-rule'
import { RevealText } from '@/components/motion/reveal-text'
import { lg } from '@/lib/image-variants'
import { srcSetFor } from '@/lib/responsive-image'

export const metadata: Metadata = buildMeta({
  title: 'About the Studio — Citgroup & Vale',
  description:
    'citgroup & Vale is a New York interior architecture studio founded in 2016, working from a Walker Street loft on a deliberately limited number of projects each year.',
  path: '/about/',
})

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow={`Est. ${site.estYear} · ${site.city}`}
        title="The Studio"
        lede={studioStory.lede}
        crumb="Studio"
      />

      <section className="px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-3">
              <h2 className="meta-label">The practice</h2>
            </div>
            <div className="md:col-span-9 md:col-start-4">
              {studioStory.body.map((para, i) => (
                <FadeIn key={i} delay={0.05 * i}>
                  <p className="max-w-2xl font-display text-xl font-light leading-[1.75] text-charcoal md:text-2xl md:leading-[1.7]">
                    {para}
                  </p>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-ivory px-6 py-20 md:px-10 md:py-32">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-3">
              <h2 className="meta-label">Founders</h2>
            </div>
            <div className="space-y-16 md:col-span-9 md:col-start-4 md:space-y-24">
              {site.founders.map((founder, i) => (
                <FadeIn key={founder.name} delay={0.05 * i}>
                  <article className="grid gap-8 md:grid-cols-12 md:items-start md:gap-10">
                    <div className="md:col-span-4">
                      <div className="relative aspect-[4/5] overflow-hidden bg-sand">
                        <img
                          src={lg(founder.image)}
                          srcSet={srcSetFor(lg(founder.image))}
                          sizes="(min-width: 768px) 32vw, 100vw"
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
                    </div>
                  </article>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="principles" className="px-6 py-20 md:px-10 md:py-32">
        <div className="mx-auto max-w-7xl">
          <AnimatedRule />
          <RevealText
            as="h2"
            id="principles"
            text="How we work"
            className="pt-8 font-display text-[clamp(2.2rem,5vw,4.2rem)] font-light leading-none tracking-[-0.01em] text-ink"
          />

          <ul className="mt-16 grid gap-x-10 md:grid-cols-2 md:gap-y-14">
            {studioStory.principles.map((principle, i) => (
              <li key={principle.title} className="border-t border-ink/10 pt-8">
                <FadeIn delay={0.04 * (i % 2)}>
                  <p className="font-display text-sm italic text-stone">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-3 font-display text-[clamp(1.4rem,2.6vw,2rem)] font-light leading-tight text-ink">
                    {principle.title}
                  </h3>
                  <p className="mt-4 max-w-md font-sans text-sm font-light leading-relaxed text-stone">
                    {principle.body}
                  </p>
                </FadeIn>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="bg-sand px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-7xl">
          <AnimatedRule />
          <dl className="mt-10 grid gap-x-10 gap-y-8 md:grid-cols-4">
            {studioStory.practice.map((row) => (
              <div key={row.label}>
                <dt className="meta-label">{row.label}</dt>
                <dd className="mt-3 font-display text-lg font-light leading-snug text-ink">
                  {row.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>
    </>
  )
}
