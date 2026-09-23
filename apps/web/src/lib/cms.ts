import 'server-only'

import type {
  Navigation,
  Page,
  Partner,
  Product,
  SiteSetting,
  Testimonial,
} from '@mighty-meats/shared/payload-types'
import { HOME_SLUG } from '@mighty-meats/shared/constants'
import { cache } from 'react'

/**
 * Read-only client for the Payload REST API. Runs only at build time.
 * The free CMS instance sleeps when idle and needs up to a minute to wake up,
 * hence the generous timeout and retries.
 */
const isCiBuild = Boolean(process.env.CF_PAGES || process.env.CI)

if (isCiBuild && !process.env.CMS_URL) {
  throw new Error('CMS_URL is not set. Add it to the build environment variables (e.g. Cloudflare Pages → Settings).')
}

const CMS_URL = (process.env.CMS_URL || 'http://localhost:3001').replace(/\/$/, '')
const REQUEST_TIMEOUT_MS = 90_000
const MAX_ATTEMPTS = 3

type ListResponse<T> = { docs: T[]; totalDocs: number }

const cmsFetch = async <T>(path: string, params: Record<string, string | number> = {}): Promise<T> => {
  const url = new URL(`/api${path}`, CMS_URL)
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, String(value)))

  let lastError: unknown
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) })
      if (!response.ok) throw new Error(`HTTP ${response.status}`)
      return (await response.json()) as T
    } catch (error) {
      lastError = error
    }
  }
  throw new Error(`CMS request failed: ${url} (${String(lastError)})`)
}

const findAll = async <T>(collection: string, params: Record<string, string | number> = {}) => {
  const { docs } = await cmsFetch<ListResponse<T>>(`/${collection}`, { limit: 0, depth: 1, ...params })
  return docs
}

export const getSiteSettings = cache(() => cmsFetch<SiteSetting>('/globals/site-settings', { depth: 1 }))

export const getNavigation = cache(() => cmsFetch<Navigation>('/globals/navigation', { depth: 1 }))

export const getAllPages = cache(() => findAll<Page>('pages', { depth: 0 }))

export const getPageBySlug = cache(async (slug: string = HOME_SLUG): Promise<Page | null> => {
  const docs = await findAll<Page>('pages', { 'where[slug][equals]': slug, limit: 1, depth: 2 })
  return docs[0] ?? null
})

export const getAvailableProducts = cache((categoryIds: string) =>
  findAll<Product>('products', {
    'where[category][in]': categoryIds,
    'where[isAvailable][equals]': 'true',
    sort: 'name',
  }),
)

export const getAllPartners = cache(() => findAll<Partner>('partners', { sort: 'name' }))

export const getAllTestimonials = cache(() => findAll<Testimonial>('testimonials'))
