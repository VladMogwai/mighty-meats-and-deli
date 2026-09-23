import type { Block } from 'payload'

/** A swipeable row of vertical (9:16) videos, like YouTube Shorts or Reels. */
export const ShortsBlock: Block = {
  slug: 'shorts',
  interfaceName: 'ShortsBlock',
  fields: [
    { name: 'eyebrow', type: 'text' },
    { name: 'heading', type: 'text' },
    { name: 'intro', type: 'textarea' },
    {
      name: 'videos',
      type: 'relationship',
      relationTo: 'videos',
      hasMany: true,
      required: true,
      admin: {
        description: 'Vertical videos work best: uploaded 9:16 files, YouTube Shorts, TikTok or Instagram Reels links.',
      },
    },
  ],
}
