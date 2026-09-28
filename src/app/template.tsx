'use client'

import type { ReactNode } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

const EASE = [0.16, 1, 0.3, 1] as const

/**
 * Page transition.
 *
 * App Router remounts `template.tsx` on every navigation, so a single entrance
 * on mount gives each route a deliberate arrival instead of a hard cut. Kept to
 * one property and one short duration: the brief asks for motion that supports
 * the photography rather than competing with it, and a full cross-fade on a
 * site this image-heavy reads as a slideshow.
 *
 * The entrance is a small vertical rise rather than a fade. An `opacity: 0`
 * initial state is written into the server HTML, which made the entire page —
 * hero included — invisible until hydration finished, then held it invisible
 * for the length of the fade. A rise keeps the arrival feeling while leaving
 * the first paint intact, and like an opacity change it causes no reflow.
 *
 * Renders statically when the visitor prefers reduced motion.
 */
export default function Template({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion()

  return (
    <motion.div
      initial={reduced ? false : { y: 10 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.45, ease: EASE }}
    >
      {children}
    </motion.div>
  )
}
