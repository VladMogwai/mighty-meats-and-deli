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
      name: 'source',
      type: 'radio',
      defaultValue: 'manual',
      options: [
        { label: 'Videos picked below', value: 'manual' },
        { label: 'Latest videos from the YouTube channel', value: 'youtube' },
      ],
      admin: {
        layout: 'horizontal',
        description: 'The channel link is set in Site Settings → Social. New channel videos appear on the site within a day.',
      },
    },
    {
      name: 'youtubeLimit',
      label: 'How many channel videos',
      type: 'number',
      defaultValue: 10,
      min: 1,
      max: 15,
      admin: { condition: (_, siblingData) => siblingData?.source === 'youtube' },
    },
    {
      name: 'videos',
      type: 'relationship',
      relationTo: 'videos',
      hasMany: true,
      admin: {
        description:
          'Vertical videos work best: uploaded 9:16 files or YouTube Shorts / TikTok / Reels links. With the YouTube source these are shown when the channel has no videos yet.',
      },
    },
  ],
}
