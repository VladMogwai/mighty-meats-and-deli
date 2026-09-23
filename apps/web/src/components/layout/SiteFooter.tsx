import Link from 'next/link'

import { formatAddress, groupedSchedule, mapSearchUrl, phoneHref } from '@/lib/business'
import { resolveLinkHref } from '@/lib/links'
import type { Navigation, SiteSetting } from '@mighty-meats/shared/payload-types'

import styles from './SiteFooter.module.css'

type Props = { settings: SiteSetting; navigation: Navigation }

export const SiteFooter = ({ settings, navigation }: Props) => {
  const address = formatAddress(settings.address)
  const mapUrl = mapSearchUrl(settings.address)
  const schedule = groupedSchedule(settings.openingHours)

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <section>
          <h2 className={styles.heading}>Visit us</h2>
          <address className={styles.address}>
            {address && mapUrl && (
              <a href={mapUrl} target="_blank" rel="noopener noreferrer">
                {address}
              </a>
            )}
            {settings.phone && <a href={phoneHref(settings.phone)}>{settings.phone}</a>}
            {settings.email && <a href={`mailto:${settings.email}`}>{settings.email}</a>}
          </address>
        </section>

        <section>
          <h2 className={styles.heading}>Hours</h2>
          <dl className={styles.hours}>
            {schedule.map(({ days, hours }) => (
              <div key={days}>
                <dt>{days}</dt>
                <dd>{hours ?? 'Closed'}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section>
          <h2 className={styles.heading}>Explore</h2>
          <ul className={styles.list}>
            {(navigation.mainMenu ?? []).map(({ id, link }) => {
              const href = resolveLinkHref(link)
              return href ? (
                <li key={id}>
                  <Link href={href}>{link.label}</Link>
                </li>
              ) : null
            })}
          </ul>
          {settings.socialLinks && settings.socialLinks.length > 0 && (
            <ul className={styles.list} aria-label="Social media">
              {settings.socialLinks.map((social) => (
                <li key={social.id}>
                  <a href={social.url} target="_blank" rel="noopener noreferrer">
                    {social.platform}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
      <p className={`container ${styles.copyright}`}>
        © {new Date().getFullYear()} {settings.siteName}
      </p>
    </footer>
  )
}
