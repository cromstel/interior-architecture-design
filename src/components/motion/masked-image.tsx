'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { ratioClass } from '@/lib/ratios'

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
  // Coarse responsive source: pair the base (1200px) file with the `-lg`
  // (2400px) variant when one is in use, so phones never download the giant copy.
  const baseSrc = src.replace(/-lg\.(jpe?g|png|webp|avif)$/, '.$1')
  const srcSet = src !== baseSrc ? `${baseSrc} 1200w, ${src} 2000w` : undefined

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