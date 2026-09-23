const trimSlash = (url: string) => url.replace(/\/$/, '')

/** Public origin of this site. Used for canonical URLs, Open Graph and the sitemap. */
export const getSiteUrl = (): string =>
  trimSlash(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')

/** CMS origin as seen from the browser (contact form, locally stored media). */
export const getPublicCmsUrl = (): string =>
  trimSlash(process.env.NEXT_PUBLIC_CMS_URL || 'http://localhost:3001')
