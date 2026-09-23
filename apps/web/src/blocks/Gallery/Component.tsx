import { MediaImage } from '@/components/MediaImage'
import type { GalleryBlock as GalleryBlockData } from '@mighty-meats/shared/payload-types'

import styles from './Gallery.module.css'

export const GalleryBlock = ({ heading, images }: GalleryBlockData) => (
  <section className={`container ${styles.gallery}`}>
    {heading && <h2>{heading}</h2>}
    <div className={styles.grid}>
      {images.map((image) => (
        <MediaImage
          key={typeof image === 'object' ? image.id : image}
          media={image}
          sizes="(min-width: 768px) 33vw, 100vw"
        />
      ))}
    </div>
  </section>
)
