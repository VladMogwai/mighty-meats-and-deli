import type { ShortsBlock as ShortsBlockData, Video } from '@mighty-meats/shared/payload-types'

import { Reveal } from '@/components/motion/Reveal'
import { getSiteSettings } from '@/lib/cms'
import { getChannelVideos } from '@/lib/youtube'

import { itemsFromChannel, itemsFromVideos } from './items'
import styles from './Shorts.module.css'
import { ShortsShelf } from './ShortsShelf'

/**
 * "Ideas" shelf of vertical videos. Shows the latest YouTube channel videos when the
 * block source is "youtube" and the channel has any; otherwise the videos picked in the CMS.
 */
export const ShortsBlock = async ({ eyebrow, heading, intro, source, youtubeLimit, videos }: ShortsBlockData) => {
  const picked = itemsFromVideos((videos ?? []).filter((video): video is Video => typeof video === 'object'))

  let items = picked
  if (source === 'youtube') {
    const settings = await getSiteSettings()
    const channelItems = itemsFromChannel(await getChannelVideos(settings.youtubeChannel, youtubeLimit ?? 10))
    if (channelItems.length > 0) items = channelItems
  }
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
        <ShortsShelf items={items} />
      </div>
    </section>
  )
}
