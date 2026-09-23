import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload'

import { env } from '../env'

/** Batches several quick saves into one website build. */
const DEBOUNCE_MS = 60_000

let pendingRebuild: ReturnType<typeof setTimeout> | null = null

/**
 * The website is static HTML on Cloudflare Pages, so content changes
 * show up only after a rebuild. No-op when the deploy hook is not configured (local dev, tests).
 */
export const scheduleWebsiteRebuild = (log: (message: string) => void): void => {
  if (!env.webDeployHookUrl) return
  if (pendingRebuild) clearTimeout(pendingRebuild)

  pendingRebuild = setTimeout(async () => {
    pendingRebuild = null
    try {
      const response = await fetch(env.webDeployHookUrl, { method: 'POST' })
      log(`Website rebuild requested: HTTP ${response.status}`)
    } catch (error) {
      log(`Website rebuild request failed: ${String(error)}`)
    }
  }, DEBOUNCE_MS)
}

export const rebuildWebsiteAfterChange: CollectionAfterChangeHook = ({ doc, req }) => {
  scheduleWebsiteRebuild((message) => req.payload.logger.info(message))
  return doc
}

export const rebuildWebsiteAfterDelete: CollectionAfterDeleteHook = ({ doc, req }) => {
  scheduleWebsiteRebuild((message) => req.payload.logger.info(message))
  return doc
}

export const rebuildWebsiteAfterGlobalChange: GlobalAfterChangeHook = ({ doc, req }) => {
  scheduleWebsiteRebuild((message) => req.payload.logger.info(message))
  return doc
}

/** Spread into a collection config: `hooks: { ...rebuildWebsiteHooks }`. */
export const rebuildWebsiteHooks = {
  afterChange: [rebuildWebsiteAfterChange],
  afterDelete: [rebuildWebsiteAfterDelete],
}
