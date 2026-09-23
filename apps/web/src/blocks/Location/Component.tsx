import type { LocationBlock as LocationBlockData } from '@mighty-meats/shared/payload-types'

import { Reveal } from '@/components/motion/Reveal'
import { RevealText } from '@/components/motion/RevealText'
import { formatAddress, mapEmbedUrl, mapSearchUrl, phoneHref } from '@/lib/business'
import { getSiteSettings } from '@/lib/cms'

import styles from './Location.module.css'

/** Address, phone and map. Opening hours live in the footer, so they are not repeated here. */
export const LocationBlock = async ({ heading, showMap }: LocationBlockData) => {
  const settings = await getSiteSettings()
  const address = formatAddress(settings.address)
  const directionsUrl = mapSearchUrl(settings.address)
  const mapUrl = showMap ? mapEmbedUrl(settings.address) : null

  return (
    <section className={`container ${styles.location}`}>
      <div>
        {heading && <RevealText as="h2" className={styles.heading} text={heading} />}
        <Reveal delay={300}>
          {address && <p className={styles.address}>{address}</p>}
          {settings.phone && (
            <p>
              <a href={phoneHref(settings.phone)}>{settings.phone}</a>
            </p>
          )}
          {directionsUrl && (
            <a href={directionsUrl} className="button" target="_blank" rel="noopener noreferrer">
              Get directions
            </a>
          )}
        </Reveal>
      </div>
      {mapUrl && (
        <Reveal effect="slide-right" delay={200}>
          <iframe
            className={styles.map}
            src={mapUrl}
            title={`Map: ${address}`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </Reveal>
      )}
    </section>
  )
}
