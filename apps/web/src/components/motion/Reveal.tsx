import type { CSSProperties, ElementType, ReactNode } from 'react'

export type RevealEffect = 'fade-up' | 'slide-left' | 'slide-right' | 'zoom' | 'draw-x'

type Props = {
  children?: ReactNode
  effect?: RevealEffect
  /** ms */
  delay?: number
  as?: ElementType
  className?: string
}

/** Fades/slides its content in when scrolled into view. */
export const Reveal = ({ children, effect = 'fade-up', delay = 0, as: Tag = 'div', className }: Props) => (
  <Tag
    className={className}
    data-reveal={effect}
    style={delay ? ({ '--reveal-delay': `${delay}ms` } as CSSProperties) : undefined}
  >
    {children}
  </Tag>
)
