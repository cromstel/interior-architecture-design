import type { MetadataRoute } from 'next'
import { siteConfig } from '@/lib/site-config'
import { projects } from '@/data/projects'
import { journalEntries } from '@/data/journal'

// Required for `output: 'export'` so the route prerenders to a static file.
export const dynamic = 'force-static'

/**
 * Prerendered to /sitemap.xml at export time. Deriving the entries from the
 * data layer means the sitemap can never drift from the routes that actually
 * exist, and every URL keeps the trailing slash the site is built with.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.baseUrl.replace(/\/$/, '')
  const lastModified = new Date()

  return [
    { url: `${base}/`, lastModified, changeFrequency: 'monthly', priority: 1 },
    // The five editorial routes. Held explicitly rather than derived, because
    // none of them come from the data layer — they are hand-built pages, and
    // adding a sixth without adding it here would ship an orphan.
    { url: `${base}/projects/`, lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: `${base}/about/`, lastModified, changeFrequency: 'yearly', priority: 0.7 },
    { url: `${base}/services/`, lastModified, changeFrequency: 'yearly', priority: 0.7 },
    { url: `${base}/journal/`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${base}/contact/`, lastModified, changeFrequency: 'yearly', priority: 0.6 },
    ...projects().map((p) => ({
      url: `${base}/projects/${p.slug}/`,
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.8,
    })),
    ...journalEntries().map((e) => ({
      url: `${base}/journal/${e.slug}/`,
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.6,
    })),
  ]
}
