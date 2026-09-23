import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { rebuildWebsiteHooks } from '../hooks/rebuildWebsite'

export const Testimonials: CollectionConfig = {
  slug: 'testimonials',
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'author',
    defaultColumns: ['author', 'updatedAt'],
  },
  hooks: { ...rebuildWebsiteHooks },
  fields: [
    { name: 'author', type: 'text', required: true },
    { name: 'quote', type: 'textarea', required: true },
  ],
}
