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
      name: 'backgroundVideo',
      type: 'upload',
      relationTo: 'media',
      filterOptions: { mimeType: { contains: 'video/' } },
      admin: {
        description: 'Plays silently in a loop behind the text (MP4, keep it under ~5 MB). The text stays readable thanks to a dark overlay.',
      },
    },
    {
      name: 'backgroundPoster',
      type: 'upload',
      relationTo: 'media',
      filterOptions: { mimeType: { contains: 'image/' } },
      admin: {
        description: 'A still frame of the video: shown while it loads and to visitors who turned off animations.',
        condition: (_, siblingData) => Boolean(siblingData?.backgroundVideo),
      },
    },
    {
      name: 'callToAction',
      type: 'array',
      maxRows: 2,
      fields: [linkField()],
    },
  ],
}
