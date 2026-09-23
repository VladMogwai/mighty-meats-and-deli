import type { Block } from 'payload'

export const ContentBlock: Block = {
  slug: 'content',
  interfaceName: 'ContentBlock',
  fields: [
    { name: 'eyebrow', type: 'text', admin: { description: 'Small line above the heading.' } },
    { name: 'heading', type: 'text' },
    { name: 'content', type: 'richText', required: true },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Optional image shown next to the text.' },
    },
  ],
}
