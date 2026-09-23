import type { Block } from 'payload'

/** "Customer favorites": a slider with one product per slide. */
export const FeaturedProductsBlock: Block = {
  slug: 'featuredProducts',
  interfaceName: 'FeaturedProductsBlock',
  fields: [
    { name: 'heading', type: 'text', defaultValue: 'Customer favorites' },
    { name: 'intro', type: 'textarea' },
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      required: true,
      admin: { description: 'Shown in this order.' },
    },
  ],
}
