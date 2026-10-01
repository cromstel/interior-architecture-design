'use client'

import { useEffect, useState } from 'react'

/**
 * True when `IntersectionObserver` is unavailable, resolved after mount.
 *
 * The capability check has to stay out of the first render. The server always
 * evaluates `typeof window` as `'undefined'`, and the first client render runs
 * before any effect, so branching on the check during that render would make
 * the two disagree and produce a hydration mismatch on the very markup the
 * guard is meant to protect.
 *
 * Starting at `false` means the first paint matches the server: the animated
 * markup is what both sides emit. Browsers in this project's support matrix
 * (Chrome/Edge/Firefox 111+, Safari 16.4+) all have `IntersectionObserver`, so
 * the fallback below effectively never fires — but a crawler or a locked-down
 * client that lacks it gets the plain text after mount instead of heading text
 * that never animates into view.
 */
export function useLacksViewportAPI(): boolean {
  const [lacks, setLacks] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setLacks(true)
    }
  }, [])

  return lacks
}
