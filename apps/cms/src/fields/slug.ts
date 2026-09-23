import type { TextField } from 'payload'

const toSlug = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

/** URL-safe slug; filled from `sourceField` when left empty. */
export const slugField = (sourceField = 'title'): TextField => ({
  name: 'slug',
  type: 'text',
  required: true,
  unique: true,
  index: true,
  admin: {
    position: 'sidebar',
    description: 'Part of the URL. Leave empty to generate from the title.',
  },
  hooks: {
    beforeValidate: [
      ({ value, data }) => {
        if (typeof value === 'string' && value.length > 0) return toSlug(value)
        const source = data?.[sourceField]
        return typeof source === 'string' ? toSlug(source) : value
      },
    ],
  },
})
