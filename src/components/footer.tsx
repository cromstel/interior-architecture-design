import Link from 'next/link'
import { site } from '@/data/config'
import { navLinks } from '@/data/site'

export function Footer() {
  return (
    <footer className="bg-ink text-chalk">
      <div className="px-6 pt-24 md:px-10 md:pt-32">
        <div className="grid grid-cols-2 gap-x-6 gap-y-14 md:grid-cols-12">
          <div className="col-span-2 md:col-span-5">
            <Link href="/" className="wordmark text-chalk">
              citgroup&nbsp;&amp; VALE
            </Link>
            <p className="mt-4 font-display text-2xl font-light italic leading-snug text-chalk/80 md:max-w-xs">
              {site.descriptor} in {site.city}.
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="meta-label mb-6">Studio</p>
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

          <div className="md:col-span-2">
            <p className="meta-label mb-6">Index</p>
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

          <div className="md:col-span-2">
            <p className="meta-label mb-6">Social</p>
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

        <div className="overflow-hidden py-10 md:py-16" aria-hidden>
          <p className="whitespace-nowrap text-center font-display font-medium uppercase leading-[0.85] tracking-[0.02em] text-chalk/[0.07] text-[clamp(3rem,13vw,12.5rem)] select-none">
            citgroup&nbsp;&amp;&nbsp;VALE
          </p>
        </div>

        <div className="flex flex-col gap-2 border-t border-chalk/15 py-6 font-sans text-[10px] uppercase tracking-[var(--tracking-meta)] text-chalk/55 md:flex-row md:items-center md:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>Photography via Unsplash</p>
        </div>
      </div>
    </footer>
  )
}