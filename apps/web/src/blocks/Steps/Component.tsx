import type { StepsBlock as StepsBlockData } from '@mighty-meats/shared/payload-types'

import { MediaImage } from '@/components/MediaImage'
import { Reveal } from '@/components/motion/Reveal'
import { RevealText } from '@/components/motion/RevealText'

import styles from './Steps.module.css'

/** Curve from under one step's text to the next step, drawn as the visitor scrolls. */
const Connector = ({ mirrored }: { mirrored: boolean }) => (
  <div className={styles.connector} data-mirrored={mirrored} data-reveal="draw" aria-hidden>
    <svg viewBox="0 0 600 200" preserveAspectRatio="none">
      <path className={styles.connectorPath} d="M10 5 C 40 150, 150 190, 590 190" />
    </svg>
  </div>
)

export const StepsBlock = ({ eyebrow, heading, intro, steps }: StepsBlockData) => (
  <section className={`container ${styles.steps}`}>
    {(eyebrow || heading || intro) && (
      <header className={styles.header}>
        {eyebrow && <RevealText as="span" className="eyebrow" text={eyebrow} />}
        {heading && <RevealText as="h2" className={styles.heading} text={heading} delay={150} />}
        {intro && (
          <Reveal delay={400}>
            <p>{intro}</p>
          </Reveal>
        )}
      </header>
    )}

    <ol className={styles.list}>
      {steps.map((step, index) => {
        const isEven = index % 2 === 1
        const isLast = index === steps.length - 1

        return (
          <li key={step.id ?? index} className={styles.step} data-even={isEven} data-has-image={Boolean(step.image)}>
            <div className={styles.copy}>
              <Reveal effect="zoom" className={styles.number}>
                <span aria-hidden>{index + 1}</span>
              </Reveal>
              <RevealText as="h3" className={styles.title} text={step.title} delay={200} />
              <Reveal delay={450}>
                <p className={styles.text}>{step.text}</p>
              </Reveal>
            </div>

            {step.image && (
              <Reveal effect={isEven ? 'slide-left' : 'slide-right'} delay={200} className={styles.media}>
                <MediaImage media={step.image} sizes="(min-width: 768px) 50vw, 100vw" />
              </Reveal>
            )}

            {!isLast && <Connector mirrored={isEven} />}
          </li>
        )
      })}
    </ol>
  </section>
)
