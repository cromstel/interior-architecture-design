import type { Metadata, Viewport } from 'next'
import { Cormorant_Garamond, Inter } from 'next/font/google'
import { site } from '@/data/config'
import { siteConfig } from '@/lib/site-config'
import { Navigation } from '@/components/navigation'
import { Footer } from '@/components/footer'
import { BackToTop } from '@/components/back-to-top'
import { UserTiming } from '@/components/user-timing'
import { ProgressBar } from '@/components/progress-bar'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.baseUrl),
  title: siteConfig.title,
  description: siteConfig.description,
  applicationName: site.name,
  authors: [{ name: 'Citgroup & Vale' }],
  category: 'architecture',
  keywords: [
    'interior architecture',
    'interior design',
    'New York interior designer',
    'residential design',
    'townhouse renovation',
    'architecture studio',
  ],
  alternates: { canonical: siteConfig.baseUrl },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: site.name,
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.baseUrl,
    images: [
      {
        url: `${siteConfig.baseUrl}${siteConfig.ogImage}`,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    site: '@citgroupandvale',
    card: 'summary_large_image',
  },
  robots: { index: true, follow: true },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/favicon.ico',
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#faf8f3',
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'ProfessionalService',
      '@id': `${siteConfig.baseUrl}/#studio`,
      name: 'Citgroup & Vale',
      alternateName: site.wordmark,
      description: siteConfig.description,
      url: siteConfig.baseUrl,
      telephone: site.phone.display,
      email: site.email,
      foundingDate: String(site.estYear),
      founders: site.founders.map((f) => ({
        '@type': 'Person',
        name: f.name,
        jobTitle: f.role,
      })),
      address: {
        '@type': 'PostalAddress',
        streetAddress: site.address.street,
        addressLocality: site.address.city,
        addressRegion: site.address.state,
        postalCode: site.address.zip,
        addressCountry: site.address.country,
      },
      areaServed: site.areas.map((a) => ({ '@type': 'City', name: a })),
      sameAs: [site.social.instagram.url, site.social.pinterest.url, site.social.linkedin.url],
      knowsAbout: [
        'interior architecture',
        'residential interiors',
        'townhouse renovation',
        'interior design',
      ],
    },
    {
      '@type': 'Place',
      '@id': `${siteConfig.baseUrl}/#address`,
      name: `${site.name} — Studio`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: site.address.street,
        addressLocality: site.address.city,
        addressRegion: site.address.state,
        postalCode: site.address.zip,
        addressCountry: site.address.country,
      },
      telephone: site.phone.display,
    },
    {
      '@type': 'BreadcrumbList',
      '@id': `${siteConfig.baseUrl}/#breadcrumb`,
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Citgroup & Vale',
          item: siteConfig.baseUrl,
        },
      ],
    },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const vars = `${inter.variable} ${cormorant.variable}`

  return (
    <html lang="en" className={`${vars} js`} suppressHydrationWarning>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-chalk"
        >
          Skip to content
        </a>
        <ProgressBar />
        <Navigation />
        <main id="main">{children}</main>
        <Footer />
        <BackToTop />
        <UserTiming />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  )
}