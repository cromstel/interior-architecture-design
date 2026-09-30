import { Breadcrumbs } from '@/components/breadcrumbs'
import { RevealText } from '@/components/motion/reveal-text'
import { FadeIn } from '@/components/motion/fade-in'
import { AnimatedRule } from '@/components/motion/animated-rule'

/**
 * Masthead for the editorial pages (About, Services, Contact, and the two
 * indexes). Text-only by design: a full-bleed photograph on every route would
 * make each of them a second LCP image, and the pages are read rather than
 * looked at. The fixed height keeps the first screen from reflowing as the
 * header font settles.
 */
export function PageHeader({
  eyebrow,
  title,
  lede,
  crumb,
}: {
  eyebrow: string
  title: string
  lede?: string
  crumb: string
}) {
  return (
    <header className="bg-chalk px-6 pb-16 pt-32 md:px-10 md:pb-24 md:pt-44">
      <div className="mx-auto max-w-7xl">
        <Breadcrumbs
          className="mb-12 md:mb-20"
          items={[{ label: 'Studio', href: '/' }, { label: crumb }]}
        />

        <p className="meta-label">{eyebrow}</p>

        <RevealText
          as="h1"
          text={title}
          stagger={0.06}
          className="mt-6 text-balance font-display text-[clamp(2.6rem,7vw,6rem)] font-light leading-[0.98] tracking-[-0.015em] text-ink"
        />

        {lede && (
          <FadeIn delay={0.2}>
            <p className="mt-10 max-w-3xl font-display text-[clamp(1.3rem,2.8vw,2.1rem)] font-light leading-[1.3] text-charcoal md:mt-14">
              {lede}
            </p>
          </FadeIn>
        )}

        <AnimatedRule className="mt-14 md:mt-20" />
      </div>
    </header>
  )
}
