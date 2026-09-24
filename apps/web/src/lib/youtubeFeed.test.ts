import { describe, expect, it } from 'vitest'

import { parseChannelFeed } from './youtubeFeed'

const feed = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns:yt="http://www.youtube.com/xml/schemas/2015" xmlns:media="http://search.yahoo.com/mrss/" xmlns="http://www.w3.org/2005/Atom">
 <title>Mighty Meats</title>
 <entry>
  <id>yt:video:AAAAAAAAAAA</id>
  <yt:videoId>AAAAAAAAAAA</yt:videoId>
  <title>Ribeye on the grill &amp; salt</title>
  <link rel="alternate" href="https://www.youtube.com/shorts/AAAAAAAAAAA"/>
  <media:group>
   <media:title>Ribeye on the grill &amp; salt</media:title>
   <media:description>Quick weeknight dinner
#bbq #steak</media:description>
  </media:group>
 </entry>
 <entry>
  <yt:videoId>BBBBBBBBBBB</yt:videoId>
  <title>Farmer sausage</title>
  <link rel="alternate" href="https://www.youtube.com/watch?v=BBBBBBBBBBB"/>
  <media:group><media:description></media:description></media:group>
 </entry>
</feed>`

describe('parseChannelFeed', () => {
  it('reads id, title, first description line and whether it is a Short', () => {
    expect(parseChannelFeed(feed)).toEqual([
      { id: 'AAAAAAAAAAA', title: 'Ribeye on the grill & salt', description: 'Quick weeknight dinner', isShort: true },
      { id: 'BBBBBBBBBBB', title: 'Farmer sausage', description: '', isShort: false },
    ])
  })

  it('returns an empty list for a feed without videos', () => {
    expect(parseChannelFeed('<feed><title>Empty</title></feed>')).toEqual([])
  })
})
