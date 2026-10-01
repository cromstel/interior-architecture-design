import { cn } from '@/lib/cn'
import type { JournalEntry } from '@/data/journal'
import { lg } from '@/lib/image-variants'
import { srcSetFor } from '@/lib/responsive-image'
import { readingTime } from '@/lib/derived'
import { RevealText } from '@/components/motion/reveal-text'
import { FadeIn } from '@/components/motion/fade-in'
import { AnimatedRule } from '@/components/motion/animated-rule'

/**
 * The full journal index.
 *
 * The homepage Journal section is a three-card editorial arrangement that shows
 * only the first three entries. This lists everything, newest first, with the
 * reading time derived from each article's own blocks.
 */
export function JournalIndex({ entries }: { entries: JournalEntry[] }) {
  const sorted = [...entries].sort((a, b) => b.dateISO.localeCompare(a.dateISO))
  const [lead, ...rest] = sorted

  return (
    <div>
      {lead && (
        // `mx-auto` for the same reason as the body sections: without it the
        // list sits against the page gutter while everything else centres, on a
        // different left axis from the banner above. See
        // scripts/verify-gutter.mjs.
        <section aria-labelledby="journal-lead" className="mx-auto max-w-7xl pt-16 md:pt-24">
          <article>
            <a href={`/journal/${lead.slug}/`} className="group block">
              <div className="grid gap-8 md:grid-cols-12 md:items-center md:gap-10">
                <div className="md:col-span-7">
                  <div className="relative aspect-[16/11] overflow-hidden bg-sand">
                    <img
                      src={lg(lead.hero.src)}
                      srcSet={srcSetFor(lg(lead.hero.src))}
                      sizes="(min-width: 768px) 56vw, 100vw"
                      alt={lead.hero.alt}
                      loading="eager"
                      decoding="async"
                      className="block h-full w-full object-cover"
                    />
                  </div>
                </div>
                <div className="md:col-span-5">
                  <p className="font-sans text-[10px] uppercase tracking-[var(--tracking-meta)] text-stone">
                    {lead.category}
                    <span className="mx-2" aria-hidden>
                      ·
                    </span>
                    {lead.date}
                    <span className="mx-2" aria-hidden>
                      ·
                    </span>
                    {readingTime(lead.blocks).minutes} min
                  </p>
                  <h2
                    id="journal-lead"
                    className="mt-4 font-display text-[clamp(1.9rem,4.2vw,3.4rem)] font-light leading-[1.05] tracking-[-0.01em] text-ink transition-opacity duration-500 group-hover:opacity-70"
                  >
                    {lead.title}
                  </h2>
                  <p className="mt-6 max-w-md font-sans text-sm font-light leading-relaxed text-stone">
                    {lead.excerpt}
                  </p>
                  <span className="mt-8 inline-block">
                    <AnimatedRule className="h-px w-16 bg-ink/20" />
                  </span>
                </div>
              </div>
            </a>
          </article>
        </section>
      )}

      <section aria-labelledby="journal-all" className="mx-auto max-w-7xl pt-24 md:pt-32">
        <AnimatedRule />
        <div className="flex items-end justify-between gap-6 pt-8">
          <h2
            id="journal-all"
            className="font-display text-[clamp(1.8rem,4vw,3.2rem)] font-light leading-none tracking-[-0.01em] text-ink"
          >
            All articles
          </h2>
          <p className="hidden pb-1 font-sans text-[10px] uppercase tracking-[var(--tracking-meta)] text-stone md:block">
            {sorted.length} entries
          </p>
        </div>

        <ul className="mt-14">
          {rest.map((entry, i) => (
            <li key={entry.slug} className="border-b border-ink/10 first:border-t">
              <FadeIn delay={0.04 * (i % 4)}>
                <a href={`/journal/${entry.slug}/`} className="group flex flex-col gap-4 py-8 md:flex-row md:items-baseline md:gap-10 md:py-10">
                  <p className="shrink-0 font-sans text-[10px] uppercase tracking-[var(--tracking-meta)] text-stone md:w-40">
                    {entry.date}
                  </p>
                  <div className="md:flex-1">
                    <h3
                      className={cn(
                        'font-display text-[clamp(1.4rem,3vw,2.1rem)] font-light leading-[1.1] tracking-[-0.01em] text-ink',
                        'transition-transform duration-500 ease-out group-hover:translate-x-1.5',
                      )}
                    >
                      {entry.title}
                    </h3>
                    <p className="mt-3 max-w-2xl font-sans text-sm font-light leading-relaxed text-stone">
                      {entry.excerpt}
                    </p>
                  </div>
                  <p className="shrink-0 font-sans text-[10px] uppercase tracking-[var(--tracking-meta)] text-stone md:w-32 md:text-right">
                    {entry.category}
                    <br />
                    {readingTime(entry.blocks).minutes} min read
                  </p>
                </a>
              </FadeIn>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
