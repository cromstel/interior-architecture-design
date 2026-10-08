import type { Metadata } from 'next'
import { buildMeta } from '@/lib/seo'
import { site } from '@/data/config'
import { studioStory } from '@/data/site'
import { PageHero } from '@/components/page-hero'
import { PAGE_TOP_GAP } from '@/lib/spacing'
import { Founders } from '@/components/about/founders'
import { FadeIn } from '@/components/motion/fade-in'
import { AnimatedRule } from '@/components/motion/animated-rule'
import { RevealText } from '@/components/motion/reveal-text'
import { lg } from '@/lib/image-variants'
import { srcSetFor } from '@/lib/responsive-image'

const hero = lg('/images/hero/hero-about.avif')

export const metadata: Metadata = buildMeta({
  title: 'About the Studio â€” Citgroup & Vale',
  description:
    'citgroup & Vale is a New York interior architecture studio founded in 2016, working from a Walker Street loft on a deliberately limited number of projects each year.',
  path: '/about/',
  ogImage: '/images/og/about.jpg',
  ogImageAlt: 'The citgroup & Vale studio â€” interior architecture and design, New York.',
})

export default function AboutPage() {
  return (
    <>
      {/* The banner is the LCP image, so it is preloaded explicitly. The
          candidate list and `sizes` match the `<img>` in `HeroBackdrop`
          exactly, which is what stops the preload and the element from
          resolving to different files. */}
      <link rel="preload" as="image" imageSrcSet={srcSetFor(hero)} imageSizes="100vw" />
      <PageHero
        src={hero}
        alt="Honed travertine in the studio material library, its warm surface and pale grout filling the frame."
        eyebrow={`Est. ${site.estYear} Â· ${site.city}`}
        title="The Studio"
        lede={studioStory.lede}
        crumb="The Studio"
      />

      <section className={`px-6 md:px-10 ${PAGE_TOP_GAP}`}>
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

      <Founders />

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
                <dt className="meta-label-sand">{row.label}</dt>
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

