import type { Metadata } from 'next'
import { buildMeta } from '@/lib/seo'
import { Hero } from '@/components/home/hero'
import { Intro } from '@/components/home/intro'
import { SelectedWork } from '@/components/home/selected-work'
import { projects } from '@/data/projects'
import { lg } from '@/lib/image-variants'
import { srcSetFor } from '@/lib/responsive-image'
import { Philosophy } from '@/components/home/philosophy'
import { Services } from '@/components/home/services'
import { Studio } from '@/components/home/studio'
import { Process } from '@/components/home/process'
import { Press } from '@/components/home/press'
import { Testimonials } from '@/components/home/testimonials'
import { JournalSection } from '@/components/home/journal-section'
import { journalEntries } from '@/data/journal'
import { ContactSection } from '@/components/home/contact'
import { FloatingCta } from '@/components/floating-cta'

export const metadata: Metadata = buildMeta({
  title: 'citgroup & Vale — Interior Architecture & Design | New York',
  description:
    'citgroup & Vale is a New York interior architecture and design studio creating refined residential, hospitality, and commercial spaces.',
  path: '/',
})

export default function HomePage() {
  return (
    <>
      {/* No explicit hero preload. `HeroBackdrop` marks its image
          `fetchPriority="high"` and Next emits a preload from that attribute
          on its own, so writing one here produced a second preload for the same
          srcset on the homepage and the 404. Chrome does not merge them: it
          discards the preload and the `<img>` fetches separately, so the
          preload bought nothing and the console warned that it went unused.
          The auto-generated one still carries the same candidate list and
          `imageSizes` as the `<img>`, which is what keeps them resolving to a
          single file. `scripts/verify-preload.mjs` enforces exactly one. */}
      <Hero />
      <Intro />
      <SelectedWork
        projects={projects().map((p) => ({ ...p, hero: { ...p.hero, src: lg(p.hero.src) } }))}
      />
      <Philosophy />
      <Services />
      <Studio />
      <Process />
      <Press />
      <Testimonials />
      <JournalSection
        entries={journalEntries().map((e) => ({ ...e, hero: { ...e.hero, src: lg(e.hero.src) } }))}
      />
      <ContactSection />
      <FloatingCta />
    </>
  )
}