import type { Media, Video } from '@mighty-meats/shared/payload-types'

import { mediaUrl } from '@/lib/media'

import { EmbeddedVideo } from './EmbeddedVideo'
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

  return video.url ? <EmbeddedVideo url={video.url} title={video.title} /> : null
}
