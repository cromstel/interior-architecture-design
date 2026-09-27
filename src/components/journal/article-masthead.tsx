'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { HeroBackdrop, HeroScrim } from '@/components/hero-backdrop'
import { readingTime } from '@/lib/derived'
import type { JournalEntry } from '@/data/journal'

const EASE = [0.16, 1, 0.3, 1] as const

type ArticleMastheadProps = {
  category: string
  date: string
  title: string
  excerpt: string
  src: string
  alt: string
  /** Word count and reading time, derived from the article's own copy. */
  words?: number
  minutes?: number
}

/**
 * Journal masthead: a full-bleed banner carrying the entry's hero as a
 * background, with the title plate anchored to the lower left beneath a
 * legibility scrim.
 *
 * Shorter and more restrained than the project banner so an article still
 * opens as a page rather than a poster, and the excerpt is held to a narrower
 * measure than the project title to keep the two templates distinguishable.
 */
export function ArticleMasthead({
  category,
  date,
  title,
  excerpt,
  src,
  alt,
  words,
  minutes,
}: ArticleMastheadProps) {
  const reduced = useReducedMotion()

  return (
    <header className="relative h-[62svh] min-h-[420px] overflow-hidden bg-ink md:h-[78svh] md:min-h-[540px]">
      <HeroBackdrop src={src} alt={alt} amount={0.07} />

      <HeroScrim
        direction="to top left"
        stops="rgba(10,9,7,0.84) 0%, rgba(10,9,7,0.62) 32%, rgba(10,9,7,0.36) 64%, rgba(10,9,7,0.40) 100%"
      />

      <motion.div
        className="relative z-10 flex h-full flex-col justify-end px-6 pb-10 pt-28 md:px-10 md:pb-14"
        initial={reduced ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: EASE, delay: 0.15 }}
      >
        {/* Left-anchored column, so the excerpt keeps a readable measure. */}
        <div>
          <p className="font-sans text-[11px] font-light uppercase tracking-[var(--tracking-meta)] text-chalk/80">
            {category}
            <span className="mx-3" aria-hidden>
              ·
            </span>
            {date}
            {typeof minutes === 'number' && (
              <>
                <span className="mx-3" aria-hidden>
                  ·
                </span>
                {minutes} min read
                {typeof words === 'number' && (
                  <span className="mx-3" aria-hidden>
                    ·
                  </span>
                )}
                {typeof words === 'number' && `${words.toLocaleString('en-US')} words`}
              </>
            )}
          </p>
          <h1 className="mt-4 max-w-4xl text-balance font-display text-[clamp(2rem,5.6vw,4.8rem)] font-light leading-[1.03] tracking-[-0.015em] text-chalk">
            {title}
          </h1>
          <p className="mt-5 max-w-xl font-sans text-sm font-light leading-relaxed text-chalk/80 md:text-base">
            {excerpt}
          </p>
        </div>
      </motion.div>
    </header>
  )
}
