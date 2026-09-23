import type { Block } from 'payload'

export const GalleryBlock: Block = {
  slug: 'gallery',
  interfaceName: 'GalleryBlock',
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'images', type: 'upload', relationTo: 'media', hasMany: true, required: true },
  ],
}
