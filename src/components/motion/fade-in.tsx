'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/cn'
import { useLacksViewportAPI } from '@/components/motion/use-lacks-viewport-api'

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * Fallback when IntersectionObserver is unavailable: render statically visible.
 *
 * The capability check is deferred to an effect by `useLacksViewportAPI` rather
 * than cached at module scope. See that hook for why branching on it during the
 * first render would itself cause a hydration mismatch.
 */

type FadeInProps = {
  children: React.ReactNode
  className?: string
  delay?: number
  y?: number
  duration?: number
  amount?: number
}

export function FadeIn({
  children,
  className,
  delay = 0,
  y = 28,
  duration = 1,
  amount = 0.3,
}: FadeInProps) {
  const reduced = useReducedMotion()
  const noAPI = useLacksViewportAPI()

  if (reduced || noAPI) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={cn('will-change-transform', className)}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount }}
      transition={{ duration, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  )
}