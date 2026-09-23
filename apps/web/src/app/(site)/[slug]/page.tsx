import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { HOME_SLUG } from '@mighty-meats/shared/constants'
import { buildPageMetadata } from '@/lib/metadata'
import { getAllPages, getPageBySlug, getSiteSettings } from '@/lib/cms'

import { PageView } from '../PageView'

type Props = { params: Promise<{ slug: string }> }

// Static export: every page is known at build time; anything else is a 404
export const dynamicParams = false

export async function generateStaticParams() {
  const pages = await getAllPages()
  return pages.filter((page) => page.slug !== HOME_SLUG).map((page) => ({ slug: page.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const [page, settings] = await Promise.all([getPageBySlug(slug), getSiteSettings()])
  return page ? buildPageMetadata(page, settings) : {}
}

export default async function CmsPage({ params }: Props) {
  const { slug } = await params
  const page = await getPageBySlug(slug)
  if (!page) notFound()
  return <PageView page={page} />
}
