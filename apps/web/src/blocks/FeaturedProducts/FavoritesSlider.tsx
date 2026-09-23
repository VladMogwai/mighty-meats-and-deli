'use client'

import { COOKING_METHODS } from '@mighty-meats/shared/cooking'
import type { Product } from '@mighty-meats/shared/payload-types'
import { type PointerEvent, useRef, useState } from 'react'

import { CookingIcon } from '@/components/icons/CookingIcon'
import { MediaImage } from '@/components/MediaImage'
import { ProductActions } from '@/components/ProductActions'

import styles from './FeaturedProducts.module.css'

const SWIPE_THRESHOLD_PX = 50

const methodLabel = (value: string) =>
  COOKING_METHODS.find((method) => method.value === value)?.label ?? value

type Direction = 'next' | 'prev'

export const FavoritesSlider = ({ products }: { products: Product[] }) => {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState<Direction>('next')
  const swipeStartX = useRef<number | null>(null)

  const product = products[index]
  const hasMany = products.length > 1

  const go = (step: 1 | -1) => {
    setDirection(step === 1 ? 'next' : 'prev')
    setIndex((current) => (current + step + products.length) % products.length)
  }

  const handlePointerDown = (event: PointerEvent) => {
    swipeStartX.current = event.clientX
  }

  const handlePointerUp = (event: PointerEvent) => {
    if (swipeStartX.current === null) return
    const distance = event.clientX - swipeStartX.current
    swipeStartX.current = null
    if (Math.abs(distance) >= SWIPE_THRESHOLD_PX) go(distance < 0 ? 1 : -1)
  }

  return (
    <div
      className={styles.slider}
      role="region"
      aria-roledescription="carousel"
      aria-label="Customer favorites"
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
    >
      {/* key re-mounts the slide so its entrance animation replays */}
      <div
        key={product.id}
        className={styles.slide}
        data-direction={direction}
        role="group"
        aria-roledescription="slide"
        aria-label={`${index + 1} of ${products.length}`}
        aria-live="polite"
      >
        <div className={styles.details}>
          <h3 className={styles.name}>{product.name}</h3>
          {product.description && <p className={styles.description}>{product.description}</p>}
          {product.price && <p className={styles.price}>{product.price}</p>}
          <ProductActions
            video={product.video}
            link={product.link}
            className={styles.actions}
          />
        </div>

        <div className={styles.imageWrap}>
          <MediaImage media={product.image} sizes="(min-width: 900px) 40vw, 80vw" className={styles.image} />
        </div>

        {product.perfectFor && product.perfectFor.length > 0 && (
          <div className={styles.perfectFor}>
            <p className={styles.perfectForLabel}>Perfect for</p>
            <ul className={styles.methods}>
              {product.perfectFor.map((method) => (
                <li key={method}>
                  <CookingIcon method={method} className={styles.methodIcon} />
                  {methodLabel(method)}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {hasMany && (
        <div className={styles.controls}>
          <button type="button" className={styles.arrow} onClick={() => go(-1)} aria-label="Previous product">
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="M15 5 8 12l7 7" />
            </svg>
          </button>
          <button type="button" className={styles.arrow} onClick={() => go(1)} aria-label="Next product">
            <svg viewBox="0 0 24 24" aria-hidden>
              <path d="m9 5 7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </div>
  )
}
