import { MediaImage } from '@/components/MediaImage'
import { getAllPartners } from '@/lib/cms'
import type { Partner, PartnerListBlock as PartnerListBlockData } from '@mighty-meats/shared/payload-types'

import styles from './PartnerList.module.css'

export const PartnerListBlock = async ({ heading, partners }: PartnerListBlockData) => {
  const selected = partners?.filter((partner): partner is Partner => typeof partner === 'object') ?? []
  const items = selected.length > 0 ? selected : await getAllPartners()
  if (items.length === 0) return null

  return (
    <section className={`container ${styles.partnerList}`}>
      {heading && <h2>{heading}</h2>}
      <ul className={styles.grid}>
        {items.map((partner) => (
          <li key={partner.id}>
            <MediaImage media={partner.logo} sizes="160px" className={styles.logo} />
            {partner.website ? (
              <a href={partner.website} target="_blank" rel="noopener noreferrer">
                {partner.name}
              </a>
            ) : (
              partner.name
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
