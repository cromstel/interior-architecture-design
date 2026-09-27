'use client'

import Link from 'next/link'
import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/cn'
import type { JournalEntry } from '@/data/journal'
import { RevealText } from '@/components/motion/reveal-text'

const EASE = [0.16, 1, 0.3, 1] as const

function JournalImage({
  src,
  alt,
  sizes,
  className,
}: {
  src: string
  alt: string
  sizes?: string
  className?: string
}) {
  const reduced = useReducedMotion()
  // Responsive pairing so phones never pull the 2400px copy. The card is
  // partial-width in the 12-col grid, hence the narrower `sizes`.
  const baseSrc = src.replace(/-lg\.(jpe?g|png|webp|avif)$/, '.$1')
  const srcSet = src !== baseSrc ? `${baseSrc} 1200w, ${src} 2000w` : undefined
  return (
    <motion.img
      src={src}
      srcSet={srcSet}
      sizes={sizes ?? '100vw'}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={cn('block h-full w-full object-cover will-change-transform', className)}
      initial={reduced ? false : { y: '9%', scale: 1.12 }}
      whileInView={reduced ? undefined : { y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1.2, ease: EASE }}
      whileHover={reduced ? undefined : { scale: 1.04 }}
    />
  )
}

export function JournalSection({ entries }: { entries: JournalEntry[] }) {
  const [a, b, c] = entries

  return (
    <section id="journal" className="scroll-mt-24 px-6 py-24 md:px-10 md:py-40">
      <div className="max-w-7xl">
        <div className="flex items-end justify-between gap-6 pb-12 md:pb-16">
          <RevealText
            as="h2"
            text="Journal"
            className="font-display text-[clamp(2.6rem,6vw,5.5rem)] font-light leading-none tracking-[-0.01em] text-ink"
          />
          <p className="meta-label hidden pb-2 md:block">Notes from the studio</p>
        </div>

        <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-8">
          <JournalCard
            entry={a}
            className="md:col-span-7"
            imageRatio="aspect-[16/11]"
            sizes="(min-width: 768px) 56vw, 100vw"
          />
          <JournalCard
            entry={b}
            className="md:col-span-5 md:mt-24"
            imageRatio="aspect-square"
            sizes="(min-width: 768px) 40vw, 100vw"
          />
          <JournalCard
            entry={c}
            className="md:col-span-7 md:col-start-3 md:-mt-2 lg:-mt-6"
            imageRatio="aspect-[16/11]"
            sizes="(min-width: 768px) 56vw, 100vw"
          />
        </div>
      </div>
    </section>
  )
}

function JournalCard({
  entry,
  className,
  imageRatio,
  sizes,
}: {
  entry: JournalEntry
  className?: string
  imageRatio: string
  sizes?: string
}) {
  return (
    <article className={cn('group', className)}>
      <Link href={`/journal/${entry.slug}`} className="block">
        <div className={cn('relative overflow-hidden', imageRatio)}>
          <JournalImage src={entry.hero.src} alt={entry.hero.alt} sizes={sizes} />
        </div>
        <div className="mt-6 flex items-center gap-4">
          <p className="font-sans text-[10px] font-light uppercase tracking-[var(--tracking-meta)] text-stone">
            {entry.category}
          </p>
          <span aria-hidden className="font-display text-xs italic text-stone">
            ·
          </span>
          <p className="font-sans text-[10px] font-light uppercase tracking-[var(--tracking-meta)] text-stone">
            {entry.date}
          </p>
        </div>
        <h3 className="mt-3 flex items-baseline gap-3 font-display text-[clamp(1.5rem,2.8vw,2.2rem)] font-light leading-[1.1] tracking-[-0.01em] text-ink">
          <span className="transition-transform duration-500 ease-out group-hover:translate-x-1">
            {entry.title}
          </span>
          <span
            aria-hidden
            className="inline-block text-stone transition-transform duration-500 ease-out group-hover:translate-x-1.5"
          >
            →
          </span>
        </h3>
      </Link>
    </article>
  )
}