import type { Block } from 'payload'

/** Numbered steps (1, 2, 3…) alternating left/right, joined by a line that draws on scroll. */
export const StepsBlock: Block = {
  slug: 'steps',
  interfaceName: 'StepsBlock',
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'intro', type: 'textarea' },
    {
      name: 'steps',
      type: 'array',
      minRows: 1,
      maxRows: 9,
      required: true,
      fields: [
        { name: 'title', type: 'text', required: true },
        { name: 'text', type: 'textarea', required: true },
        { name: 'image', type: 'upload', relationTo: 'media' },
      ],
    },
  ],
}
