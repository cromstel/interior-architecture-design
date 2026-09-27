'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { AnimatedRule } from '@/components/motion/animated-rule'
import { MaskedImage } from '@/components/motion/masked-image'

const EASE = [0.16, 1, 0.3, 1] as const

type ArticleMastheadProps = {
  category: string
  date: string
  title: string
  excerpt: string
  src: string
  alt: string
}

/**
 * Journal masthead: a print-style two-column opening — title block on the
 * left, a portrait-cropped plate on the right, divided by a single vertical
 * hairline. Deliberately not an overlaid banner: the article reads as a page,
 * not as a poster, and the image sits in the grid rather than bleeding to the
 * edges. The plate keeps one fixed crop across every entry so the journal
 * pages stay consistent regardless of each entry's source ratio.
 */
export function ArticleMasthead({
  category,
  date,
  title,
  excerpt,
  src,
  alt,
}: ArticleMastheadProps) {
  const reduced = useReducedMotion()

  return (
    <header className="px-6 pt-32 md:px-10 md:pt-40">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-12 md:grid-cols-12 md:gap-0">
          <motion.div
            className="md:col-span-7 md:pr-10 lg:pr-16"
            initial={reduced ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.1 }}
          >
            <p className="meta-label">
              {category}
              <span className="mx-3" aria-hidden>
                ·
              </span>
              {date}
            </p>
            <h1 className="mt-6 max-w-3xl text-balance font-display text-[clamp(2.2rem,5.4vw,4.9rem)] font-light leading-[1.02] tracking-[-0.015em] text-ink">
              {title}
            </h1>
            <AnimatedRule className="mt-8 w-24 md:mt-10" />
            <p className="mt-6 max-w-xl font-sans text-sm font-light leading-relaxed text-stone md:text-base">
              {excerpt}
            </p>
          </motion.div>

          <motion.figure
            className="md:col-span-5 md:border-l md:border-ink/10 md:pl-10 lg:pl-16"
            initial={reduced ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 0.25 }}
          >
            <MaskedImage
              src={src}
              alt={alt}
              className="aspect-[4/5] w-full md:aspect-[3/4]"
              priority
              sizes="(min-width: 1280px) 470px, (min-width: 768px) 44vw, 92vw"
            />
          </motion.figure>
        </div>
      </div>
    </header>
  )
}
