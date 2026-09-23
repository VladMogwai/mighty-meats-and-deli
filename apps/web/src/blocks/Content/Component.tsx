import { RichText } from '@payloadcms/richtext-lexical/react'

import { MediaImage } from '@/components/MediaImage'
import { Reveal } from '@/components/motion/Reveal'
import { RevealText } from '@/components/motion/RevealText'
import type { ContentBlock as ContentBlockData } from '@mighty-meats/shared/payload-types'

import styles from './Content.module.css'

export const ContentBlock = ({ eyebrow, heading, content, image }: ContentBlockData) => (
  <section className={`container ${styles.content}`} data-has-image={Boolean(image)}>
    {image && (
      <Reveal effect="slide-left" className={styles.media}>
        <MediaImage media={image} sizes="(min-width: 768px) 50vw, 100vw" />
      </Reveal>
    )}
    <div>
      {eyebrow && <RevealText as="span" className="eyebrow" text={eyebrow} />}
      {heading && <RevealText as="h2" className={styles.heading} text={heading} delay={150} />}
      <Reveal delay={400}>
        <RichText data={content} className="prose" />
      </Reveal>
    </div>
  </section>
)
