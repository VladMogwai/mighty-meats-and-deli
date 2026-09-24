import Link from 'next/link'

import { MediaImage } from '@/components/MediaImage'
import { resolveLinkHref } from '@/lib/links'
import type { Navigation, SiteSetting } from '@mighty-meats/shared/payload-types'

import { MainNav, type NavItem } from './MainNav'
import styles from './SiteHeader.module.css'
import { SocialLinks } from './SocialLinks'

type Props = { settings: SiteSetting; navigation: Navigation }

export const SiteHeader = ({ settings, navigation }: Props) => {
  const items: NavItem[] = (navigation.mainMenu ?? []).flatMap(({ link }) => {
    const href = resolveLinkHref(link)
    return href ? [{ href, label: link.label, newTab: Boolean(link.newTab) }] : []
  })

  return (
    <header className={styles.header}>
      <div className={`container ${styles.inner}`}>
        <Link href="/" className={styles.brand}>
          {settings.logo ? (
            <MediaImage media={settings.logo} sizes="200px" priority className={styles.logo} />
          ) : (
            settings.siteName
          )}
        </Link>
        <div className={styles.end}>
          <MainNav items={items} />
          <SocialLinks links={settings.socialLinks} className={styles.social} />
        </div>
      </div>
    </header>
  )
}
