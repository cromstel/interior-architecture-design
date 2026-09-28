'use client'

import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { cn } from '@/lib/cn'
import { ratioClass } from '@/lib/ratios'

type ParallaxImageProps = {
  src: string
  alt: string
  ratio?: string
  className?: string
  amount?: number
  priority?: boolean
  sizes?: string
}

/**
 * Subtle parallax image wrapper (±6%). The inner image translates against
 * the crop while scrolling. Static when reduced motion is preferred.
 */
export function ParallaxImage({
  src,
  alt,
  ratio,
  className,
  amount = 0.08,
  priority = false,
  sizes = '100vw',
}: ParallaxImageProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [`-${amount * 100}%`, `${amount * 100}%`])
  // Coarse responsive source: pair the base (1200px) file with the `-lg`
  // (2400px) variant when one is in use, so phones never download the giant copy.
  const baseSrc = src.replace(/-lg\.(jpe?g|png|webp|avif)$/, '.$1')
  const srcSet = src !== baseSrc ? `${baseSrc} 1200w, ${src} 2000w` : undefined

  return (
    <div
      ref={ref}
      className={cn('relative overflow-hidden', ratio ? ratioClass(ratio) : '', className)}
    >
      <motion.div style={reduced ? undefined : { y }} className="absolute inset-[-14%_0]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          srcSet={srcSet}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          fetchPriority={priority ? 'high' : 'auto'}
          decoding="async"
          sizes={sizes}
          className="block h-full w-full object-cover"
        />
      </motion.div>
    </div>
  )
}