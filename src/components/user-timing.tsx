'use client'

import { useEffect } from 'react'

export function UserTiming() {
  useEffect(() => {
    // Navigation start (approximate)
    performance.mark('navigation-start')

    // Hero image load timing (approximate, based on resource timing)
    const heroImg = document.querySelector('img[src*="hero-homepage"]')
    if (heroImg) {
      heroImg.addEventListener('load', () => {
        performance.mark('hero-image-loaded')
        performance.measure('lcp-approx', 'navigation-start', 'hero-image-loaded')
      }, { once: true })
    }

    // Measure after a short delay to capture initial render
    const timer = setTimeout(() => {
      performance.mark('navigation-complete')
      try {
        performance.measure('page-load-time', 'navigation-start', 'navigation-complete')
      } catch {
        // Ignore duplicate measure errors
      }
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return null
}
