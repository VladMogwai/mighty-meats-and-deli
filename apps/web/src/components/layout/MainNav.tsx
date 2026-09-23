'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import styles from './SiteHeader.module.css'

export type NavItem = { href: string; label: string; newTab: boolean }

export const MainNav = ({ items }: { items: NavItem[] }) => {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className={styles.nav} aria-label="Main">
      <button
        type="button"
        className={styles.menuToggle}
        aria-expanded={isOpen}
        aria-controls="main-menu"
        onClick={() => setIsOpen((open) => !open)}
      >
        {isOpen ? 'Close' : 'Menu'}
      </button>
      <ul id="main-menu" className={styles.menu} data-open={isOpen}>
        {items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={pathname === item.href ? 'page' : undefined}
              onClick={() => setIsOpen(false)}
              {...(item.newTab ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
