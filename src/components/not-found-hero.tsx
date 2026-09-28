'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { HeroBackdrop, HeroScrim } from '@/components/hero-backdrop'

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * 404 hero: a short, still banner of an unoccupied room. Shorter than the
 * project banner so the page still offers its way back below the fold rather
 * than filling the screen with an error. Motion is a single fade-and-rise.
 */
export function NotFoundHero({ src }: { src: string }) {
  const reduced = useReducedMotion()

  return (
    <section className="relative h-[58svh] min-h-[380px] overflow-hidden bg-ink md:h-[70svh] md:min-h-[520px]">
      <HeroBackdrop
        src={src}
        alt="An unoccupied room in low, even light, with nothing in it and no one at home."
        amount={0.06}
      />

      <HeroScrim />

      <motion.div
        className="relative z-10 flex h-full flex-col justify-end px-6 pb-10 pt-28 md:px-10 md:pb-14"
        initial={reduced ? false : { y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 1, ease: EASE, delay: 0.15 }}
      >
        {/* Left-anchored column. */}
        <div>
          <p className="font-display text-lg italic text-chalk/75">404</p>
          <h1 className="mt-4 max-w-3xl text-balance font-display text-[clamp(2rem,5.2vw,4.4rem)] font-light leading-[1.04] tracking-[-0.015em] text-chalk">
            This room has been quiet for a long time.
          </h1>
          <p className="mt-5 max-w-md font-sans text-sm font-light leading-relaxed text-chalk/80">
            The page you’re looking for has moved, changed, or never existed. Everything else is
            still where it should be.
          </p>
          <div className="mt-8">
            <Link
              href="/"
              className="group inline-flex items-center gap-3 font-sans text-[11px] font-normal uppercase tracking-[var(--tracking-meta)] text-chalk/90 transition-colors hover:text-chalk"
            >
              Return to the Studio
              <span
                aria-hidden
                className="inline-block transition-transform duration-500 ease-out group-hover:translate-x-1.5"
              >
                →
              </span>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  )
}
