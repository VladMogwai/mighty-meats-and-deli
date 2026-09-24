import type { SiteSetting } from '@mighty-meats/shared/payload-types'
import type { ReactNode } from 'react'

import styles from './SocialLinks.module.css'

type Platform = NonNullable<SiteSetting['socialLinks']>[number]['platform']

const LABELS: Record<Platform, string> = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  youtube: 'YouTube',
  tiktok: 'TikTok',
  x: 'X',
}

/** Simple 24×24 line icons drawn with currentColor. */
const ICONS: Record<Platform, ReactNode> = {
  facebook: <path d="M14 8h3V4h-3a4 4 0 0 0-4 4v2H7v4h3v7h4v-7h3l1-4h-4V8.5a.5.5 0 0 1 .5-.5Z" />,
  instagram: (
    <>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.75" fill="currentColor" />
    </>
  ),
  youtube: (
    <>
      <rect x="2.5" y="5" width="19" height="14" rx="4" />
      <path d="m10 9 5 3-5 3Z" fill="currentColor" />
    </>
  ),
  tiktok: <path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5M14 3c.5 2.5 2.5 4.5 5 4.5" />,
  x: <path d="m4 4 16 16M20 4 4 20" />,
}

type Props = { links: SiteSetting['socialLinks']; className?: string }

export const SocialLinks = ({ links, className }: Props) => {
  if (!links?.length) return null

  return (
    <ul className={`${styles.list} ${className ?? ''}`}>
      {links.map((link) => (
        <li key={link.id ?? link.platform}>
          <a
            href={link.url}
            className={styles.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${LABELS[link.platform]} (opens in a new tab)`}
          >
            <svg
              viewBox="0 0 24 24"
              width="22"
              height="22"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden
            >
              {ICONS[link.platform]}
            </svg>
          </a>
        </li>
      ))}
    </ul>
  )
}
