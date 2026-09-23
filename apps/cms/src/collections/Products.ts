import { COOKING_METHODS } from '@mighty-meats/shared/cooking'
import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { rebuildWebsiteHooks } from '../hooks/rebuildWebsite'

export const Products: CollectionConfig = {
  slug: 'products',
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'price', 'isAvailable'],
    group: 'Catalog',
  },
  hooks: { ...rebuildWebsiteHooks },
  defaultSort: 'name',
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'category',
      type: 'relationship',
      relationTo: 'product-categories',
      required: true,
      index: true,
    },
    { name: 'description', type: 'textarea' },
    {
      name: 'price',
      type: 'text',
      admin: { description: 'Free text, e.g. "$8.99 / lb" or "from $120".' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'A cut-out PNG on a transparent background looks best in "Customer favorites".' },
    },
    {
      name: 'perfectFor',
      type: 'select',
      hasMany: true,
      options: COOKING_METHODS.map(({ value, label }) => ({ value, label })),
    },
    {
      name: 'video',
      type: 'relationship',
      relationTo: 'videos',
      admin: {
        description: 'Pick a video or create a new one with "+": a YouTube/Vimeo link or an uploaded file.',
      },
    },
    {
      name: 'link',
      type: 'group',
      admin: { description: 'Optional button, e.g. "Order on Instagram".' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'label', type: 'text' },
            {
              name: 'url',
              type: 'text',
              validate: (value: null | string | undefined) =>
                !value || /^https?:\/\/\S+$/.test(value) ? true : 'Enter a full link starting with https://',
            },
          ],
        },
      ],
    },
    {
      name: 'isAvailable',
      type: 'checkbox',
      label: 'Available',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
  ],
}
