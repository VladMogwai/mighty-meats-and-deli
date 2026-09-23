'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

/**
 * Marks `[data-reveal]` elements as revealed the first time they enter the viewport.
 * Re-scans on client-side navigation so new pages animate too.
 */
export const RevealObserver = (): null => {
  const pathname = usePathname()

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.setAttribute('data-revealed', 'true')
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    )

    document
      .querySelectorAll('[data-reveal]:not([data-revealed])')
      .forEach((element) => observer.observe(element))

    return () => observer.disconnect()
  }, [pathname])

  return null
}

