import { MediaImage } from '@/components/MediaImage'
import { getAvailableProducts } from '@/lib/cms'
import type { ProductCategory, ProductListBlock as ProductListBlockData } from '@mighty-meats/shared/payload-types'

import styles from './ProductList.module.css'

export const ProductListBlock = async ({ heading, intro, categories, note }: ProductListBlockData) => {
  const selected = categories.filter(
    (category): category is ProductCategory => typeof category === 'object',
  )
  const products = await getAvailableProducts(selected.map((category) => category.id).join(','))

  return (
    <section className={`container ${styles.productList}`}>
      {heading && <h2>{heading}</h2>}
      {intro && <p>{intro}</p>}
      {selected.map((category) => {
        const items = products.filter(
          (product) =>
            (typeof product.category === 'object' ? product.category.id : product.category) === category.id,
        )
        if (items.length === 0) return null
        return (
          <div key={category.id} className={styles.category}>
            <h3>{category.title}</h3>
            {category.description && <p>{category.description}</p>}
            <ul className={styles.grid}>
              {items.map((product) => (
                <li key={product.id} className={styles.card}>
                  <MediaImage media={product.image} sizes="(min-width: 768px) 25vw, 50vw" />
                  <h4>{product.name}</h4>
                  {product.description && <p>{product.description}</p>}
                  {product.price && <p className={styles.price}>{product.price}</p>}
                </li>
              ))}
            </ul>
          </div>
        )
      })}
      {note && <p className={styles.note}>{note}</p>}
    </section>
  )
}
