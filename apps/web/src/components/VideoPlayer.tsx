import { parseVideoUrl } from '@mighty-meats/shared/video'
import type { Media, Video } from '@mighty-meats/shared/payload-types'

import { mediaUrl } from '@/lib/media'

import styles from './VideoPlayer.module.css'

const asMedia = (value: Media | number | null | undefined): Media | null =>
  value && typeof value === 'object' ? value : null

export const VideoPlayer = ({ video }: { video: Video }) => {
  if (video.source === 'upload') {
    const file = asMedia(video.file)
    if (!file?.url) return null
    return (
      <video
        className={styles.frame}
        src={mediaUrl(file.url)}
        poster={asMedia(video.poster)?.url ? mediaUrl(asMedia(video.poster).url) : undefined}
        controls
        preload="metadata"
        playsInline
      />
    )
  }

  const parsed = video.url ? parseVideoUrl(video.url) : null
  if (!parsed) return null

  return (
    <div className={parsed.isVertical ? styles.vertical : styles.landscape}>
      <iframe
        className={styles.frame}
        src={parsed.embedUrl}
        title={video.title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  )
}
