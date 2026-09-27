'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ParallaxImage } from '@/components/motion/parallax-image'

const EASE = [0.16, 1, 0.3, 1] as const

type ProjectHeroBannerProps = {
  src: string
  alt: string
  index: string
  title: string
  location: string
  width?: number
  height?: number
}

/**
 * Full-bleed project banner: photograph to the edges, title plate anchored to
 * the lower left. Distinct from the homepage hero in height (the ledger of
 * metadata below must stay reachable on the first screen), type scale, and
 * scrim geometry — the fall-off runs diagonally so the plate reads as the
 * darkest corner of the frame.
 */
export function ProjectHeroBanner({
  src,
  alt,
  index,
  title,
  location,
  width,
  height,
}: ProjectHeroBannerProps) {
  const reduced = useReducedMotion()

  return (
    <div className="relative h-[64svh] min-h-[400px] overflow-hidden bg-ink md:h-[82svh] md:min-h-[560px]">
      <div className="absolute inset-0">
        <ParallaxImage
          src={src}
          alt={alt}
          className="h-full w-full"
          amount={0.08}
          priority
          sizes="100vw"
          width={width}
          height={height}
        />
      </div>

      {/* Legibility scrim only — no decorative gradient. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(to top right, rgba(10,9,7,0.78) 0%, rgba(10,9,7,0.46) 28%, rgba(10,9,7,0.10) 60%, rgba(10,9,7,0) 80%)',
        }}
      />

      <motion.div
        className="relative z-10 flex h-full flex-col justify-end px-6 pb-8 pt-28 md:px-10 md:pb-12"
        initial={reduced ? false : { opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE, delay: 0.15 }}
      >
        <p className="font-display text-base italic text-chalk/75 md:text-lg">{index}</p>
        <h1 className="mt-3 max-w-5xl text-balance font-display text-[clamp(2.2rem,6.4vw,5.6rem)] font-light leading-[0.98] tracking-[-0.015em] text-chalk">
          {title}
        </h1>
        <p className="mt-4 font-sans text-[11px] font-light uppercase tracking-[var(--tracking-meta)] text-chalk/75">
          {location}
        </p>
      </motion.div>
    </div>
  )
}
