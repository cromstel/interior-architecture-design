import { site } from '@/data/config'
import { siteConfig, resolveUrl } from '@/lib/site-config'
import type { Project } from '@/data/projects'
import type { JournalEntry } from '@/data/journal'
import { readingTime, wordCount } from '@/lib/derived'

/**
 * Per-page JSON-LD builders.
 *
 * All values are taken from the data layer — no claim here is invented. The
 * site-wide `ProfessionalService` / `Place` / `WebSite` graph lives in
 * layout.tsx; these add the page-specific nodes that Google needs for rich
 * results on individual pieces of work and articles.
 */

const STUDIO = {
  '@type': 'Organization',
  '@id': `${siteConfig.baseUrl}/#studio`,
  name: site.name,
  url: `${siteConfig.baseUrl}/`,
}

function breadcrumbList(trail: { name: string; url: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: trail.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/** A finished piece of work. */
export function projectJsonLd(project: Project) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'CreativeWork',
        '@id': `${resolveUrl(`/projects/${project.slug}`)}#work`,
        name: project.title,
        description: project.summary,
        url: resolveUrl(`/projects/${project.slug}`),
        abstract: project.intro,
        genre: project.category,
        dateCreated: String(project.year),
        image: [`${siteConfig.baseUrl}/images/og/${project.slug}.jpg`],
        creator: { '@id': `${siteConfig.baseUrl}/#studio` },
        publisher: STUDIO,
        about: {
          '@type': 'Place',
          name: project.location,
        },
      },
      breadcrumbList([
        { name: 'Home', url: resolveUrl('/') },
        { name: 'Selected Work', url: resolveUrl('/#projects') },
        { name: project.title, url: resolveUrl(`/projects/${project.slug}`) },
      ]),
    ],
  }
}

/** A journal article, with the derived reading-time signal publishers expect. */
export function articleJsonLd(entry: JournalEntry) {
  const { minutes, words } = readingTime(entry.blocks)

  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        '@id': `${resolveUrl(`/journal/${entry.slug}`)}#article`,
        headline: entry.title,
        description: entry.seo.description,
        url: resolveUrl(`/journal/${entry.slug}`),
        mainEntityOfPage: resolveUrl(`/journal/${entry.slug}`),
        image: [`${siteConfig.baseUrl}/images/og/${entry.slug}.jpg`],
        datePublished: entry.dateISO,
        articleSection: entry.category,
        inLanguage: 'en-US',
        wordCount: words,
        timeRequired: `PT${minutes}M`,
        isAccessibleForFree: true,
        author: { '@id': `${siteConfig.baseUrl}/#studio` },
        publisher: STUDIO,
      },
      breadcrumbList([
        { name: 'Home', url: resolveUrl('/') },
        { name: 'Journal', url: resolveUrl('/#journal') },
        { name: entry.title, url: resolveUrl(`/journal/${entry.slug}`) },
      ]),
    ],
  }
}

/**
 * Site-level nodes: the site itself and the organization behind it. Kept here
 * so layout.tsx and the per-page builders draw on one definition of the
 * studio rather than repeating it.
 */
export function siteGraph() {
  return [
    {
      '@type': 'WebSite',
      '@id': `${siteConfig.baseUrl}/#website`,
      url: `${siteConfig.baseUrl}/`,
      name: site.name,
      description: siteConfig.description,
      inLanguage: 'en-US',
      publisher: { '@id': `${siteConfig.baseUrl}/#studio` },
    },
    {
      '@type': 'Organization',
      '@id': `${siteConfig.baseUrl}/#organization`,
      name: site.name,
      legalName: site.name,
      alternateName: site.wordmark,
      url: `${siteConfig.baseUrl}/`,
      description: siteConfig.description,
      foundingDate: String(site.estYear),
      logo: `${siteConfig.baseUrl}/favicon.ico`,
      email: site.email,
      telephone: site.phone.display,
      address: {
        '@type': 'PostalAddress',
        streetAddress: site.address.street,
        addressLocality: site.address.city,
        addressRegion: site.address.state,
        postalCode: site.address.zip,
        addressCountry: site.address.country,
      },
      founder: site.founders.map((f) => ({
        '@type': 'Person',
        name: f.name,
        jobTitle: f.role,
      })),
      sameAs: [site.social.instagram.url, site.social.pinterest.url, site.social.linkedin.url],
    },
  ]
}

export { wordCount }
