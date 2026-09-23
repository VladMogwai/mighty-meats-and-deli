import type { SiteSetting } from '@mighty-meats/shared/payload-types'

import { mediaUrl } from './media'
import { getSiteUrl } from './siteUrl'

/** schema.org ButcherShop — lets search engines show address, hours and phone in results. */
export const buildBusinessJsonLd = (settings: SiteSetting) => {
  const { address } = settings
  const logo = typeof settings.logo === 'object' && settings.logo?.url

  return {
    '@context': 'https://schema.org',
    '@type': 'ButcherShop',
    name: settings.siteName,
    description: settings.tagline || undefined,
    url: getSiteUrl(),
    logo: logo ? mediaUrl(logo) : undefined,
    telephone: settings.phone || undefined,
    email: settings.email || undefined,
    address: address?.street
      ? {
          '@type': 'PostalAddress',
          streetAddress: address.street,
          addressLocality: address.city || undefined,
          addressRegion: address.region || undefined,
          postalCode: address.postalCode || undefined,
          addressCountry: address.country || undefined,
        }
      : undefined,
    openingHoursSpecification: settings.openingHours?.map((slot) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: slot.days,
      opens: slot.opens,
      closes: slot.closes,
    })),
    sameAs: settings.socialLinks?.map((social) => social.url),
  }
}
