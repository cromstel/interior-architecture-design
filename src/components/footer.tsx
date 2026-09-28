import Link from 'next/link'
import { site } from '@/data/config'
import { navLinks } from '@/data/site'

/**
 * Site footer. Centred throughout: the wordmark and descriptor sit on the
 * axis, the three link groups share an even three-column row beneath, and the
 * legal line is centred rather than split to the corners. The hairline rules,
 * meta labels and the oversized ghost wordmark carry the same editorial
 * language as the rest of the site.
 */
export function Footer() {
  return (
    <footer className="bg-ink text-chalk">
      <div className="px-6 pt-24 text-center md:px-10 md:pt-32">
        <Link href="/" className="wordmark text-chalk">
          citgroup&nbsp;&amp; VALE
        </Link>
        <p className="mx-auto mt-4 max-w-md font-display text-2xl font-light italic leading-snug text-chalk/80">
          {site.descriptor} in {site.city}.
        </p>

        <div className="mx-auto mt-16 grid max-w-4xl gap-y-14 md:mt-20 md:grid-cols-3 md:gap-x-10">
          <div>
            <p className="meta-label-dark mb-6">Studio</p>
            <address className="space-y-1.5 font-sans text-sm font-light not-italic leading-relaxed text-chalk/75">
              <p>{site.address.street}</p>
              <p>{site.address.lines[1]}</p>
              <p className="pt-3">
                <a href={`tel:${site.phone.tel}`} className="hover:text-chalk">
                  {site.phone.display}
                </a>
              </p>
              <p>
                <a href={`mailto:${site.email}`} className="hover:text-chalk">
                  {site.email}
                </a>
              </p>
            </address>
          </div>

          <div>
            <p className="meta-label-dark mb-6">Index</p>
            <ul className="space-y-2.5 font-sans text-sm font-light text-chalk/75">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="transition-opacity hover:opacity-100 opacity-80">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="meta-label-dark mb-6">Social</p>
            <ul className="space-y-2.5 font-sans text-sm font-light text-chalk/75">
              {[site.social.instagram, site.social.pinterest, site.social.linkedin].map((s) => (
                <li key={s.label}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="opacity-80 transition-opacity hover:opacity-100"
                  >
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-20 border-t border-chalk/15 pt-8 font-sans text-[10px] uppercase tracking-[var(--tracking-meta)] text-chalk/60">
          {site.areas.join(' · ')}
        </p>

        <div className="ghost-wordmark" aria-hidden />

        <div className="flex flex-col items-center gap-2 border-t border-chalk/15 py-6 text-center font-sans text-[10px] uppercase tracking-[var(--tracking-meta)] text-chalk/55">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>
            Powered By{' '}
            <a
              href="https://cromstelit.com"
              target="_blank"
              rel="noreferrer noopener"
              className="transition-colors hover:text-chalk"
            >
              CITGROUP
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
