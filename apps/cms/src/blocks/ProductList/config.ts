import type { Block } from 'payload'

export const ProductListBlock: Block = {
  slug: 'productList',
  interfaceName: 'ProductListBlock',
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'intro', type: 'textarea' },
    {
      name: 'categories',
      type: 'relationship',
      relationTo: 'product-categories',
      hasMany: true,
      required: true,
      admin: { description: 'Products are grouped by these categories, in this order.' },
    },
    { name: 'note', type: 'textarea', admin: { description: 'e.g. "Please allow 24 hours notice".' } },
  ],
}
