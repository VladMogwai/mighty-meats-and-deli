import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { rebuildWebsiteHooks } from '../hooks/rebuildWebsite'

/** Local artisan producers whose goods the shop carries. */
export const Partners: CollectionConfig = {
  slug: 'partners',
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'website'],
    group: 'Catalog',
  },
  hooks: { ...rebuildWebsiteHooks },
  defaultSort: 'name',
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'website', type: 'text' },
    { name: 'logo', type: 'upload', relationTo: 'media' },
    { name: 'description', type: 'textarea' },
  ],
}
