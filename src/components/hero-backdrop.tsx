'use client'

import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'

type HeroBackdropProps = {
  /** Resolved hero path, normally the `-lg` (2000px) AVIF variant. */
  src: string
  /**
   * Describes the photograph. A CSS background is invisible to assistive
   * tech, so it is surfaced explicitly via `role="img"` + `aria-label`
   * rather than being dropped.
   */
  alt: string
  /** Subtle vertical drift as the hero scrolls away. Ignored for reduced motion. */
  amount?: number
  className?: string
  /** Extra CSS on the image layer, e.g. a focal point. */
  style?: React.CSSProperties
}

/**
 * The photographic field behind a hero banner, painted as a CSS background
 * rather than an `<img>`.
 *
 * Two candidates are offered through `image-set()`: the 1200px base at 1x and
 * the 2000px `-lg` variant at 2x, with the base also declared as a plain
 * `url()` layer beneath it. Browsers without `image-set()` drop the first
 * layer and fall back to the base file rather than showing nothing.
 *
 * The layer is deliberately larger than its frame (`inset-[-8%_0]`) so the
 * parallax drift never exposes an edge.
 */
export function HeroBackdrop({
  src,
  alt,
  amount = 0.08,
  className = '',
  style,
}: HeroBackdropProps) {
  const ref = useRef<HTMLDivElement>(null)
  const reduced = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  const y = useTransform(scrollYProgress, [0, 1], [`-${amount * 100}%`, `${amount * 100}%`])

  const base = src.replace(/-lg\.(avif|webp|jpe?g|png)$/i, '.$1')
  const imageSet = `image-set(url("${base}") type("image/avif") 1x, url("${src}") type("image/avif") 2x)`

  return (
    <div ref={ref} className={`absolute inset-0 overflow-hidden ${className}`}>
      <motion.div
        role="img"
        aria-label={alt}
        className="absolute inset-[-8%_0]"
        style={{
          backgroundImage: `${imageSet}, url("${base}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          ...(reduced ? undefined : { y }),
          ...style,
        }}
      />
    </div>
  )
}

/**
 * Legibility scrim for hero banners: a flat darkening so overlaid text stays
 * readable anywhere on the frame, deepening toward the edge that carries the
 * text. This is a functional overlay, not decoration — it is what allows chalk
 * type to hold its contrast over photography.
 */
export function HeroScrim({
  direction = 'to top',
  stops = 'rgba(10,9,7,0.82) 0%, rgba(10,9,7,0.58) 34%, rgba(10,9,7,0.34) 66%, rgba(10,9,7,0.38) 100%',
  opacity = 1,
}: {
  direction?: string
  stops?: string
  opacity?: number
}) {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0"
      style={{
        background: `linear-gradient(${direction}, ${stops})`,
        opacity,
      }}
    />
  )
}
