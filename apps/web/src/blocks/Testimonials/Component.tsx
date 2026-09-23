import { getAllTestimonials } from '@/lib/cms'
import type { Testimonial, TestimonialsBlock as TestimonialsBlockData } from '@mighty-meats/shared/payload-types'

import styles from './Testimonials.module.css'

export const TestimonialsBlock = async ({ heading, testimonials }: TestimonialsBlockData) => {
  const selected =
    testimonials?.filter((item): item is Testimonial => typeof item === 'object') ?? []
  const items = selected.length > 0 ? selected : await getAllTestimonials()
  if (items.length === 0) return null

  return (
    <section className={`container ${styles.testimonials}`}>
      {heading && <h2>{heading}</h2>}
      <div className={styles.grid}>
        {items.map((item) => (
          <figure key={item.id} className={styles.item}>
            <blockquote>{item.quote}</blockquote>
            <figcaption>— {item.author}</figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}
