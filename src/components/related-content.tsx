import Link from 'next/link'
import type { Project } from '@/data/projects'
import type { JournalEntry } from '@/data/journal'
import { RevealText } from '@/components/motion/reveal-text'
import { FadeIn } from '@/components/motion/fade-in'
import { AnimatedRule } from '@/components/motion/animated-rule'

/**
 * "More from the studio" — related projects or articles, ranked by the caller.
 * Everything shown already exists in the data layer; nothing here is invented.
 */
export function RelatedProjects({ items }: { items: Project[] }) {
  if (items.length === 0) return null

  return (
    <section aria-labelledby="related-projects" className="border-t border-ink/10 px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-6">
          <RevealText
            as="h2"
            id="related-projects"
            text="More from the studio"
            className="font-display text-[clamp(1.8rem,4vw,3.2rem)] font-light leading-none tracking-[-0.01em] text-ink"
          />
          <p className="meta-label hidden pb-1 md:block">Other projects</p>
        </div>

        <ul className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {items.map((project, i) => (
            <li key={project.slug}>
              <FadeIn delay={0.06 * i}>
                <Link href={`/projects/${project.slug}`} className="group block">
                  <p className="font-display text-sm italic text-stone">{project.index}</p>
                  <h3 className="mt-3 font-display text-[clamp(1.3rem,2.4vw,1.8rem)] font-light leading-tight tracking-[-0.01em] text-ink transition-opacity duration-500 group-hover:opacity-70">
                    {project.title}
                  </h3>
                  <p className="mt-3 font-sans text-[10px] uppercase tracking-[var(--tracking-meta)] text-stone">
                    {project.location}
                    <span className="mx-2" aria-hidden>
                      ·
                    </span>
                    {project.category}
                    <span className="mx-2" aria-hidden>
                      ·
                    </span>
                    {project.year}
                  </p>
                  <span className="mt-5 inline-block">
                    <AnimatedRule className="h-px w-16 bg-ink/20" />
                  </span>
                </Link>
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export function RelatedEntries({ items }: { items: JournalEntry[] }) {
  if (items.length === 0) return null

  return (
    <section aria-labelledby="related-entries" className="border-t border-ink/10 px-6 py-20 md:px-10 md:py-28">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-end justify-between gap-6">
          <RevealText
            as="h2"
            id="related-entries"
            text="Continue reading"
            className="font-display text-[clamp(1.8rem,4vw,3.2rem)] font-light leading-none tracking-[-0.01em] text-ink"
          />
          <p className="meta-label hidden pb-1 md:block">From the journal</p>
        </div>

        <ul className="mt-12 grid gap-10 md:grid-cols-2 md:gap-12">
          {items.map((entry, i) => (
            <li key={entry.slug}>
              <FadeIn delay={0.06 * i}>
                <Link href={`/journal/${entry.slug}`} className="group block">
                  <p className="font-sans text-[10px] uppercase tracking-[var(--tracking-meta)] text-stone">
                    {entry.category}
                    <span className="mx-2" aria-hidden>
                      ·
                    </span>
                    {entry.date}
                  </p>
                  <h3 className="mt-3 font-display text-[clamp(1.4rem,2.8vw,2.1rem)] font-light leading-[1.1] tracking-[-0.01em] text-ink transition-opacity duration-500 group-hover:opacity-70">
                    {entry.title}
                  </h3>
                  <p className="mt-4 max-w-md font-sans text-sm font-light leading-relaxed text-stone">
                    {entry.excerpt}
                  </p>
                  <span className="mt-5 inline-block">
                    <AnimatedRule className="h-px w-16 bg-ink/20" />
                  </span>
                </Link>
              </FadeIn>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
