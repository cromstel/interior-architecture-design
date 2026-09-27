'use client'

import { useScroll, useMotionValueEvent, useReducedMotion } from 'framer-motion'
import { useState } from 'react'

export function ProgressBar() {
  const { scrollYProgress } = useScroll()
  const reduced = useReducedMotion()
  const [progress, setProgress] = useState(0)

  useMotionValueEvent(scrollYProgress, 'change', (latest) => {
    setProgress(latest)
  })

  return (
    <div
      className="fixed top-0 left-0 z-[60] w-full h-[2px] pointer-events-none"
      aria-hidden="true"
    >
      <div
        className="h-full bg-ink/80"
        style={{
          width: `${progress * 100}%`,
          // No transition under reduced motion so the bar tracks scroll exactly.
          transition: reduced ? 'none' : 'width 0.15s ease-out',
        }}
      />
    </div>
  )
}
