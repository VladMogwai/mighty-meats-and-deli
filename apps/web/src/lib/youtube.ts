import 'server-only'

import { type FeedVideo, parseChannelFeed } from './youtubeFeed'

/**
 * Latest videos of a YouTube channel, read at build time from the channel's public
 * RSS feed (no API key, up to 15 newest videos). Any failure yields an empty list,
 * so the site build never breaks because of YouTube.
 */

export type { FeedVideo as YouTubeVideo } from './youtubeFeed'

const REQUEST_TIMEOUT_MS = 20_000
const CHANNEL_ID = /^UC[\w-]{22}$/

const fetchText = async (url: string) => {
  const response = await fetch(url, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return response.text()
}

/** Accepts https://www.youtube.com/channel/UC… or https://www.youtube.com/@handle. */
const resolveChannelId = async (channel: string): Promise<string | null> => {
  const direct = channel.match(/channel\/(UC[\w-]{22})/)?.[1]
  if (direct) return direct
  const html = await fetchText(channel)
  const found = html.match(/"channelId":"(UC[\w-]{22})"/)?.[1] ?? html.match(/channel\/(UC[\w-]{22})/)?.[1]
  return found && CHANNEL_ID.test(found) ? found : null
}

export const getChannelVideos = async (channel: string | null | undefined, limit: number): Promise<FeedVideo[]> => {
  if (!channel) return []
  try {
    const channelId = await resolveChannelId(channel.trim())
    if (!channelId) throw new Error('channel id not found')
    const feed = await fetchText(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`)
    return parseChannelFeed(feed).slice(0, limit)
  } catch (error) {
    console.warn(`YouTube channel ${channel}: ${String(error)} — showing the manually picked videos instead`)
    return []
  }
}
