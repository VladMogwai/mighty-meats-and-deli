export type VideoProvider = 'youtube' | 'vimeo' | 'tiktok' | 'facebook' | 'instagram'

export type ParsedVideo = {
  provider: VideoProvider
  id: string
  embedUrl: string
  /** Vertical (9:16) formats: Shorts, TikTok, Reels. */
  isVertical: boolean
}

export const SUPPORTED_VIDEO_PROVIDERS = 'YouTube, Vimeo, TikTok, Facebook, Instagram'

const YOUTUBE_ID = /^[\w-]{11}$/

const parseYouTube = (url: URL): ParsedVideo | null => {
  const host = url.hostname.replace(/^(www\.|m\.)/, '')
  let id: string | null = null
  let isVertical = false

  if (host === 'youtu.be') {
    id = url.pathname.slice(1)
  } else if (host === 'youtube.com' || host === 'youtube-nocookie.com') {
    const [, section, pathId] = url.pathname.split('/')
    if (section === 'watch') id = url.searchParams.get('v')
    else if (section === 'embed' || section === 'live') id = pathId
    else if (section === 'shorts') {
      id = pathId
      isVertical = true
    }
  }

  if (!id || !YOUTUBE_ID.test(id)) return null
  return {
    provider: 'youtube',
    id,
    embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
    isVertical,
  }
}

const parseVimeo = (url: URL): ParsedVideo | null => {
  const host = url.hostname.replace(/^www\./, '')
  if (host !== 'vimeo.com' && host !== 'player.vimeo.com') return null
  const id = url.pathname.split('/').find((part) => /^\d+$/.test(part))
  if (!id) return null
  return { provider: 'vimeo', id, embedUrl: `https://player.vimeo.com/video/${id}`, isVertical: false }
}

const parseTikTok = (url: URL): ParsedVideo | null => {
  if (!url.hostname.endsWith('tiktok.com')) return null
  const id = url.pathname.match(/\/video\/(\d+)/)?.[1]
  if (!id) return null
  return { provider: 'tiktok', id, embedUrl: `https://www.tiktok.com/embed/v2/${id}`, isVertical: true }
}

const parseInstagram = (url: URL): ParsedVideo | null => {
  if (!url.hostname.endsWith('instagram.com')) return null
  const match = url.pathname.match(/^\/(p|reel|reels|tv)\/([\w-]+)/)
  if (!match) return null
  const [, kind, id] = match
  const section = kind === 'reels' ? 'reel' : kind
  return {
    provider: 'instagram',
    id,
    embedUrl: `https://www.instagram.com/${section}/${id}/embed`,
    isVertical: section === 'reel',
  }
}

const parseFacebook = (url: URL): ParsedVideo | null => {
  const host = url.hostname.replace(/^(www\.|m\.)/, '')
  if (host !== 'facebook.com' && host !== 'fb.watch') return null
  const isVideo = host === 'fb.watch' || /\/(videos|reel|watch)\b/.test(url.pathname)
  if (!isVideo) return null
  const canonical = `https://www.facebook.com${url.pathname}${url.search}`
  return {
    provider: 'facebook',
    id: canonical,
    embedUrl: `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(canonical)}&show_text=false`,
    isVertical: url.pathname.includes('/reel'),
  }
}

const parsers = [parseYouTube, parseVimeo, parseTikTok, parseInstagram, parseFacebook]

/** Turns a public video page URL into an embeddable player URL, or null if unsupported. */
export const parseVideoUrl = (input: string): ParsedVideo | null => {
  let url: URL
  try {
    url = new URL(input.trim())
  } catch {
    return null
  }
  if (url.protocol !== 'https:' && url.protocol !== 'http:') return null

  for (const parse of parsers) {
    const result = parse(url)
    if (result) return result
  }
  return null
}
