import { cn } from '@/lib/cn'
import type { Project } from '@/data/projects'
import { lg } from '@/lib/image-variants'
import { srcSetFor } from '@/lib/responsive-image'
import { RevealText } from '@/components/motion/reveal-text'
import { FadeIn } from '@/components/motion/fade-in'
import { AnimatedRule } from '@/components/motion/animated-rule'

/**
 * Client-safe thumbnail for the index grid. `lg()` is resolved by the server
 * page before it reaches here, so this stays free of `node:fs`.
 */
function Thumbnail({ src, alt }: { src: string; alt: string }) {
  return (
    <img
      src={src}
      srcSet={srcSetFor(src)}
      sizes="(min-width: 1024px) 40vw, (min-width: 768px) 46vw, 100vw"
      alt={alt}
      loading="lazy"
      decoding="async"
      className="block h-full w-full object-cover"
    />
  )
}

/**
 * The full project index.
 *
 * Deliberately a different presentation from the homepage's Selected Work: that
 * section is an editorial scroll of six bespoke layouts, whereas this is a
 * uniform archive keyed by category and year. Different markup, different copy,
 * so the two URLs do not become duplicate content.
 */
export function ProjectIndex({ projects }: { projects: Project[] }) {
  const years = [...new Set(projects.map((p) => p.year))].sort().reverse()
  const categories = [...new Set(projects.map((p) => p.category))]

  return (
    <div>
      {/* `mx-auto` here for the same reason the body sections have it: without
          it the archive sits hard against the page gutter while everything else
          centres, which puts it on a different left axis from the banner above
          it. See scripts/verify-gutter.mjs. */}
      {/* The page's opening section supplies the top padding (PAGE_TOP_GAP), so
          this adds none of its own. */}
      <div className="mx-auto max-w-7xl border-t border-ink/10">
        <div className="grid gap-8 md:grid-cols-12 md:gap-10">
          <p className="meta-label md:col-span-3">
            {projects.length} projects
          </p>
          <p className="max-w-xl font-display text-[clamp(1.4rem,2.6vw,1.9rem)] font-light leading-[1.35] text-ink md:col-span-9">
            Residential, architectural, and hospitality work from the studio since 2016. Each entry
            is documented in full, including the decisions that did not survive contact with the
            building.
          </p>
        </div>
      </div>

      <section aria-labelledby="archive-by-category" className="mx-auto max-w-7xl pt-20 md:pt-28">
        <AnimatedRule />
        <h2
          id="archive-by-category"
          className="pt-8 font-display text-[clamp(1.8rem,4vw,3.2rem)] font-light leading-none tracking-[-0.01em] text-ink"
        >
          Archive
        </h2>

        <ul className="mt-4 flex flex-wrap gap-x-8 gap-y-2">
          {categories.map((c) => (
            <li key={c} className="font-sans text-[11px] uppercase tracking-[var(--tracking-meta)] text-stone">
              {c}
            </li>
          ))}
        </ul>
        <p className="mt-2 font-sans text-[11px] uppercase tracking-[var(--tracking-meta)] text-stone">
          {years.join(' · ')}
        </p>

        <ul className="mt-16 grid gap-x-8 gap-y-20 md:grid-cols-2 md:gap-y-28">
          {projects.map((project, i) => (
            <li key={project.slug}>
              <FadeIn delay={0.06 * (i % 2)}>
                <ProjectCard project={project} offset={i % 3 === 1} />
              </FadeIn>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}

function ProjectCard({ project, offset }: { project: Project; offset: boolean }) {
  return (
    <article>
      <a href={`/projects/${project.slug}/`} className="group block">
        <div
          className={cn(
            'relative aspect-[4/3] overflow-hidden bg-sand',
            offset && 'md:mt-24',
          )}
        >
          <Thumbnail src={lg(project.hero.src)} alt={project.hero.alt} />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            style={{
              background: 'linear-gradient(to top, rgba(10,9,7,0.4) 0%, rgba(10,9,7,0) 55%)',
            }}
          />
          <span className="absolute left-5 top-5 font-display text-sm italic text-chalk/90 mix-blend-difference">
            {project.index}
          </span>
        </div>

        <div className="mt-6 flex items-baseline justify-between gap-6">
          <h3 className="font-display text-[clamp(1.5rem,3vw,2.3rem)] font-light leading-none tracking-[-0.01em] text-ink transition-opacity duration-500 group-hover:opacity-70">
            {project.title}
          </h3>
          <p className="shrink-0 font-sans text-[10px] uppercase tracking-[var(--tracking-meta)] text-stone">
            {project.year}
          </p>
        </div>

        <p className="mt-3 font-sans text-[10px] uppercase tracking-[var(--tracking-meta)] text-stone">
          {project.location}
          <span className="mx-2" aria-hidden>
            ·
          </span>
          {project.category}
        </p>

        <p className="mt-5 max-w-md font-sans text-sm font-light leading-relaxed text-stone">
          {project.summary}
        </p>

        <span className="mt-6 inline-block">
          <AnimatedRule className="h-px w-16 bg-ink/20" />
        </span>
      </a>
    </article>
  )
}
