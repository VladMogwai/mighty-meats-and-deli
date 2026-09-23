import { getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import config from '@/payload.config'

const TEST_TITLE = 'videos-int-test'

describe('Videos collection', () => {
  let payload: Payload

  beforeAll(async () => {
    payload = await getPayload({ config: await config })
  })

  afterAll(async () => {
    await payload.delete({ collection: 'videos', where: { title: { equals: TEST_TITLE } } })
  })

  it('accepts a supported link', async () => {
    const video = await payload.create({
      collection: 'videos',
      data: { title: TEST_TITLE, source: 'embed', url: 'https://youtu.be/dQw4w9WgXcQ' },
    })
    expect(video.url).toBe('https://youtu.be/dQw4w9WgXcQ')
  })

  it('rejects an unsupported link', async () => {
    await expect(
      payload.create({
        collection: 'videos',
        data: { title: TEST_TITLE, source: 'embed', url: 'https://example.com/clip' },
      }),
    ).rejects.toThrow(/invalid: Url/)
  })
})
