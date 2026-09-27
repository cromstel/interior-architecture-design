'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { site } from '@/data/config'
import { RevealText } from '@/components/motion/reveal-text'

const EASE = [0.16, 1, 0.3, 1] as const

export function Hero() {
  const ref = useRef<HTMLElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], ['0%', reduced ? '0%' : '16%'])
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0])

  return (
    <section ref={ref} className="relative h-[100svh] min-h-[600px] overflow-hidden bg-ink">
      <motion.div style={{ y }} className="absolute inset-0">
        <motion.div
          className="h-full w-full"
          initial={reduced ? false : { scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 2.4, ease: EASE }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/images/hero/hero-homepage-lg.avif"
            srcSet="/images/hero/hero-homepage.avif 1200w, /images/hero/hero-homepage-lg.avif 2000w"
            sizes="100vw"
            alt="A calm, light-filled New York residence by Citgroup & Vale — pale plaster walls and natural light."
            className="h-full w-full object-cover"
            width={2400}
            height={2400}
            loading="eager"
            fetchPriority="high"
            decoding="async"
          />
        </motion.div>
      </motion.div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(to top, rgba(10,9,7,0.72) 0%, rgba(10,9,7,0.28) 34%, rgba(10,9,7,0) 60%)',
        }}
      />

      <motion.div
        style={{ opacity: fade }}
        className="relative z-10 flex h-full flex-col justify-between px-6 pb-16 pt-28 md:px-10 md:pt-32"
      >
        <motion.div
          initial={reduced ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE, delay: 0.2 }}
        >
          <motion.p
            initial={reduced ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.45, ease: EASE }}
            className="font-sans text-[11px] font-light uppercase tracking-[0.3em] text-chalk/80"
          >
            {site.tagline}
          </motion.p>

        <div className="max-w-5xl">
          <RevealText
            as="h1"
            text="Spaces with a sense of permanence."
            className="font-display text-[clamp(3rem,9vw,8.5rem)] font-light leading-[0.95] tracking-[-0.01em] text-chalk"
            delay={0.1}
            stagger={0.06}
          />
          <div className="mt-8 max-w-md md:mt-10">
            <motion.p
              initial={reduced ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.65, ease: EASE }}
              className="font-sans text-base font-light leading-relaxed text-chalk/75"
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
        </motion.div>
      </motion.div>
    </section>
  )
}