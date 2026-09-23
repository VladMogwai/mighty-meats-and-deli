import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { rebuildWebsiteHooks } from '../hooks/rebuildWebsite'
import { slugField } from '../fields/slug'

export const ProductCategories: CollectionConfig = {
  slug: 'product-categories',
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    group: 'Catalog',
  },
  hooks: { ...rebuildWebsiteHooks },
  defaultSort: 'sortOrder',
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    { name: 'description', type: 'textarea' },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}
