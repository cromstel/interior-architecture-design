'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { site } from '@/data/config'
import { RevealText } from '@/components/motion/reveal-text'
import { HeroBackdrop, HeroScrim } from '@/components/hero-backdrop'

const EASE = [0.16, 1, 0.3, 1] as const

const HERO_SRC = '/images/hero/hero-homepage-lg.avif'
const HERO_ALT =
  'A calm, light-filled New York residence by Citgroup & Vale — pale plaster walls and natural light.'

export function Hero() {
  const reduced = useReducedMotion()

  return (
    <section className="relative h-[100svh] min-h-[600px] overflow-hidden bg-ink">
      <HeroBackdrop src={HERO_SRC} alt={HERO_ALT} amount={0.16} />

      <HeroScrim />

      <motion.div
        initial={reduced ? false : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.1, ease: EASE }}
        className="relative z-10 flex h-full flex-col justify-between px-6 pb-16 pt-28 md:px-10 md:pt-32"
      >
        <div>
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
            className="font-sans text-[11px] font-light uppercase tracking-[0.3em] text-chalk/85"
          >
            {site.tagline}
          </motion.p>

          <div className="max-w-5xl">
            <RevealText
              as="h1"
              text="Spaces with a sense of permanence."
              className="text-balance font-display text-[clamp(3rem,9vw,8.5rem)] font-light leading-[0.95] tracking-[-0.01em] text-chalk"
              delay={0.1}
              stagger={0.06}
            />
            <div className="mt-8 max-w-md md:mt-10">
              <motion.p
                initial={reduced ? false : { opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.9, delay: 0.65, ease: EASE }}
                className="font-sans text-base font-light leading-relaxed text-chalk/80"
              >
                Interior architecture and design shaped by material, light, proportion, and the way
                people live.
              </motion.p>
              <motion.div
                initial={reduced ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.9, delay: 0.85 }}
                className="mt-10"
              >
                <Link
                  href="#projects"
                  className="group inline-flex items-center gap-3 font-sans text-[11px] font-normal uppercase tracking-[var(--tracking-meta)] text-chalk/90 transition-colors hover:text-chalk"
                >
                  Explore Selected Work
                  <ArrowDown
                    size={13}
                    strokeWidth={1.5}
                    className="transition-transform duration-500 ease-out group-hover:translate-y-1"
                  />
                </Link>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  )
}