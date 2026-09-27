'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/cn'

const EASE = [0.16, 1, 0.3, 1] as const

/** Fallback when IntersectionObserver is unavailable: render statically visible. */
const noViewportAPI =
  typeof window !== 'undefined' && !('IntersectionObserver' in window)

type RevealTextProps = {
  text: string
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span'
  className?: string
  /** Fragment id, so the heading can be linked to and used to label a region. */
  id?: string
  delay?: number
  stagger?: number
  once?: boolean
}

/**
 * Editorial word-by-word masked reveal. Each word is hidden inside an
 * overflow-hidden mask and rises into place with a controlled ease.
 * Renders static markup when the visitor prefers reduced motion.
 */
export function RevealText({
  text,
  as: Tag = 'span',
  className,
  id,
  delay = 0,
  stagger = 0.06,
  once = true,
}: RevealTextProps) {
  const reduced = useReducedMotion()
  const words = text.split(' ')

  if (reduced || noViewportAPI) {
    return (
      <Tag className={className} id={id}>
        {text}
      </Tag>
    )
  }

  return (
    <Tag className={className} id={id} aria-label={text}>
      <span aria-hidden className="inline">
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em]">
            <motion.span
              className="inline-block will-change-transform"
              initial={{ y: '115%' }}
              whileInView={{ y: 0 }}
              viewport={{ once, margin: '0px 0px -12% 0px' }}
              transition={{ duration: 1, ease: EASE, delay: delay + i * stagger }}
            >
              {word}
            </motion.span>
            {i < words.length - 1 ? '\u00a0' : ''}
          </span>
        ))}
      </span>
    </Tag>
  )
}