'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { cn } from '@/lib/cn'

type AnimatedRuleProps = {
  className?: string
  delay?: number
}

/** A hairline divider that draws itself on scroll. */
export function AnimatedRule({ className, delay = 0 }: AnimatedRuleProps) {
  const reduced = useReducedMotion()

  if (reduced) {
    return <div className={cn('h-px w-full bg-current opacity-20', className)} aria-hidden />
  }

  return (
    <motion.div
      aria-hidden
      className={cn('h-px w-full origin-left bg-current opacity-20', className)}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true, amount: 0.9 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay }}
    />
  )
}