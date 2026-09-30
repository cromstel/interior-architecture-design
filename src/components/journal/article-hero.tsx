import type { JournalEntry } from '@/data/journal'
import { lg } from '@/lib/image-variants'
import { readingTime } from '@/lib/derived'
import { ArticleMasthead } from '@/components/journal/article-masthead'
import { Breadcrumbs } from '@/components/breadcrumbs'

/**
 * Server component: resolves the `-lg` hero variant on disk, derives the
 * reading time from the article's own copy, and hands both across the client
 * boundary to the masthead.
 */
export function ArticleHero({ entry }: { entry: JournalEntry }) {
  const { minutes, words } = readingTime(entry.blocks)

  return (
    <header className="relative">
      <ArticleMasthead
        category={entry.category}
        date={entry.date}
        title={entry.title}
        excerpt={entry.excerpt}
        src={lg(entry.hero.src)}
        alt={entry.hero.alt}
        minutes={minutes}
        words={words}
      />
      <div className="bg-chalk">
        <div className="max-w-7xl px-6 pb-2 md:px-10">
          <Breadcrumbs
            className="pt-8"
            items={[
              { label: 'Studio', href: '/' },
              { label: 'Journal', href: '/journal/' },
              { label: entry.title },
            ]}
          />
        </div>
      </div>
    </header>
  )
}
