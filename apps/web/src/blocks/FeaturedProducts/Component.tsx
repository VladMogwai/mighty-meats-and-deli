import type {
  FeaturedProductsBlock as FeaturedProductsBlockData,
  Product,
} from '@mighty-meats/shared/payload-types'

import { Reveal } from '@/components/motion/Reveal'
import { RevealText } from '@/components/motion/RevealText'

import styles from './FeaturedProducts.module.css'
import { FavoritesSlider } from './FavoritesSlider'

/** "Customer favorites" — one product per slide. */
export const FeaturedProductsBlock = ({ heading, intro, products }: FeaturedProductsBlockData) => {
  const items = products.filter(
    (product): product is Product => typeof product === 'object' && product.isAvailable !== false,
  )
  if (items.length === 0) return null

  return (
    <section className={styles.section}>
      <div className="container">
        <header className={styles.header}>
          {heading && <RevealText as="h2" className={styles.heading} text={heading} />}
          {intro && (
            <Reveal delay={300}>
              <p className={styles.intro}>{intro}</p>
            </Reveal>
          )}
          <Reveal effect="draw-x" delay={500} className={styles.divider} />
        </header>
        <FavoritesSlider products={items} />
      </div>
    </section>
  )
}
