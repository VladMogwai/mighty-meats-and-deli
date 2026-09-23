import type { Metadata } from 'next'

import type { Media, Page, SiteSetting } from '@mighty-meats/shared/payload-types'

import { pagePath } from './links'
import { mediaUrl } from './media'

const imageUrl = (media: Media | number | null | undefined): string | undefined =>
  media && typeof media === 'object' && media.url ? mediaUrl(media.url) : undefined

export const buildPageMetadata = (page: Page, settings: SiteSetting): Metadata => {
  const title = page.meta?.title || page.title
  const description = page.meta?.description || settings.tagline || undefined
  const image = imageUrl(page.meta?.image) ?? imageUrl(settings.defaultOgImage)
  const path = pagePath(page.slug)

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: 'website',
      siteName: settings.siteName,
      title,
      description,
      url: path,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? 'summary_large_image' : 'summary',
      title,
      description,
      images: image ? [image] : undefined,
    },
  }
}
