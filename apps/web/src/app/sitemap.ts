import type { MetadataRoute } from 'next'

import { getAllCategories, getAllPages } from '@/lib/cms'
import { categoryPath, pagePath } from '@/lib/links'
import { getSiteUrl } from '@/lib/siteUrl'

export const dynamic = 'force-static'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [pages, categories] = await Promise.all([getAllPages(), getAllCategories()])
  return [
    ...pages.map(({ slug, updatedAt }) => ({ url: `${getSiteUrl()}${pagePath(slug)}`, lastModified: updatedAt })),
    ...categories.map(({ slug, updatedAt }) => ({
      url: `${getSiteUrl()}${categoryPath(slug)}`,
      lastModified: updatedAt,
    })),
  ]
}
