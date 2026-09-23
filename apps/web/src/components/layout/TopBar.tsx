import { formatAddress, mapSearchUrl, phoneHref } from '@/lib/business'
import type { SiteSetting } from '@mighty-meats/shared/payload-types'

import styles from './TopBar.module.css'

export const TopBar = ({ settings }: { settings: SiteSetting }) => {
  const address = formatAddress(settings.address)
  const mapUrl = mapSearchUrl(settings.address)
  if (!address && !settings.phone) return null

  return (
    <div className={styles.topBar}>
      <div className={`container ${styles.inner}`}>
        {address && mapUrl && (
          <a href={mapUrl} target="_blank" rel="noopener noreferrer">
            {address}
          </a>
        )}
        {settings.phone && <a href={phoneHref(settings.phone)}>{settings.phone}</a>}
      </div>
    </div>
  )
}
