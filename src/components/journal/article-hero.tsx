import type { JournalEntry } from '@/data/journal'
import { lg } from '@/lib/image-variants'
import { ArticleMasthead } from '@/components/journal/article-masthead'

/**
 * Server component: resolves the `-lg` hero variant on disk and hands the
 * resolved path across the client boundary to the masthead.
 */
export function ArticleHero({ entry }: { entry: JournalEntry }) {
  return (
    <ArticleMasthead
      category={entry.category}
      date={entry.date}
      title={entry.title}
      excerpt={entry.excerpt}
      src={lg(entry.hero.src)}
      alt={entry.hero.alt}
    />
  )
}
