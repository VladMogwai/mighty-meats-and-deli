import type { Media, Page, ProductCategory } from '@mighty-meats/shared/payload-types'
import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { RevealText } from '@/components/motion/RevealText'
import { ProductGrid } from '@/components/products/ProductGrid'
import { getAllCategories, getAllPages, getAvailableProducts, getCategoryBySlug, getSiteSettings } from '@/lib/cms'
import { categoryPath, pagePath } from '@/lib/links'
import { mediaUrl } from '@/lib/media'

import styles from './CategoryPage.module.css'

type Props = { params: Promise<{ category: string }> }

export const dynamicParams = false

export async function generateStaticParams() {
  const categories = await getAllCategories()
  return categories.map((category) => ({ category: category.slug }))
}

/** The CMS page whose product list shows this category — the "back" link target. */
const findParentPage = (pages: Page[], category: ProductCategory): Page | undefined =>
  pages.find((page) =>
    page.layout?.some(
      (block) =>
        block.blockType === 'productList' &&
        block.categories.some((item) => (typeof item === 'object' ? item.id : item) === category.id),
    ),
  )

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category: slug } = await params
  const [category, settings] = await Promise.all([getCategoryBySlug(slug), getSiteSettings()])
  if (!category) return {}

  const description =
    category.description || `${category.title} from ${settings.siteName}, a family-run butcher shop in Winnipeg.`
  const image = typeof category.image === 'object' && category.image?.url ? mediaUrl(category.image.url) : undefined

  return {
    title: category.title,
    description,
    alternates: { canonical: categoryPath(category.slug) },
    openGraph: {
      title: category.title,
      description,
      url: categoryPath(category.slug),
      images: image ? [{ url: image }] : undefined,
    },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { category: slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) notFound()

  const [products, pages] = await Promise.all([getAvailableProducts(String(category.id)), getAllPages()])
  const parent = findParentPage(pages, category)

  return (
    <article className={`container ${styles.page}`}>
      <Link href={parent ? pagePath(parent.slug) : '/products'} className={styles.back}>
        ← {parent?.title ?? 'Products'}
      </Link>
      <RevealText as="h1" className={styles.heading} text={category.title} />
      {category.description && <p className={styles.description}>{category.description}</p>}
      <ProductGrid products={products} fallbackImage={category.image as Media | null} />
    </article>
  )
}
