import type { ProductCategory, ProductListBlock as ProductListBlockData } from '@mighty-meats/shared/payload-types'
import Link from 'next/link'

import { MediaImage } from '@/components/MediaImage'
import { RevealText } from '@/components/motion/RevealText'
import { getAvailableProducts } from '@/lib/cms'
import { categoryPath } from '@/lib/links'

import styles from './ProductList.module.css'

/** Category tiles; each opens the category page with its products. */
export const ProductListBlock = async ({ heading, intro, categories, note }: ProductListBlockData) => {
  const selected = categories.filter((category): category is ProductCategory => typeof category === 'object')
  const products = await getAvailableProducts(selected.map((category) => category.id).join(','))
  const countFor = (categoryId: number) =>
    products.filter((product) => (typeof product.category === 'object' ? product.category.id : product.category) === categoryId)
      .length

  return (
    <section className={`container ${styles.productList}`}>
      {heading && <RevealText as="h2" className={styles.heading} text={heading} />}
      {intro && <p className={styles.intro}>{intro}</p>}
      <ul className={styles.tiles}>
        {selected.map((category) => {
          const count = countFor(category.id)
          return (
            <li key={category.id}>
              <Link href={categoryPath(category.slug)} className={styles.tile}>
                <MediaImage media={category.image} sizes="(min-width: 900px) 33vw, 50vw" className={styles.image} />
                <span className={styles.label}>
                  <span className={styles.title}>{category.title}</span>
                  <span className={styles.count}>
                    {count} {count === 1 ? 'product' : 'products'}
                  </span>
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
      {note && <p className={styles.note}>{note}</p>}
    </section>
  )
}
