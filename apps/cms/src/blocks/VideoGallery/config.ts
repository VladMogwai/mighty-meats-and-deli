import type { Block } from 'payload'

export const VideoGalleryBlock: Block = {
  slug: 'videoGallery',
  interfaceName: 'VideoGalleryBlock',
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'videos', type: 'relationship', relationTo: 'videos', hasMany: true, required: true },
  ],
}
