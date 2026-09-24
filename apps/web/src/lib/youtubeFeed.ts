/** Parsing of a YouTube channel RSS (Atom) feed. Pure, so it can be unit-tested. */

export type FeedVideo = { id: string; title: string; description: string; isShort: boolean }

const decodeXml = (text: string) =>
  text
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, '&')

const tag = (xml: string, name: string) => {
  const match = xml.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`))
  return match ? decodeXml(match[1]).trim() : ''
}

/** Parses the channel feed into videos, newest first. */
export const parseChannelFeed = (xml: string): FeedVideo[] =>
  [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)]
    .map(([, entry]) => ({
      id: tag(entry, 'yt:videoId'),
      title: tag(entry, 'title'),
      description: tag(entry, 'media:description').split('\n')[0] ?? '',
      // The feed links Shorts as youtube.com/shorts/<id> and regular videos as /watch?v=<id>
      isShort: /<link rel="alternate" href="https:\/\/www\.youtube\.com\/shorts\//.test(entry),
    }))
    .filter((video) => video.id)
