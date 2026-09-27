'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { HeroBackdrop, HeroScrim } from '@/components/hero-backdrop'

const EASE = [0.16, 1, 0.3, 1] as const

type ProjectHeroBannerProps = {
  src: string
  alt: string
  index: string
  title: string
  location: string
}

/**
 * Full-bleed project banner: photograph painted as a background to the edges,
 * title plate anchored to the lower left. Distinct from the homepage hero in
 * height (the metadata ledger below must stay reachable on the first screen)
 * and type scale. The scrim deepens toward the lower left so the plate holds
 * its contrast over the photograph.
 */
export function ProjectHeroBanner({
  src,
  alt,
  index,
  title,
  location,
}: ProjectHeroBannerProps) {
  const reduced = useReducedMotion()

  return (
    <div className="relative h-[64svh] min-h-[400px] overflow-hidden bg-ink md:h-[82svh] md:min-h-[560px]">
      <HeroBackdrop src={src} alt={alt} amount={0.08} />

      <HeroScrim direction="to top left" />

      <motion.div
        className="relative z-10 flex h-full flex-col justify-end px-6 pb-8 pt-28 md:px-10 md:pb-12"
        initial={reduced ? false : { opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE, delay: 0.15 }}
      >
        {/* The plate is anchored to the left edge, so the scrim falls off
            diagonally to leave the right of the frame open. */}
        <div>
          <p className="font-display text-base italic text-chalk/80 md:text-lg">{index}</p>
          <h1 className="mt-3 max-w-5xl text-balance font-display text-[clamp(2.2rem,6.4vw,5.6rem)] font-light leading-[0.98] tracking-[-0.015em] text-chalk">
            {title}
          </h1>
          <p className="mt-4 font-sans text-[11px] font-light uppercase tracking-[var(--tracking-meta)] text-chalk/80">
            {location}
          </p>
        </div>
      </motion.div>
    </div>
  )
}
