'use client'

import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * Page transition.
 *
 * App Router remounts `template.tsx` on every navigation, so a single fade on
 * mount gives each route a deliberate entrance instead of a hard cut. Kept to
 * one property and one short duration: the brief asks for motion that supports
 * the photography rather than competing with it, and a full cross-fade on a
 * site this image-heavy reads as a slideshow.
 *
 * Renders statically when the visitor prefers reduced motion, and the
 * initial state is opacity-only so it never contributes to layout shift.
 */
export default function Template({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      initial={reduced ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}
