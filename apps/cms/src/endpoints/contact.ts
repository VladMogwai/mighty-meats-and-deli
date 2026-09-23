import type { Endpoint, Payload } from 'payload'

export type ContactInput = Partial<Record<'name' | 'email' | 'phone' | 'message' | 'company', unknown>>

export type ContactResult =
  | { status: 'success' }
  | { status: 'error'; errors: Partial<Record<'name' | 'email' | 'message', string>> }

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const MAX_LENGTH = { name: 200, email: 320, phone: 50, message: 5000 }

const text = (value: unknown, maxLength: number): string =>
  (typeof value === 'string' ? value : '').trim().slice(0, maxLength)

/** Validates a contact form submission and stores it. */
export const submitContact = async (payload: Payload, input: ContactInput): Promise<ContactResult> => {
  // Honeypot: humans never see this field, bots tend to fill it.
  if (text(input.company, 200)) return { status: 'success' }

  const name = text(input.name, MAX_LENGTH.name)
  const email = text(input.email, MAX_LENGTH.email)
  const phone = text(input.phone, MAX_LENGTH.phone)
  const message = text(input.message, MAX_LENGTH.message)

  const errors: Extract<ContactResult, { status: 'error' }>['errors'] = {}
  if (!name) errors.name = 'Please enter your name.'
  if (!EMAIL_PATTERN.test(email)) errors.email = 'Please enter a valid email.'
  if (!message) errors.message = 'Please enter a message.'
  if (Object.keys(errors).length > 0) return { status: 'error', errors }

  await payload.create({
    collection: 'contact-submissions',
    data: { name, email, phone, message },
  })
  return { status: 'success' }
}

/** POST /api/contact — called by the contact form on the static website. */
export const contactEndpoint: Endpoint = {
  path: '/contact',
  method: 'post',
  handler: async (req) => {
    const input = (await req.json?.().catch(() => ({}))) as ContactInput
    const result = await submitContact(req.payload, input ?? {})
    return Response.json(result, { status: result.status === 'success' ? 200 : 400 })
  },
}
