'use client'

import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { baseSrc, srcSetFor } from '@/lib/responsive-image'

type HeroBackdropProps = {
  /** Resolved hero path, normally the `-lg` (largest) AVIF variant. */
  src: string
  /** Describes the photograph. */
  alt: string
  /** Subtle vertical drift as the hero scrolls away. Ignored for reduced motion. */
  amount?: number
  className?: string
  /** Extra CSS on the image layer, e.g. a focal point. */
  style?: React.CSSProperties
}

/**
 * How much to oversize the image layer, as a percentage of the hero, so a
 * vertical drift of `amount` can never expose an edge.
 *
 * The drift is a percentage of the *image layer's own height*, not the hero's,
 * so the buffer has to be solved for rather than chosen. With `b` as the buffer,
 * the layer is `(100 + 2b)%` tall and drifts by `amount * (100 + 2b)%`; needing
 * the buffer to cover that gives `b >= 100 * amount / (1 - 2 * amount)`.
 *
 * A fixed 8% buffer satisfied this for the 0.07 and 0.08 banners but not the
 * homepage hero at 0.16, which left 74px of flat background along the bottom
 * edge on first paint.
 */
function oversizeFor(amount: number): number {
  return 100 * amount / Math.max(0.01, 1 - 2 * amount)
}

/**
 * The photographic field behind a hero banner.
 *
 * This is an `<img>`, not a CSS background, and the distinction is load-bearing.
 * A background was tried first and it was a dead end for two reasons:
 *
 *  1. `background-image: image-set(...), url(base)` declares two layers. CSS
 *     composites every layer, so the browser fetches the `image-set` candidate
 *     *and* the `url()` one — the "fallback for browsers without image-set()"
 *     cost a second full-size download on every browser that had the feature.
 *  2. `image-set()` only accepts resolution descriptors, so a full-bleed hero
 *     is sized on device pixel ratio alone and ignores its own width. A phone
 *     at DPR 2.6 pulled the 330 KB large variant to paint a 412px frame.
 *
 * An `<img srcset sizes="100vw">` selects on width, fetches exactly one file,
 * and is the element LCP is actually attributed to. The candidate list is the
 * same `srcSetFor` the hero preload uses, so the two cannot diverge.
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
  const buffer = oversizeFor(amount)

  return (
    <div ref={ref} className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <motion.img
        src={baseSrc(src)}
        srcSet={srcSetFor(src)}
        sizes="100vw"
        alt={alt}
        decoding="async"
        fetchPriority="high"
        className="absolute left-0 right-0 w-full object-cover"
        style={{
          top: `${-buffer}%`,
          height: `${100 + buffer * 2}%`,
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
