'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { ratioClass } from '@/lib/ratios'
import { srcSetFor } from '@/lib/responsive-image'

const EASE = [0.16, 1, 0.3, 1] as const

type MaskedImageProps = {
  src: string
  alt: string
  ratio?: string
  className?: string
  imgClassName?: string
  priority?: boolean
  sizes?: string
  eager?: boolean
}

/**
 * Slow masked image reveal: the image enters masked from below while gently
 * de-zooming into place. Respects prefers-reduced-motion.
 */
export function MaskedImage({
  src,
  alt,
  ratio,
  className,
  imgClassName,
  priority = false,
  sizes = '100vw',
  eager = false,
}: MaskedImageProps) {
  const reduced = useReducedMotion()
  // Three candidates (800w / 1200w / 2000w) so a handset never pulls a
  // desktop-sized photograph for a small editorial crop.
  const srcSet = srcSetFor(src)

  return (
    <div className={cn('relative overflow-hidden', ratio ? ratioClass(ratio) : '', className)}>
      <motion.img
        src={src}
        srcSet={srcSet}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : 'auto'}
        decoding="async"
        sizes={sizes}
        className={cn('block h-full w-full object-cover will-change-transform', imgClassName)}
        initial={reduced ? false : { y: '10%', scale: 1.12, opacity: 1 }}
        whileInView={reduced ? undefined : { y: 0, scale: 1, opacity: 1 }}
        viewport={{ once: true, amount: 0.25 }}
        transition={{ duration: 1.2, ease: EASE }}
      />
    </div>
  )
}