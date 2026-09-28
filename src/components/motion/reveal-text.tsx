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
 *
 * The masked offset is server-rendered, so a visitor without JavaScript (or
 * with a failed bundle) would see no heading at all. `globals.css` neutralises
 * the offset unless the document has been flagged as script-capable.
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
    <Tag className={className} id={id}>
      {/* The words are individually masked, so they are hidden from assistive
          tech and the sentence is exposed once as plain text. `aria-label`
          would be the obvious alternative but is prohibited on elements
          without a role, such as a <p>. */}
      <span className="sr-only">{text}</span>
      <span aria-hidden className="inline">
        {words.map((word, i) => (
          <span key={i} className="inline-block overflow-hidden pb-[0.12em] -mb-[0.12em]">
            <motion.span
              className="reveal-word inline-block will-change-transform"
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