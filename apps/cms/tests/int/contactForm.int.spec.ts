import { getPayload, type Payload } from 'payload'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

import config from '@/payload.config'
import { submitContact } from '@/endpoints/contact'

const TEST_EMAIL = 'contact-form-test@example.com'

const findTestSubmissions = (payload: Payload) =>
  payload.find({ collection: 'contact-submissions', where: { email: { equals: TEST_EMAIL } } })

describe('submitContact', () => {
  let payload: Payload

  beforeAll(async () => {
    payload = await getPayload({ config: await config })
  })

  afterAll(async () => {
    await payload.delete({ collection: 'contact-submissions', where: { email: { equals: TEST_EMAIL } } })
  })

  it('returns field errors for invalid input', async () => {
    const result = await submitContact(payload, { email: 'nope' })
    expect(result.status).toBe('error')
    expect(result.status === 'error' && Object.keys(result.errors).sort()).toEqual(['email', 'message', 'name'])
  })

  it('silently drops honeypot submissions', async () => {
    const result = await submitContact(payload, {
      name: 'Bot',
      email: TEST_EMAIL,
      message: 'spam',
      company: 'Spam Inc',
    })
    expect(result.status).toBe('success')
    expect((await findTestSubmissions(payload)).totalDocs).toBe(0)
  })

  it('stores a valid submission', async () => {
    const result = await submitContact(payload, {
      name: 'Jane',
      email: TEST_EMAIL,
      message: 'Two ribeyes for Friday, please.',
    })
    expect(result.status).toBe('success')
    const { docs } = await findTestSubmissions(payload)
    expect(docs).toHaveLength(1)
    expect(docs[0]).toMatchObject({ name: 'Jane', message: 'Two ribeyes for Friday, please.' })
  })
})
