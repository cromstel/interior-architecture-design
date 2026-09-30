import type { Metadata } from 'next'
import { buildMeta } from '@/lib/seo'
import { journalEntries } from '@/data/journal'
import { lg } from '@/lib/image-variants'
import { srcSetFor } from '@/lib/responsive-image'
import { PageHeader } from '@/components/page-header'
import { JournalIndex } from '@/components/journal/journal-index'

export const metadata: Metadata = buildMeta({
  title: 'Journal — Citgroup & Vale',
  description:
    'Notes on material, light, and proportion from the citgroup & Vale studio — writing on the decisions behind finished interiors, written in New York.',
  path: '/journal/',
})

export default function JournalPage() {
  const all = journalEntries().map((e) => ({ ...e, hero: { ...e.hero, src: lg(e.hero.src) } }))

  const lead = [...all].sort((a, b) => b.dateISO.localeCompare(a.dateISO))[0]

  return (
    <>
      {lead && (
        <link
          rel="preload"
          as="image"
          imageSrcSet={srcSetFor(lead.hero.src)}
          imageSizes="(min-width: 768px) 56vw, 100vw"
        />
      )}
      <PageHeader
        eyebrow="Notes from the studio"
        title="Journal"
        lede="Writing on material, light, proportion, and the slow decisions behind finished interiors. Published when there is something worth saying."
        crumb="Journal"
      />
      <section className="px-6 pb-28 md:px-10 md:pb-44">
        <JournalIndex entries={all} />
      </section>
    </>
  )
}
