import type { Metadata } from 'next'
import { buildMeta } from '@/lib/seo'
import { journalEntries } from '@/data/journal'
import { lg } from '@/lib/image-variants'
import { srcSetFor } from '@/lib/responsive-image'
import { PageHero } from '@/components/page-hero'
import { PAGE_TOP_GAP } from '@/lib/spacing'
import { JournalIndex } from '@/components/journal/journal-index'

const hero = lg('/images/hero/hero-journal.avif')

export const metadata: Metadata = buildMeta({
  title: 'Journal â€” Citgroup & Vale',
  description:
    'Notes on material, light, and proportion from the citgroup & Vale studio â€” writing on the decisions behind finished interiors, written in New York.',
  path: '/journal/',
  ogImage: '/images/og/journal.jpg',
  ogImageAlt: 'The citgroup & Vale journal â€” writing on material, light, and proportion.',
})

export default function JournalPage() {
  const all = journalEntries().map((e) => ({ ...e, hero: { ...e.hero, src: lg(e.hero.src) } }))

  return (
    <>
      <link rel="preload" as="image" imageSrcSet={srcSetFor(hero)} imageSizes="100vw" />
      <PageHero
        src={hero}
        alt="An ornate marble stair turning in low light, its balustrade casting a slow shadow down the wall."
        eyebrow="Notes from the studio"
        title="Journal"
        lede="Writing on material, light, proportion, and the slow decisions behind finished interiors. Published when there is something worth saying."
        crumb="Journal"
      />
      <section className={`px-6 pb-28 md:px-10 md:pb-44 ${PAGE_TOP_GAP}`}>
        <JournalIndex entries={all} />
      </section>
    </>
  )
}

