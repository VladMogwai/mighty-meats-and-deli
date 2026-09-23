import type { MetadataRoute } from 'next'

import { pagePath } from '@/lib/links'
import { getAllPages } from '@/lib/cms'
import { getSiteUrl } from '@/lib/siteUrl'

export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const pages = await getAllPages()
  return pages.map(({ slug, updatedAt }) => ({
    url: `${getSiteUrl()}${pagePath(slug)}`,
    lastModified: updatedAt,
  }))
}
