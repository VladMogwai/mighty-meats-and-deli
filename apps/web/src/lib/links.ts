import { HOME_SLUG } from '@mighty-meats/shared/constants'
import type { Navigation, Page } from '@mighty-meats/shared/payload-types'

export type CmsLink = NonNullable<Navigation['mainMenu']>[number]['link']

export const pagePath = (slug: string): string => (slug === HOME_SLUG ? '/' : `/${slug}`)

export const resolveLinkHref = (link: CmsLink): string | null => {
  if (link.type === 'custom') return link.url || null
  const page = link.page as Page | number | null | undefined
  return page && typeof page === 'object' ? pagePath(page.slug) : null
}
