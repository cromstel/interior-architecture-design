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
          initial={reduced ? false : { y: 22 }}
          animate={{ y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.15 }}
        >
          <div className="max-w-5xl">
            <p className="font-sans text-[11px] font-light uppercase leading-loose tracking-[var(--tracking-meta)] text-chalk/75">
              {eyebrow}
            </p>
            <h1 className="mt-4 text-balance font-display text-[clamp(2.4rem,6.6vw,5.8rem)] font-light leading-[0.98] tracking-[-0.015em] text-chalk">
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
