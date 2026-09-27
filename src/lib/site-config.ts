import { site } from '@/data/config'

export const siteConfig = {
  baseUrl: 'https://citgroupandvale.com',
  title: 'citgroup & Vale — Interior Architecture & Design | New York',
  description:
    'citgroup & Vale is a New York interior architecture and design studio creating refined residential, hospitality, and commercial spaces.',
  metadataBase: 'https://citgroupandvale.com',
  ogImage: '/images/og/og-citgroup-and-vale.jpg',
} as const

/**
 * Builds an absolute URL for a site **page** path.
 *
 * The site is exported with `trailingSlash: true`, so every canonical, `og:url`
 * and sitemap entry must carry the trailing slash to match the URL that is
 * actually served. Normalising here keeps those signals consistent.
 */
export function resolveUrl(path = '/') {
  const clean = path.startsWith('/') ? path : `/${path}`
  if (clean === '/') return `${siteConfig.baseUrl}/`
  return `${siteConfig.baseUrl}${clean.replace(/\/+$/, '')}/`
}

/**
 * Builds an absolute URL for a static **asset** (image, font, file).
 *
 * Assets must not receive a trailing slash — `/image.jpg/` would 404 — so this
 * deliberately does not use the page normaliser.
 */
export function assetUrl(path: string) {
  return `${siteConfig.baseUrl}${path.startsWith('/') ? path : `/${path}`}`
}