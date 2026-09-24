import type { Media, Video } from '@mighty-meats/shared/payload-types'
import { parseVideoUrl } from '@mighty-meats/shared/video'

import { mediaUrl } from '@/lib/media'
import type { YouTubeVideo } from '@/lib/youtube'

/** One card on the Ideas shelf, whatever the video comes from. */
export type ShelfItem = {
  key: string
  title: string
  description: string
} & (
  | { kind: 'file'; src: string; poster: string | null }
  | { kind: 'youtube'; youtubeId: string; isVertical: boolean }
  /** Other providers (TikTok, Instagram…): no preview, player only */
  | { kind: 'embed'; url: string }
)

const asMedia = (value: Media | number | null | undefined): Media | null =>
  value && typeof value === 'object' && value.url ? value : null

/** Videos picked in the CMS. */
export const itemsFromVideos = (videos: Video[]): ShelfItem[] =>
  videos.flatMap((video): ShelfItem[] => {
    const base = { key: `video-${video.id}`, title: video.title, description: video.description ?? '' }
    if (video.source === 'upload') {
      const file = asMedia(video.file)
      const poster = asMedia(video.poster)
      return file ? [{ ...base, kind: 'file', src: mediaUrl(file.url), poster: poster ? mediaUrl(poster.url) : null }] : []
    }
    const parsed = video.url ? parseVideoUrl(video.url) : null
    if (!parsed) return []
    return parsed.provider === 'youtube'
      ? [{ ...base, kind: 'youtube', youtubeId: parsed.id, isVertical: parsed.isVertical }]
      : [{ ...base, kind: 'embed', url: video.url }]
  })

/** Latest videos from the shop's YouTube channel. */
export const itemsFromChannel = (videos: YouTubeVideo[]): ShelfItem[] =>
  videos.map((video) => ({
    key: `youtube-${video.id}`,
    title: video.title,
    description: video.description,
    kind: 'youtube',
    youtubeId: video.id,
    isVertical: video.isShort,
  }))
