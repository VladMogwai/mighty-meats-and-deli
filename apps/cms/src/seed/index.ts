/**
 * Creates the site structure mirrored from the reference site: pages, menu and categories.
 * No real content — only placeholders. Safe to run repeatedly: existing slugs are skipped.
 *
 *   pnpm seed
 */
import config from '@payload-config'
import { getPayload, type Payload } from 'payload'

import type { Page } from '@mighty-meats/shared/payload-types'

import { paragraphs } from './richText'

type PageLayout = NonNullable<Page['layout']>

const findIdBySlug = async (
  payload: Payload,
  collection: 'pages' | 'product-categories',
  slug: string,
): Promise<number | null> => {
  const { docs } = await payload.find({ collection, where: { slug: { equals: slug } }, limit: 1 })
  return docs[0]?.id ?? null
}

const ensureCategory = async (payload: Payload, title: string, slug: string, sortOrder: number) => {
  const existing = await findIdBySlug(payload, 'product-categories', slug)
  if (existing) return existing
  const created = await payload.create({
    collection: 'product-categories',
    data: { title, slug, sortOrder },
  })
  return created.id
}

const ensurePage = async (payload: Payload, title: string, slug: string, layout: PageLayout) => {
  const existing = await findIdBySlug(payload, 'pages', slug)
  if (existing) {
    payload.logger.info(`Page "${slug}" exists, skipped`)
    return existing
  }
  const created = await payload.create({ collection: 'pages', data: { title, slug, layout } })
  payload.logger.info(`Page "${slug}" created`)
  return created.id
}

const seed = async () => {
  const payload = await getPayload({ config })

  const inHouseId = await ensureCategory(payload, 'In-house products', 'in-house', 10)
  const bulkPacksId = await ensureCategory(payload, 'Freezer & Bulk Packs', 'freezer-bulk-packs', 20)

  const pages = [
    {
      title: 'Home',
      slug: 'home',
      layout: [
        { blockType: 'hero', heading: 'Welcome' },
        {
          blockType: 'content',
          eyebrow: 'Hi there!',
          heading: 'Your family butcher.',
          content: paragraphs('Welcome text coming soon.'),
        },
        {
          blockType: 'steps',
          eyebrow: 'About us',
          heading: 'Why our meat is different',
          steps: [1, 2, 3].map((number) => ({
            title: `Reason ${number}`,
            text: 'Text coming soon.',
          })),
        },
        { blockType: 'testimonials', heading: 'What our customers say' },
        { blockType: 'location', heading: 'Find us', showMap: true },
      ],
    },
    {
      title: 'About',
      slug: 'about',
      layout: [{ blockType: 'content', content: paragraphs('About us — text coming soon.') }],
    },
    {
      title: 'Products',
      slug: 'products',
      layout: [
        {
          blockType: 'productList',
          intro: 'We offer a wide variety of in-house prepared products and meats.',
          categories: [inHouseId],
        },
        { blockType: 'partnerList', heading: 'Local artisan goods' },
      ],
    },
    {
      title: 'Freezer & Bulk Packs',
      slug: 'freezer-bulk-packs',
      layout: [
        {
          blockType: 'productList',
          categories: [bulkPacksId],
          note: 'Please allow 24 hours notice for all orders.',
        },
      ],
    },
    {
      title: 'Contact',
      slug: 'contact',
      layout: [
        {
          blockType: 'contactForm',
          intro: 'Ask us any questions or place an order. Please provide 24 hours notice.',
        },
        { blockType: 'location', heading: 'Location', showMap: true },
      ],
    },
  ] satisfies { title: string; slug: string; layout: PageLayout }[]

  const pageIds: Record<string, number> = {}
  for (const page of pages) {
    pageIds[page.slug] = await ensurePage(payload, page.title, page.slug, page.layout)
  }

  const navigation = await payload.findGlobal({ slug: 'navigation' })
  if (!navigation.mainMenu?.length) {
    await payload.updateGlobal({
      slug: 'navigation',
      data: {
        mainMenu: pages.map((page) => ({
          link: { label: page.title, type: 'page' as const, page: pageIds[page.slug] },
        })),
      },
    })
    payload.logger.info('Navigation created')
  }

  const settings = await payload.findGlobal({ slug: 'site-settings' })
  if (!settings.siteName) {
    await payload.updateGlobal({ slug: 'site-settings', data: { siteName: 'Mighty Meats and Deli' } })
    payload.logger.info('Site settings created')
  }

  payload.logger.info('Seed finished')
  process.exit(0)
}

await seed()
