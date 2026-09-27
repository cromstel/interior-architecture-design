import Link from 'next/link'
import { lg } from '@/lib/image-variants'
import { navLinks } from '@/data/site'
import { NotFoundHero } from '@/components/not-found-hero'

export default function NotFound() {
  const heroBase = '/images/hero/hero-404.avif'
  const heroLg = lg(heroBase)

  return (
    <>
      {/* `lg()` is resolved here, in the server component, so the client hero
          never pulls in node:fs. The banner is a CSS background, so the LCP
          image is preloaded explicitly. */}
      <link
        rel="preload"
        as="image"
        imageSrcSet={`${heroBase} 1200w, ${heroLg} 2000w`}
        imageSizes="100vw"
      />
      <NotFoundHero src={heroLg} />

      <section className="px-6 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-7xl">
          <h2 className="meta-label">Elsewhere in the studio</h2>
          <ul className="mt-8 border-t border-ink/10 md:mt-10">
            {navLinks.map((link) => (
              <li key={link.label} className="border-b border-ink/10">
                <Link
                  href={link.href}
                  className="group flex items-center justify-between gap-6 py-5 transition-colors duration-500 hover:text-stone md:py-6"
                >
                  <span className="font-display text-[clamp(1.3rem,2.4vw,1.9rem)] font-light leading-none tracking-[-0.01em] text-ink">
                    {link.label}
                  </span>
                  <span
                    aria-hidden
                    className="inline-block text-stone transition-transform duration-500 ease-out group-hover:translate-x-1.5"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
