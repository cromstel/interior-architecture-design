'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'

/**
 * Site-global "back to top" control. Appears after the visitor begins to
 * scroll, positioned in the corner opposite the floating enquiry pill so the
 * two never collide, and withdraws while the contact section is on screen so
 * it never covers the form. Smooth scrolling is delegated to the CSS
 * `scroll-behavior` on <html> (globals.css), which is disabled for people who
 * prefer reduced motion.
 */
export function BackToTop() {
  const [visible, setVisible] = useState(false)
  const [overContact, setOverContact] = useState(false)
  const reduced = useReducedMotion()
  const pathname = usePathname()

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Re-observe on route change: the layout persists across navigations, so
  // without this the observer would keep watching a detached #contact node
  // and the button would stay visible over the form after a home round-trip.
  useEffect(() => {
    const contact = document.getElementById('contact')
    if (!contact) return
    const io =
      'IntersectionObserver' in window
        ? new IntersectionObserver(([entry]) => setOverContact(entry.isIntersecting), {
            threshold: 0.08,
          })
        : null
    io?.observe(contact)
    return () => io?.disconnect()
  }, [pathname])

  return (
    <AnimatePresence>
      {visible && !overContact && (
        <motion.div
          initial={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduced ? { opacity: 0 } : { opacity: 0, y: 14 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-5 right-5 z-30 print:hidden md:bottom-8 md:left-8 md:right-auto"
        >
          <button
            type="button"
            aria-label="Back to top"
            title="Back to top"
            onClick={() => window.scrollTo({ top: 0, left: 0, behavior: 'auto' })}
            className="group flex h-11 w-11 items-center justify-center rounded-full border border-ink/20 bg-chalk/80 text-ink backdrop-blur-md transition-colors duration-500 hover:bg-ink hover:text-chalk"
          >
            <ArrowUp
              size={15}
              strokeWidth={1.5}
              className="transition-transform duration-500 ease-out group-hover:-translate-y-0.5"
            />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}