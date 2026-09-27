'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/cn'

/**
 * Subtle floating enquiry element. Appears after the visitor begins scrolling;
 * collapses to a pill on mobile. Anchors to the contact section.
 */
export function FloatingCta() {
  const [visible, setVisible] = useState(false)
  const [overContact, setOverContact] = useState(false)
  const reduced = useReducedMotion()

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })

    // Vanish once the contact section (which the CTA anchors to) is on screen,
    // so it never sits on top of the form or footer.
    const target = document.getElementById('contact')
    let observer: IntersectionObserver | undefined
    if (target && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => setOverContact(entries.some((e) => e.isIntersecting)),
        { rootMargin: '0px 0px -15% 0px' },
      )
      observer.observe(target)
    }
    return () => {
      window.removeEventListener('scroll', onScroll)
      observer?.disconnect()
    }
  }, [])

  const show = visible && !overContact

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 16 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="fixed z-30 bottom-5 left-1/2 -translate-x-1/2 md:bottom-8 md:right-8 md:left-auto md:translate-x-0"
        >
          <Link
            href="/#contact"
            className={cn(
              'group flex items-center gap-2.5 border backdrop-blur-md transition-colors duration-500',
              'border-ink/20 bg-chalk/80 px-5 py-3 text-ink hover:bg-ink hover:text-chalk',
            )}
          >
            <span className="font-sans text-[10px] font-normal uppercase tracking-[var(--tracking-meta)]">
              Start a Project
            </span>
            <ArrowUpRight
              size={13}
              strokeWidth={1.5}
              className="transition-transform duration-500 ease-out group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  )
}