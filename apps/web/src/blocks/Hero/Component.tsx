import { CmsLink } from '@/components/CmsLink'
import { MediaImage } from '@/components/MediaImage'
import { Reveal } from '@/components/motion/Reveal'
import { RevealText } from '@/components/motion/RevealText'
import type { HeroBlock as HeroBlockData, Media } from '@mighty-meats/shared/payload-types'
import type { CSSProperties } from 'react'

import { mediaUrl } from '@/lib/media'

import styles from './Hero.module.css'

const asMedia = (value: Media | number | null | undefined): Media | null =>
  value && typeof value === 'object' && value.url ? value : null

export const HeroBlock = ({
  eyebrow,
  heading,
  text,
  images,
  backgroundVideo,
  backgroundPoster,
  callToAction,
  isFirst,
}: HeroBlockData & { isFirst: boolean }) => {
  const HeadingTag = isFirst ? 'h1' : 'h2'
  const hasImages = Boolean(images && images.length > 0)
  const video = asMedia(backgroundVideo)
  const poster = asMedia(backgroundPoster)

  return (
    <section
      className={styles.hero}
      data-has-video={Boolean(video)}
      style={poster ? ({ '--hero-poster': `url(${mediaUrl(poster.url)})` } as CSSProperties) : undefined}
    >
      {video && (
        // Decorative: muted, looping, hidden from screen readers
        <video
          className={styles.backgroundVideo}
          src={mediaUrl(video.url)}
          poster={poster ? mediaUrl(poster.url) : undefined}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          aria-hidden
        />
      )}
      <div className={`container ${styles.inner}`} data-has-image={hasImages}>
        <div className={styles.copy}>
          {eyebrow && <RevealText as="span" className="eyebrow" text={eyebrow} />}
          <RevealText as={HeadingTag} className={styles.heading} text={heading} delay={200} />
          {text && (
            <Reveal delay={600}>
              <p className={styles.text}>{text}</p>
            </Reveal>
          )}
          {callToAction && callToAction.length > 0 && (
            <Reveal delay={800} className={styles.actions}>
              {callToAction.map(({ id, link }) => (
                <CmsLink key={id} link={link} className="button" />
              ))}
            </Reveal>
          )}
        </div>

        {hasImages && (
          <Reveal effect="slide-right" delay={300} className={styles.slides}>
            {images!.map((image, index) => (
              <div key={typeof image === 'object' ? image.id : image} className={styles.slide}>
                <MediaImage
                  media={image}
                  sizes="(min-width: 900px) 50vw, 100vw"
                  priority={isFirst && index === 0}
                />
              </div>
            ))}
          </Reveal>
        )}
      </div>
    </section>
  )
}
