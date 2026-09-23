import { describe, expect, it } from 'vitest'

import { parseVideoUrl } from './video'

describe('parseVideoUrl', () => {
  it.each([
    ['https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=10s', 'dQw4w9WgXcQ'],
    ['https://youtu.be/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://m.youtube.com/watch?v=dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
    ['https://www.youtube.com/embed/dQw4w9WgXcQ', 'dQw4w9WgXcQ'],
  ])('parses YouTube url %s', (url, id) => {
    expect(parseVideoUrl(url)).toEqual({
      provider: 'youtube',
      id,
      embedUrl: `https://www.youtube-nocookie.com/embed/${id}`,
      isVertical: false,
    })
  })

  it('marks YouTube Shorts as vertical', () => {
    expect(parseVideoUrl('https://youtube.com/shorts/dQw4w9WgXcQ')).toMatchObject({
      provider: 'youtube',
      isVertical: true,
    })
  })

  it('parses Vimeo', () => {
    expect(parseVideoUrl('https://vimeo.com/76979871')?.embedUrl).toBe(
      'https://player.vimeo.com/video/76979871',
    )
  })

  it('parses TikTok', () => {
    expect(parseVideoUrl('https://www.tiktok.com/@shop/video/7234567890123456789')).toMatchObject({
      provider: 'tiktok',
      embedUrl: 'https://www.tiktok.com/embed/v2/7234567890123456789',
    })
  })

  it('parses Instagram reels', () => {
    expect(parseVideoUrl('https://www.instagram.com/reel/C1a2b3c4d5/')).toMatchObject({
      provider: 'instagram',
      embedUrl: 'https://www.instagram.com/reel/C1a2b3c4d5/embed',
      isVertical: true,
    })
  })

  it('parses Facebook videos', () => {
    expect(parseVideoUrl('https://www.facebook.com/shop/videos/123456/')?.provider).toBe('facebook')
  })

  it.each([
    'not a url',
    'javascript:alert(1)',
    'https://example.com/video.mp4',
    'https://www.youtube.com/watch?v=short',
    'https://www.facebook.com/shop/',
  ])('rejects %s', (url) => {
    expect(parseVideoUrl(url)).toBeNull()
  })
})
