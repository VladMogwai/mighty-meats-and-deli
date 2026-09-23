import Image from 'next/image'

import type { Media } from '@mighty-meats/shared/payload-types'

import { mediaUrl } from '@/lib/media'

type Props = {
  media: Media | number | null | undefined
  sizes?: string
  priority?: boolean
  className?: string
}

/**
 * Renders an image from the Media collection.
 * Images are served as uploaded (static site, no image optimisation server).
 */
export const MediaImage = ({ media, sizes = '100vw', priority, className }: Props) => {
  if (!media || typeof media !== 'object' || !media.url || !media.mimeType?.startsWith('image/')) {
    return null
  }

  return (
    <Image
      src={mediaUrl(media.url)}
      alt={media.alt}
      width={media.width ?? 1200}
      height={media.height ?? 800}
      sizes={sizes}
      priority={priority}
      className={className}
    />
  )
}
