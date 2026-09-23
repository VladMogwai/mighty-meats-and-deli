import type { CSSProperties, ElementType } from 'react'

type Props = {
  text: string
  as?: ElementType
  className?: string
  /** Delay before the first letter starts, ms. */
  delay?: number
}

/**
 * Text whose letters rise into place one by one when scrolled into view.
 * Screen readers get the whole string via aria-label; the letter spans are hidden from them.
 */
export const RevealText = ({ text, as: Tag = 'span', className, delay = 0 }: Props) => {
  let letterIndex = 0

  return (
    <Tag
      className={className}
      aria-label={text}
      data-reveal="letters"
      style={{ '--reveal-delay': `${delay}ms` } as CSSProperties}
    >
      {text.split(/(\s+)/).map((word, wordIndex) =>
        /^\s+$/.test(word) ? (
          ' '
        ) : (
          <span key={wordIndex} className="reveal-word" aria-hidden>
            {[...word].map((letter) => (
              <span
                key={letterIndex}
                className="reveal-letter"
                style={{ '--letter-index': letterIndex++ } as CSSProperties}
              >
                {letter}
              </span>
            ))}
          </span>
        ),
      )}
    </Tag>
  )
}
