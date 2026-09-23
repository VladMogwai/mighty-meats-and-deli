import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { HOME_SLUG } from '@mighty-meats/shared/constants'
import { buildPageMetadata } from '@/lib/metadata'
import { getPageBySlug, getSiteSettings } from '@/lib/cms'

import { PageView } from './PageView'

export async function generateMetadata(): Promise<Metadata> {
  const [page, settings] = await Promise.all([getPageBySlug(HOME_SLUG), getSiteSettings()])
  if (!page) return {}
  // The home page uses the plain site name, not the "%s | Site" template.
  return { ...buildPageMetadata(page, settings), title: { absolute: page.meta?.title || settings.siteName } }
}

export default async function HomePage() {
  const page = await getPageBySlug(HOME_SLUG)
  if (!page) notFound()
  return <PageView page={page} />
}
