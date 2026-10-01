import type { Metadata } from 'next'
import { buildMeta } from '@/lib/seo'
import { projects } from '@/data/projects'
import { lg } from '@/lib/image-variants'
import { srcSetFor } from '@/lib/responsive-image'
import { PageHero } from '@/components/page-hero'
import { PAGE_TOP_GAP } from '@/lib/spacing'
import { ProjectIndex } from '@/components/projects/project-index'

const hero = lg('/images/hero/hero-projects.avif')

export const metadata: Metadata = buildMeta({
  title: 'Projects â€” Citgroup & Vale',
  description:
    'Residential, architectural, and hospitality work by citgroup & Vale, a New York interior architecture studio â€” six projects documented in full from 2016 to 2026.',
  path: '/projects/',
  ogImage: '/images/og/projects.jpg',
  ogImageAlt: 'Selected interior architecture and design projects by citgroup & Vale, New York.',
})

export default function ProjectsPage() {
  const all = projects().map((p) => ({ ...p, hero: { ...p.hero, src: lg(p.hero.src) } }))

  return (
    <>
      {/* The banner is the LCP image, so it is preloaded explicitly. The index
          cards below it are lazy, so this is the only eager image on the page. */}
      <link rel="preload" as="image" imageSrcSet={srcSetFor(hero)} imageSizes="100vw" />
      <PageHero
        src={hero}
        alt="An apartment facade in evening light, its windows lit and a street of facades receding behind it."
        eyebrow="Selected work"
        title="Projects"
        lede="Every completed project the studio is able to publish, documented with the decisions that shaped it â€” including the ones that did not survive contact with the building."
        crumb="Projects"
      />
      <section className={`px-6 pb-28 md:px-10 md:pb-44 ${PAGE_TOP_GAP}`}>
        <ProjectIndex projects={all} />
      </section>
    </>
  )
}

