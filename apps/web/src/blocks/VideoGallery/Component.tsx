import { VideoPlayer } from '@/components/VideoPlayer'
import type { VideoGalleryBlock as VideoGalleryBlockData } from '@mighty-meats/shared/payload-types'

import styles from './VideoGallery.module.css'

export const VideoGalleryBlock = ({ heading, videos }: VideoGalleryBlockData) => (
  <section className={`container ${styles.videos}`}>
    {heading && <h2>{heading}</h2>}
    <div className={styles.grid}>
      {videos.map((video) =>
        typeof video === 'object' ? (
          <figure key={video.id} className={styles.item}>
            <VideoPlayer video={video} />
            <figcaption>{video.title}</figcaption>
          </figure>
        ) : null,
      )}
    </div>
  </section>
)
