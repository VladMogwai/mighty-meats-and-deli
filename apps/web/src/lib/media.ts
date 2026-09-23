import { getPublicCmsUrl } from './siteUrl'

/**
 * Absolute URL of an uploaded file. In production files live in Supabase Storage and
 * already have absolute URLs; locally they are served by the CMS under a relative path.
 */
export const mediaUrl = (url: string): string => (url.startsWith('/') ? `${getPublicCmsUrl()}${url}` : url)
