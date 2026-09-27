import Link from 'next/link'
import { getProject, type Project } from '@/data/projects'
import { site } from '@/data/config'
import { FadeIn } from '@/components/motion/fade-in'
import { cn } from '@/lib/cn'

export function ProjectPrevNext({ project }: { project: Project }) {
  const prev = getProject(project.prevSlug)
  const next = getProject(project.nextSlug)
  if (!prev || !next) return null

  return (
    <section className="border-t border-ink/10">
      <div className="grid gap-10 md:grid-cols-2 md:gap-0">
        <Link
          href={`/projects/${prev.slug}`}
          className="group border-b border-ink/10 px-6 py-12 transition-colors duration-500 hover:bg-cream md:border-b-0 md:border-r md:px-10 md:py-16"
        >
          <p className="meta-label">
            <span aria-hidden className="mr-3 transition-transform duration-500 ease-out inline-block group-hover:-translate-x-1">
              ←
            </span>
            Previous Project
          </p>
          <p className="mt-4 font-display text-[clamp(1.6rem,3.2vw,2.6rem)] font-light leading-tight text-ink">
            {prev.title}
          </p>
          <p className="mt-2 font-sans text-[10px] font-light uppercase tracking-[var(--tracking-meta)] text-stone">
            {prev.location}
          </p>
        </Link>

        <Link
          href={`/projects/${next.slug}`}
          className="group flex flex-col items-end border-b border-ink/10 px-6 py-12 text-right transition-colors duration-500 hover:bg-cream md:border-b-0 md:px-10 md:py-16"
        >
          <p className="meta-label">
            Next Project
            <span aria-hidden className="ml-3 inline-block transition-transform duration-500 ease-out group-hover:translate-x-1">
              →
            </span>
          </p>
          <p className="mt-4 font-display text-[clamp(1.6rem,3.2vw,2.6rem)] font-light leading-tight text-ink">
            {next.title}
          </p>
          <p className="mt-2 font-sans text-[10px] font-light uppercase tracking-[var(--tracking-meta)] text-stone">
            {next.location}
          </p>
        </Link>
      </div>
      <AllProjectsLink />
    </section>
  )
}

function AllProjectsLink() {
  return (
    <div className={cn('flex items-center justify-between px-6 py-8 md:px-10')}>
      <Link
        href="/"
        className="font-sans text-[11px] uppercase tracking-[var(--tracking-meta)] text-stone transition-colors hover:text-ink"
      >
        ↑ Back to Selected Work
      </Link>
      <FadeIn>
        <span className="font-display text-sm italic text-stone">{site.name}</span>
      </FadeIn>
    </div>
  )
}