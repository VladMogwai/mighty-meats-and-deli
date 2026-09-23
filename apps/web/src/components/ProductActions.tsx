'use client'

import type { Product } from '@mighty-meats/shared/payload-types'
import { useId, useState } from 'react'

import styles from './ProductActions.module.css'
import { VideoPlayer } from './VideoPlayer'

type Props = Pick<Product, 'video' | 'link'> & { className?: string }

/** "Watch video" (opens the player in place) and an optional link button for a product. */
export const ProductActions = ({ video, link, className }: Props) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const videoId = useId()
  // The video relation is only usable when populated (depth ≥ 1)
  const playable = video && typeof video === 'object' ? video : null
  const hasLink = Boolean(link?.url)
  if (!playable && !hasLink) return null

  return (
    <div className={className}>
      <div className={styles.buttons}>
        {playable && (
          <button
            type="button"
            className={`button ${styles.button}`}
            aria-expanded={isVideoOpen}
            aria-controls={videoId}
            onClick={() => setIsVideoOpen((open) => !open)}
          >
            {isVideoOpen ? 'Hide video' : 'Watch video'}
          </button>
        )}
        {hasLink && (
          <a href={link.url} className={`button ${styles.button}`} target="_blank" rel="noopener noreferrer">
            {link.label || 'Learn more'}
          </a>
        )}
      </div>
      {playable && isVideoOpen && (
        <div id={videoId} className={styles.video}>
          <VideoPlayer video={playable} />
        </div>
      )}
    </div>
  )
}
