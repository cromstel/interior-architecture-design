'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { HeroBackdrop, HeroScrim } from '@/components/hero-backdrop'
import { Breadcrumbs } from '@/components/breadcrumbs'
import { cn } from '@/lib/cn'

const EASE = [0.16, 1, 0.3, 1] as const

type PageHeroProps = {
  /** Resolved `-lg` hero path, resolved on the server via `lg()`. */
  src: string
  /** Describes the photograph. */
  alt: string
  eyebrow: string
  title: string
  lede?: string
  crumb: string
  /** Overrides the banner height; the default leaves the section below reachable. */
  className?: string
}

/**
 * Photographic hero banner for the standalone routes.
 *
 * Every page in the site opens on a full-bleed photograph — the homepage, the
 * project and journal templates, the 404, and these five routes — so the
 * banner is the site's consistent first impression rather than a feature of
 * some pages.
 *
 * Height is a little shorter than the project banner (its metadata ledger has
 * to stay visible on the first screen) and the plate is anchored to the lower
 * left, where the scrim is deepest. Text rises from an offset rather than
 * fading, so the copy is in the first paint instead of waiting on hydration.
 *
 * The plate's container must stay identical to the body sections below it
 * (`mx-auto max-w-7xl`). A narrower, un-centred plate lines up below the
 * 1280px cap and drifts above it, so the two only ever agree by accident.
 * `scripts/verify-gutter.mjs` fails the build on any uncentred `max-w-7xl`.
 *
 * Vertical spacing is shared as `PAGE_TOP_GAP` from `src/lib/spacing.ts` because
 * the five routes have to agree on it. It is the space between this breadcrumb
 * strip and the first body content, and it had drifted to three different values
 * — 57px on /projects/, 112px on /about/ /services/ /contact/, and 209px on
 * /journal/ — so the same banner led to a different first line on every route.
 * It lives in `lib/` rather than here because this module is `'use client'`, and
 * a server component cannot read a constant out of one.
 */
export function PageHero({
  src,
  alt,
  eyebrow,
  title,
  lede,
  crumb,
  className,
}: PageHeroProps) {
  const reduced = useReducedMotion()

  return (
    <header className={cn('relative', className)}>
      <div className="relative h-[62svh] min-h-[420px] overflow-hidden bg-ink md:h-[76svh] md:min-h-[540px]">
        <HeroBackdrop src={src} alt={alt} amount={0.08} />

        <HeroScrim direction="to top left" />

        <motion.div
          className="relative z-10 flex h-full flex-col justify-end px-6 pb-10 pt-28 md:px-10 md:pb-14"
          initial={reduced ? false : { y: 22, scale: 0.98 }}
          animate={{ y: 0, scale: 1 }}
          transition={{ duration: 1, ease: EASE, delay: 0.15 }}
        >
          {/* `mx-auto max-w-7xl` is the same container every body section uses,
              which is what keeps the title on the page's left axis. This was
              `max-w-5xl` with no `mx-auto`: below the 1280px cap both fill the
              available width so the gutter matched, and the break was invisible
              on a laptop. Above the cap the body centres while the banner stayed
              hard against the page padding, drifting to 280px apart at 1920. */}
          <div className="mx-auto w-full max-w-7xl">
            <p className="font-sans text-[11px] font-light uppercase leading-loose tracking-[var(--tracking-meta)] text-chalk/75">
              {eyebrow}
            </p>
            <h1 className="mt-4 max-w-5xl text-balance font-display text-[clamp(2.4rem,6.6vw,5.8rem)] font-light leading-[0.98] tracking-[-0.015em] text-chalk">
              {title}
            </h1>
            {lede && (
              <p className="mt-6 max-w-2xl font-sans text-sm font-light leading-relaxed text-chalk/80 md:text-base">
                {lede}
              </p>
            )}
          </div>
        </motion.div>
      </div>

      <div className="border-t border-ink/10 bg-chalk">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <Breadcrumbs
            className="py-6 md:py-7"
            items={[{ label: 'Studio', href: '/' }, { label: crumb }]}
          />
        </div>
      </div>
    </header>
  )
}
