import { CmsLink } from '@/components/CmsLink'
import { MediaImage } from '@/components/MediaImage'
import { Reveal } from '@/components/motion/Reveal'
import { RevealText } from '@/components/motion/RevealText'
import type { HeroBlock as HeroBlockData } from '@mighty-meats/shared/payload-types'

import styles from './Hero.module.css'

export const HeroBlock = ({
  eyebrow,
  heading,
  text,
  images,
  callToAction,
  isFirst,
}: HeroBlockData & { isFirst: boolean }) => {
  const HeadingTag = isFirst ? 'h1' : 'h2'
  const hasImages = Boolean(images && images.length > 0)

  return (
    <section className={styles.hero}>
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
