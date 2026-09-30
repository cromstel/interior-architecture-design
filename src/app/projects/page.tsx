import type { Metadata } from 'next'
import { buildMeta } from '@/lib/seo'
import { projects } from '@/data/projects'
import { lg } from '@/lib/image-variants'
import { srcSetFor } from '@/lib/responsive-image'
import { PageHeader } from '@/components/page-header'
import { ProjectIndex } from '@/components/projects/project-index'

export const metadata: Metadata = buildMeta({
  title: 'Projects — Citgroup & Vale',
  description:
    'Residential, architectural, and hospitality work by citgroup & Vale, a New York interior architecture studio — six projects documented in full from 2016 to 2026.',
  path: '/projects/',
})

export default function ProjectsPage() {
  const all = projects().map((p) => ({ ...p, hero: { ...p.hero, src: lg(p.hero.src) } }))

  // The lead card is the largest image on the page and sits above the fold, so
  // it is preloaded explicitly. Candidates and `sizes` match the `<img>` in
  // `ProjectIndex` exactly, which is what stops the preload and the element
  // resolving to different files.
  const lead = all[0]

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
        eyebrow="Selected work"
        title="Projects"
        lede="Every completed project the studio is able to publish, documented with the decisions that shaped it — including the ones that did not survive contact with the building."
        crumb="Projects"
      />
      <section className="px-6 pb-28 md:px-10 md:pb-44">
        <ProjectIndex projects={all} />
      </section>
    </>
  )
}
