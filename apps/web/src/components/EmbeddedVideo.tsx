import { parseVideoUrl } from '@mighty-meats/shared/video'

import styles from './VideoPlayer.module.css'

/** Player for a YouTube / Vimeo / TikTok / Instagram / Facebook link; renders nothing for unsupported links. */
export const EmbeddedVideo = ({ url, title }: { url: string; title: string }) => {
  const parsed = parseVideoUrl(url)
  if (!parsed) return null

  return (
    <div className={parsed.isVertical ? styles.vertical : styles.landscape}>
      <iframe
        className={styles.frame}
        src={parsed.embedUrl}
        title={title}
        loading="lazy"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  )
}
