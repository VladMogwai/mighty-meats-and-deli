import type { Block } from 'payload'

import { linkField } from '../../fields/link'

export const HeroBlock: Block = {
  slug: 'hero',
  interfaceName: 'HeroBlock',
  fields: [
    { name: 'eyebrow', type: 'text', admin: { description: 'Small line above the heading.' } },
    { name: 'heading', type: 'text', required: true },
    { name: 'text', type: 'textarea' },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: { description: 'Shown next to the text. Several images become a swipeable slideshow.' },
    },
    {
      name: 'callToAction',
      type: 'array',
      maxRows: 2,
      fields: [linkField()],
    },
  ],
}
