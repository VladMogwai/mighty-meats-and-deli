import type { Block } from 'payload'

export const TestimonialsBlock: Block = {
  slug: 'testimonials',
  interfaceName: 'TestimonialsBlock',
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'testimonials',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      admin: { description: 'Leave empty to show all testimonials.' },
    },
  ],
}
