import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { rebuildWebsiteHooks } from '../hooks/rebuildWebsite'
import { slugField } from '../fields/slug'
import { categoryPreview } from '../utilities/sitePreview'

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
    group: 'Products',
    preview: categoryPreview,
  },
  hooks: { ...rebuildWebsiteHooks },
  defaultSort: 'sortOrder',
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    { name: 'description', type: 'textarea' },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: {
        description: 'Shown on the category tile and for products in this category that have no photo of their own.',
      },
    },
    {
      name: 'sortOrder',
      type: 'number',
      defaultValue: 0,
      admin: { position: 'sidebar' },
    },
  ],
}
