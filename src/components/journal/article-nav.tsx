import Link from 'next/link'
import { journalEntries } from '@/data/journal'

export function ArticleNav({ slug }: { slug: string }) {
  const entries = journalEntries()
  const index = entries.findIndex((e) => e.slug === slug)
  if (index < 0) return null
  const prev = entries[(index - 1 + entries.length) % entries.length]
  const next = entries[(index + 1) % entries.length]

  return (
    <section className="mt-8 border-t border-ink/10">
      <div className="grid md:grid-cols-2 md:divide-x md:divide-ink/10">
        <Link
          href={`/journal/${prev.slug}`}
          className="group border-b border-ink/10 px-6 py-12 transition-colors duration-500 hover:bg-cream md:border-b-0 md:px-10 md:py-16"
        >
          <p className="meta-label">
            <span aria-hidden className="mr-3 inline-block transition-transform duration-500 ease-out group-hover:-translate-x-1">
              ←
            </span>
            Previous Entry
          </p>
          <p className="mt-4 font-display text-[clamp(1.4rem,2.8vw,2.2rem)] font-light leading-tight text-ink">
            {prev.title}
          </p>
        </Link>
        <Link
          href={`/journal/${next.slug}`}
          className="group flex flex-col items-end border-b border-ink/10 px-6 py-12 text-right transition-colors duration-500 hover:bg-cream md:border-b-0 md:px-10 md:py-16"
        >
          <p className="meta-label">
            Next Entry
            <span aria-hidden className="ml-3 inline-block transition-transform duration-500 ease-out group-hover:translate-x-1">
              →
            </span>
          </p>
          <p className="mt-4 font-display text-[clamp(1.4rem,2.8vw,2.2rem)] font-light leading-tight text-ink">
            {next.title}
          </p>
        </Link>
      </div>
      <div className="px-6 py-8 md:px-10">
        <Link
          href="/#journal"
          className="font-sans text-[11px] uppercase tracking-[var(--tracking-meta)] text-stone transition-colors hover:text-ink"
        >
          ↑ Back to Journal
        </Link>
      </div>
    </section>
  )
}