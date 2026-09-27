import type { Metadata } from 'next'
import { journalEntries, getJournalEntry } from '@/data/journal'
import { ArticleHero } from '@/components/journal/article-hero'
import { ArticleBody } from '@/components/journal/article-body'
import { ArticleNav } from '@/components/journal/article-nav'
import { buildMeta } from '@/lib/seo'
import { notFound } from 'next/navigation'
import { lg } from '@/lib/image-variants'

export const dynamicParams = false

export function generateStaticParams() {
  return journalEntries().map((entry) => ({ slug: entry.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const entry = getJournalEntry(slug)
  if (!entry) return {}
  return buildMeta({
    title: entry.seo.title,
    description: entry.seo.description,
    path: `/journal/${entry.slug}`,
    // Social crawlers do not reliably render AVIF, so share the generated
    // 1200x630 JPEG card rather than the page's own hero.
    ogImage: `/images/og/${entry.slug}.jpg`,
    ogType: 'article',
    publishedTime: entry.dateISO,
  })
}

export default async function JournalPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const entry = getJournalEntry(slug)
  if (!entry) notFound()

  return (
    <article>
      <ArticleHero entry={entry} />
      <ArticleBody entry={entry} />
      <ArticleNav slug={entry.slug} />
    </article>
  )
}