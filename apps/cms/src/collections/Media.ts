import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { rebuildWebsiteHooks } from '../hooks/rebuildWebsite'

export const Media: CollectionConfig = {
  slug: 'media',
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    group: 'Advanced',
    description: 'All uploaded photos and video files. Usually you upload them right from a product or page.',
  },
  hooks: { ...rebuildWebsiteHooks },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: { description: 'Describes the file for screen readers and search engines.' },
    },
  ],
  upload: {
    mimeTypes: ['image/*', 'video/mp4', 'video/webm'],
  },
}
