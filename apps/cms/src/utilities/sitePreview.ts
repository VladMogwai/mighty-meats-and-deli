import { HOME_SLUG } from '@mighty-meats/shared/constants'
import type { GeneratePreviewURL } from 'payload'

import { env } from '../env'

/** "Preview" button in the editor opens the published page on the website. */
export const pagePreview: GeneratePreviewURL = (doc) =>
  doc?.slug === HOME_SLUG ? env.webUrl : `${env.webUrl}/${doc?.slug ?? ''}`

export const categoryPreview: GeneratePreviewURL = (doc) =>
  doc?.slug ? `${env.webUrl}/products/${doc.slug}` : null

/** Products have no page of their own; they are shown on their category page. */
export const productPreview: GeneratePreviewURL = async (doc, { req }) => {
  const category = doc?.category as number | { slug?: string } | undefined
  if (!category) return null
  const slug =
    typeof category === 'object'
      ? category.slug
      : (await req.payload.findByID({ collection: 'product-categories', id: category, depth: 0, req })).slug
  return slug ? `${env.webUrl}/products/${slug}` : null
}
