import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/site-config'

// Required for `output: 'export'` so the route prerenders to a static file.
export const dynamic = 'force-static'

/**
 * Prerendered to /robots.txt at export time. Points crawlers at the
 * generated sitemap, which lives at the site root.
 */
export default function robots(): MetadataRoute.Robots {
  const base = siteConfig.baseUrl.replace(/\/$/, '')

  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}
