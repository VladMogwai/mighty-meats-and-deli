/**
 * Fills the CMS with the content of the original mightymeatsanddeli.com (text only).
 * Replaces the whole catalog (products, categories, partners), the site settings
 * and the layouts of the five main pages. Navigation and media are left untouched.
 *
 *   pnpm import:original
 */
import config from '@payload-config'
import { HOME_SLUG } from '@mighty-meats/shared/constants'
import type { Page } from '@mighty-meats/shared/payload-types'
import { getPayload, type Payload } from 'payload'

import {
  aboutText,
  business,
  type CategoryContent,
  featuredProductNames,
  freezerCategories,
  inHouseCategories,
  partners,
} from './originalContent'
import { paragraphs } from './richText'

type PageLayout = NonNullable<Page['layout']>
type PageContent = {
  title: string
  /** SEO title; defaults to the page title */
  metaTitle?: string
  slug: string
  description: string
  layout: PageLayout
}

const clearCollection = async (payload: Payload, collection: 'products' | 'product-categories' | 'partners') => {
  const { docs } = await payload.delete({ collection, where: { id: { exists: true } } })
  payload.logger.info(`Removed ${docs.length} ${collection}`)
}

/** Creates categories with their products; returns category ids and product ids by name. */
const createCatalog = async (payload: Payload, categories: CategoryContent[], sortOffset: number) => {
  const categoryIds: number[] = []
  const productIds = new Map<string, number>()

  for (const [index, category] of categories.entries()) {
    const created = await payload.create({
      collection: 'product-categories',
      data: {
        title: category.title,
        slug: category.slug,
        description: category.description,
        sortOrder: sortOffset + index,
      },
    })
    categoryIds.push(created.id)

    for (const product of category.products) {
      const createdProduct = await payload.create({
        collection: 'products',
        data: { ...product, category: created.id, isAvailable: true },
      })
      productIds.set(product.name, createdProduct.id)
    }
  }
  return { categoryIds, productIds }
}

const upsertPage = async (payload: Payload, { title, metaTitle, slug, description, layout }: PageContent) => {
  const { docs } = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, limit: 1 })
  const data = { title, slug, layout, meta: { title: metaTitle ?? title, description } }

  if (docs[0]) await payload.update({ collection: 'pages', id: docs[0].id, data })
  else await payload.create({ collection: 'pages', data })
  payload.logger.info(`Page "${slug}" imported`)
}

const pageIdBySlug = async (payload: Payload, slug: string) => {
  const { docs } = await payload.find({ collection: 'pages', where: { slug: { equals: slug } }, limit: 1 })
  return docs[0]?.id
}

const importOriginal = async () => {
  const payload = await getPayload({ config })

  await payload.updateGlobal({ slug: 'site-settings', data: business })
  payload.logger.info('Site settings imported')

  await clearCollection(payload, 'products')
  await clearCollection(payload, 'product-categories')
  await clearCollection(payload, 'partners')

  const inHouse = await createCatalog(payload, inHouseCategories, 0)
  const freezer = await createCatalog(payload, freezerCategories, 100)
  for (const partner of partners) {
    await payload.create({ collection: 'partners', data: partner })
  }
  payload.logger.info(
    `Catalog imported: ${inHouse.productIds.size + freezer.productIds.size} products, ${partners.length} partners`,
  )

  // Pages must exist before the home page can link to them
  const pages: PageContent[] = [
    {
      title: 'About',
      slug: 'about',
      description: aboutText.slice(0, 155),
      layout: [
        {
          blockType: 'content',
          eyebrow: 'Family-run since day one',
          heading: 'About us',
          content: paragraphs(aboutText),
        },
      ],
    },
    {
      title: 'Products',
      slug: 'products',
      description: 'In-house prepared meats, sausages, jerky, deli meats and ready meals, plus local artisan goods.',
      layout: [
        {
          blockType: 'productList',
          heading: 'In-house products',
          intro: 'We offer a wide variety of in-house prepared products and meats. This includes (but is not limited to):',
          categories: inHouse.categoryIds,
        },
        { blockType: 'partnerList', heading: 'We also offer many local artisan goods' },
      ],
    },
    {
      title: 'Freezer & Bulk Packs',
      slug: 'freezer-bulk-packs',
      description: 'Freezer packs, bulk meat, meat trays and wild game processing. Please allow 24 hours notice for all orders.',
      layout: [
        {
          blockType: 'productList',
          intro: 'Please allow 24 hours notice for ALL orders!',
          categories: freezer.categoryIds,
          note: 'Prices are subject to change without notice.',
        },
      ],
    },
    {
      title: 'Contact',
      slug: 'contact',
      description: 'Ask us any questions or place an order. Please provide 24 hours notice for orders.',
      layout: [
        {
          blockType: 'contactForm',
          heading: 'Get in touch',
          intro: 'Feel free to ask us any questions or place an order! Please provide 24 hours notice for orders.',
        },
        { blockType: 'location', heading: 'Location', showMap: true },
      ],
    },
  ]
  for (const page of pages) await upsertPage(payload, page)

  const [productsPageId, freezerPageId] = await Promise.all([
    pageIdBySlug(payload, 'products'),
    pageIdBySlug(payload, 'freezer-bulk-packs'),
  ])

  await upsertPage(payload, {
    title: 'Home',
    metaTitle: `${business.siteName} — Butcher Shop in Charleswood, Winnipeg`,
    slug: HOME_SLUG,
    description: business.tagline + '. AAA Certified Angus Beef, local pork and chicken, artisan products from Manitoba.',
    layout: [
      {
        blockType: 'hero',
        eyebrow: 'Charleswood, Winnipeg',
        heading: 'Welcome to Mighty Meats & Deli',
        text: 'A dedicated family-run shop with locally sourced meats and artisan products from all across Manitoba.',
        callToAction: [
          { link: { label: 'Our products', type: 'page', page: productsPageId } },
          { link: { label: 'Freezer & bulk packs', type: 'page', page: freezerPageId } },
        ],
      },
      {
        blockType: 'content',
        eyebrow: 'Hi there!',
        heading: 'Your family butcher in Charleswood.',
        content: paragraphs(aboutText),
      },
      {
        blockType: 'steps',
        eyebrow: 'Why Mighty Meats',
        heading: 'What makes us different',
        steps: [
          {
            title: 'AAA Certified Angus Beef.',
            text: 'We carry AAA quality Certified Angus Beef, together with locally sourced pork and chicken.',
          },
          {
            title: 'Artisan goods from across Manitoba.',
            text: 'Next to our own products you will find cheese, mustard, honey, oils and baked goods from local Manitoba producers.',
          },
          {
            title: 'Made in-house, allergy friendly.',
            text: 'All in-store made products are naturally made and allergy friendly. We are a lactose free, gluten free and diabetic friendly environment.',
          },
        ],
      },
      {
        blockType: 'featuredProducts',
        heading: 'Customer favorites',
        intro: 'Stock up your freezer. Please allow 24 hours notice for all orders.',
        products: featuredProductNames.map((name) => freezer.productIds.get(name)).filter(Boolean),
      },
      { blockType: 'testimonials', heading: 'What our customers say' },
      { blockType: 'location', heading: 'Find us', showMap: true },
    ],
  })

  payload.logger.info('Import finished')
  process.exit(0)
}

await importOriginal()
