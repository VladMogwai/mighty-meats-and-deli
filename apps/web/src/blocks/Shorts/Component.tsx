import type { ShortsBlock as ShortsBlockData, Video } from '@mighty-meats/shared/payload-types'

import { Reveal } from '@/components/motion/Reveal'

import styles from './Shorts.module.css'
import { ShortsShelf } from './ShortsShelf'

/** YouTube-Shorts-style shelf of vertical videos; a card opens a full-screen vertical player. */
export const ShortsBlock = ({ eyebrow, heading, intro, videos }: ShortsBlockData) => {
  const items = videos.filter((video): video is Video => typeof video === 'object')
  if (items.length === 0) return null

  return (
    <section className={styles.shorts}>
      <div className="container">
        <header className={styles.header}>
          <svg className={styles.icon} viewBox="0 0 24 24" aria-hidden>
            <rect x="3" y="2" width="18" height="20" rx="6" />
            <path d="M10 8.5v7l5.5-3.5z" />
          </svg>
          <div>
            {eyebrow && <span className="eyebrow">{eyebrow}</span>}
            <h2 className={styles.heading}>{heading || 'Ideas'}</h2>
          </div>
        </header>
        {intro && (
          <Reveal>
            <p className={styles.intro}>{intro}</p>
          </Reveal>
        )}
        <ShortsShelf videos={items} />
      </div>
    </section>
  )
}
