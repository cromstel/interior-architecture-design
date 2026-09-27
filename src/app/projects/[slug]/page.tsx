import type { Metadata } from 'next'
import { projects, getProject } from '@/data/projects'
import { ProjectHero } from '@/components/projects/project-hero'
import { ProjectSequence } from '@/components/projects/project-sequence'
import { ProjectPrevNext } from '@/components/projects/project-prev-next'
import { buildMeta } from '@/lib/seo'
import { notFound } from 'next/navigation'
import { lg } from '@/lib/image-variants'

export const dynamicParams = false

export function generateStaticParams() {
  return projects().map((p) => ({ slug: p.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) return {}
  return buildMeta({
    title: project.seo.title,
    description: project.seo.description,
    path: `/projects/${project.slug}`,
    // Social crawlers do not reliably render AVIF, so share the generated
    // 1200x630 JPEG card rather than the page's own hero.
    ogImage: `/images/og/${project.slug}.jpg`,
  })
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const project = getProject(slug)
  if (!project) notFound()

  return (
    <article>
      <ProjectHero project={project} />
      <ProjectSequence project={project} />
      <ProjectPrevNext project={project} />
    </article>
  )
}