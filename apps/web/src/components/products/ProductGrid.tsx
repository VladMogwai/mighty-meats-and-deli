'use client'

import type { Media, Product } from '@mighty-meats/shared/payload-types'
import { useId, useMemo, useState } from 'react'

import { MediaImage } from '@/components/MediaImage'

import styles from './ProductGrid.module.css'

const SORT_OPTIONS = {
  name: { label: 'Name: A–Z', compare: (a: Product, b: Product) => a.name.localeCompare(b.name) },
  'name-desc': { label: 'Name: Z–A', compare: (a: Product, b: Product) => b.name.localeCompare(a.name) },
  price: { label: 'Price: low to high', compare: (a: Product, b: Product) => comparePrice(a, b, 1) },
  'price-desc': { label: 'Price: high to low', compare: (a: Product, b: Product) => comparePrice(a, b, -1) },
} as const

type SortKey = keyof typeof SORT_OPTIONS

/** First number in a free-text price ("$7.49/lb", "From $120") — null when there is none. */
const priceValue = (price: string | null | undefined): number | null => {
  const match = price?.replace(/,/g, '').match(/\d+(\.\d+)?/)
  return match ? Number(match[0]) : null
}

/** Products without a price always go last. */
const comparePrice = (a: Product, b: Product, direction: 1 | -1) => {
  const [left, right] = [priceValue(a.price), priceValue(b.price)]
  if (left === null && right === null) return a.name.localeCompare(b.name)
  if (left === null) return 1
  if (right === null) return -1
  return (left - right) * direction
}

type Props = {
  products: Product[]
  /** Shown for products that have no photo of their own. */
  fallbackImage: Media | null
}

export const ProductGrid = ({ products, fallbackImage }: Props) => {
  const [sort, setSort] = useState<SortKey>('name')
  const sortId = useId()
  const sorted = useMemo(() => [...products].sort(SORT_OPTIONS[sort].compare), [products, sort])

  return (
    <>
      <div className={styles.toolbar}>
        <p className={styles.total}>Total products {products.length}</p>
        <label htmlFor={sortId} className={styles.sort}>
          Sort by
          <select id={sortId} value={sort} onChange={(event) => setSort(event.target.value as SortKey)}>
            {Object.entries(SORT_OPTIONS).map(([value, { label }]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <ul className={styles.grid}>
        {sorted.map((product) => (
          <li key={product.id} className={styles.card}>
            <div className={styles.imageWrap}>
              <MediaImage
                media={product.image || fallbackImage}
                sizes="(min-width: 1100px) 25vw, (min-width: 640px) 50vw, 100vw"
                className={styles.image}
              />
            </div>
            <div className={styles.body}>
              <h2 className={styles.name}>{product.name}</h2>
              {product.description && <p className={styles.description}>{product.description}</p>}
              {product.price && <p className={styles.price}>{product.price}</p>}
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}
