'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { site } from '@/data/config'
import { navLinks } from '@/data/site'
import { cn } from '@/lib/cn'

export function Navigation() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const reduced = useReducedMotion()

  const subpage = pathname !== '/'
  const solid = subpage || scrolled || open

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 420)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const closeMenu = useCallback(() => setOpen(false), [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Close the menu if the viewport grows to desktop width — the hamburger
  // disappears with the `md:hidden` class and a trapped dialog would orphan.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)')
    const onChange = () => {
      if (mq.matches) setOpen(false)
    }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return (
    <>
      <motion.header
        initial={reduced ? false : { y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-colors duration-500',
          solid
            ? 'border-b border-ink/10 bg-chalk/90 text-ink backdrop-blur-md'
            : 'border-b border-transparent bg-transparent text-chalk',
        )}
      >
        <div className="flex items-center justify-between px-6 py-5 md:px-10">
          <Link href="/" className="wordmark tracking-[0.28em]">
            citgroup&nbsp;&amp; VALE
          </Link>

          <nav aria-label="Primary" className="hidden items-center gap-9 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="group relative text-[11px] font-normal uppercase tracking-[var(--tracking-meta)]"
              >
                {link.label}
                <span
                  aria-hidden
                  className="absolute -bottom-1 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-500 ease-out group-hover:scale-x-100"
                />
              </Link>
            ))}
          </nav>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            className="flex h-10 w-10 items-center justify-center md:hidden"
          >
            <div className="relative block h-3 w-6">
              <span
                className={cn(
                  'absolute left-0 top-0 h-px w-full bg-current transition-all duration-500 ease-out',
                  open && 'top-1/2 rotate-45',
                )}
              />
              <span
                className={cn(
                  'absolute bottom-0 left-0 h-px w-full bg-current transition-all duration-500 ease-out',
                  open && 'bottom-auto top-1/2 -rotate-45',
                )}
              />
            </div>
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {open && <MobileMenu onClose={closeMenu} />}
      </AnimatePresence>
    </>
  )
}

function MobileMenu({ onClose }: { onClose: () => void }) {
  const reduced = useReducedMotion()
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const panel = panelRef.current
    if (!panel) return
    const previousFocus = document.activeElement as HTMLElement | null
    const focusables = Array.from(
      panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
    )
    focusables[0]?.focus()

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key !== 'Tab' || focusables.length === 0) return
      const first = focusables[0]
      const last = focusables[focusables.length - 1]
      const active = document.activeElement as HTMLElement | null
      if (e.shiftKey && (active === first || !panel.contains(active))) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && (active === last || !panel.contains(active))) {
        e.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown, true)
    return () => {
      document.removeEventListener('keydown', onKeyDown, true)
      previousFocus?.focus()
    }
  }, [onClose])

  return (
    <motion.div
      key="menu"
      ref={panelRef}
      className="fixed inset-0 z-40 flex flex-col overflow-y-auto bg-chalk text-ink"
      initial={reduced ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
      animate={reduced ? { opacity: 1 } : { clipPath: 'inset(0 0 0% 0)' }}
      exit={reduced ? { opacity: 0 } : { clipPath: 'inset(0 0 100% 0)' }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      id="mobile-menu"
    >
      <nav aria-label="Mobile" className="flex flex-1 flex-col">
        <div className="my-auto px-8">
        {navLinks.map((link, i) => (
          <motion.div
            key={link.label}
            initial={reduced ? false : { y: 32, opacity: 0 }}
            animate={reduced ? false : { y: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-baseline gap-4 border-b border-ink/10 py-5 last:border-b-0"
          >
            <span className="font-sans text-[10px] font-light tracking-[var(--tracking-meta)] text-stone">
              0{i + 1}
            </span>
            <Link
              href={link.href}
              onClick={onClose}
              className="font-display text-4xl font-light leading-none tracking-tight"
            >
              {link.label}
            </Link>
          </motion.div>
        ))}
        </div>
      </nav>

      <motion.div
        initial={reduced ? false : { opacity: 0 }}
        animate={reduced ? false : { opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
        className="px-8 pb-12 text-[11px] uppercase tracking-[var(--tracking-meta)] text-stone"
      >
        <p>{site.address.street}</p>
        <p>{site.address.lines[1]}</p>
        <p className="mt-3">
          <a href={`tel:${site.phone.tel}`}>{site.phone.display}</a>
        </p>
        <p>
          <a href={`mailto:${site.email}`}>{site.email}</a>
        </p>
      </motion.div>
    </motion.div>
  )
}