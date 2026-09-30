import type { Metadata } from 'next'
import { buildMeta } from '@/lib/seo'
import { site } from '@/data/config'
import { engagement } from '@/data/site'
import { PageHeader } from '@/components/page-header'
import { ContactForm } from '@/components/home/contact'
import { AnimatedRule } from '@/components/motion/animated-rule'
import { RevealText } from '@/components/motion/reveal-text'
import { FadeIn } from '@/components/motion/fade-in'

export const metadata: Metadata = buildMeta({
  title: 'Contact — Citgroup & Vale',
  description:
    'Start a project with citgroup & Vale. The studio is at 48 Walker Street, New York, and takes a limited number of residential, hospitality, and commercial commissions each year.',
  path: '/contact/',
})

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow={`${site.address.city} · Est. ${site.estYear}`}
        title="Contact"
        lede="We take on a limited number of residential, hospitality, and commercial projects each year, and we turn down more than we accept. Tell us a little about yours."
        crumb="Contact"
      />

      <section id="contact" className="scroll-mt-24 px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-14 md:grid-cols-12 md:gap-10">
            <div className="md:col-span-4">
              <h2 className="meta-label">The studio</h2>
              <address className="mt-6 space-y-1.5 font-sans text-sm font-light not-italic leading-relaxed text-charcoal">
                <p>{site.address.street}</p>
                <p>{site.address.city}, {site.address.state} {site.address.zip}</p>
                <p>{site.address.country}</p>
              </address>

              <div className="mt-10 space-y-4">
                <p className="font-sans text-sm font-light text-charcoal">
                  <a href={`mailto:${site.email}`} className="border-b border-ink/20 pb-0.5 transition-colors hover:border-ink">
                    {site.email}
                  </a>
                </p>
                <p className="font-sans text-sm font-light text-charcoal">
                  <a href={`tel:${site.phone.tel}`} className="border-b border-ink/20 pb-0.5 transition-colors hover:border-ink">
                    {site.phone.displayBracketed}
                  </a>
                </p>
              </div>

              <div className="mt-12">
                <p className="meta-label">Working across</p>
                <ul className="mt-4 space-y-1.5">
                  {site.areas.map((area) => (
                    <li key={area} className="font-sans text-sm font-light text-stone">
                      {area}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="md:col-span-7 md:col-start-6">
              <h2 className="meta-label mb-8">Project enquiry</h2>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <section aria-labelledby="what-happens-next" className="bg-ivory px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-7xl">
          <AnimatedRule />
          <RevealText
            as="h2"
            id="what-happens-next"
            text="What happens next"
            className="pt-8 font-display text-[clamp(2rem,4.4vw,3.6rem)] font-light leading-none tracking-[-0.01em] text-ink"
          />

          <ol className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-3">
            {engagement.map((step, i) => (
              <li key={step.phase} className="border-t border-ink/10 pt-7">
                <FadeIn delay={0.05 * i}>
                  <p className="font-display text-sm italic text-stone">
                    {String(i + 1).padStart(2, '0')}
                  </p>
                  <h3 className="mt-3 font-display text-[clamp(1.3rem,2.4vw,1.9rem)] font-light leading-tight text-ink">
                    {step.phase}
                  </h3>
                  <p className="mt-4 font-sans text-sm font-light leading-relaxed text-stone">
                    {step.detail}
                  </p>
                </FadeIn>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}
