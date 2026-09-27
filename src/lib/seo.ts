import type { Metadata } from 'next'
import { assetUrl, resolveUrl } from '@/lib/site-config'

type SeoOptions = {
  title: string
  description: string
  path?: string
  ogImage?: string
  ogImageAlt?: string
  ogType?: 'website' | 'article'
  publishedTime?: string
  /** Per-page keywords, derived from the entry's own data. */
  keywords?: string[]
}

export function buildMeta({
  title,
  description,
  path = '/',
  ogImage,
  ogImageAlt,
  ogType = 'website',
  publishedTime,
  keywords,
}: SeoOptions): Metadata {
  const image = ogImage ?? '/images/og/og-citgroup-and-vale.jpg'
  const imageAlt = ogImageAlt ?? title
  return {
    title,
    description,
    ...(keywords && keywords.length ? { keywords } : {}),
    alternates: { canonical: resolveUrl(path) },
    openGraph: {
      title,
      description,
      url: resolveUrl(path),
      siteName: 'Citgroup & Vale',
      locale: 'en_US',
      type: ogType,
      images: [{ url: assetUrl(image), width: 1200, height: 630, alt: imageAlt }],
      ...(publishedTime ? { publishedTime } : {}),
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [assetUrl(image)],
    },
  }
}