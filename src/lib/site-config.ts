import { site } from '@/data/config'

/**
 * Canonical origin. Every canonical link, `og:url`, Twitter image, sitemap
 * entry and JSON-LD `@id` is derived from this, so it must equal the host the
 * site is actually served from.
 *
 * The studio is published at `interior-design.cromstelit.com`. When this moves
 * to the apex domain, change this one value and rebuild — nothing else in the
 * codebase hardcodes a host.
 */
export const SITE_ORIGIN = 'https://interior-design.cromstelit.com'

export const siteConfig = {
  baseUrl: SITE_ORIGIN,
  title: 'citgroup & Vale — Interior Architecture & Design | New York',
  description:
    'citgroup & Vale is a New York interior architecture and design studio creating refined residential, hospitality, and commercial spaces.',
  metadataBase: SITE_ORIGIN,
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