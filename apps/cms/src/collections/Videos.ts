import { parseVideoUrl, SUPPORTED_VIDEO_PROVIDERS } from '@mighty-meats/shared/video'
import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { rebuildWebsiteHooks } from '../hooks/rebuildWebsite'

export const Videos: CollectionConfig = {
  slug: 'videos',
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'source', 'updatedAt'],
  },
  hooks: { ...rebuildWebsiteHooks },
  fields: [
    { name: 'title', type: 'text', required: true },
    {
      name: 'source',
      type: 'radio',
      defaultValue: 'embed',
      options: [
        { label: 'Link (YouTube, Vimeo, …)', value: 'embed' },
        { label: 'Uploaded file', value: 'upload' },
      ],
      admin: { layout: 'horizontal' },
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'embed',
        description: `Paste the video page link. Supported: ${SUPPORTED_VIDEO_PROVIDERS}.`,
      },
      validate: (value: null | string | undefined, { siblingData }: { siblingData: { source?: string } }) => {
        if (siblingData?.source !== 'embed') return true
        if (!value) return 'Paste a video link.'
        return parseVideoUrl(value) ? true : `Unsupported link. Supported: ${SUPPORTED_VIDEO_PROVIDERS}.`
      },
    },
    {
      name: 'file',
      type: 'upload',
      relationTo: 'media',
      required: true,
      filterOptions: { mimeType: { contains: 'video/' } },
      admin: {
        condition: (_, siblingData) => siblingData?.source === 'upload',
        description: 'MP4 or WebM. Keep files small — links to YouTube are preferred.',
      },
    },
    {
      name: 'poster',
      type: 'upload',
      relationTo: 'media',
      filterOptions: { mimeType: { contains: 'image/' } },
      admin: { condition: (_, siblingData) => siblingData?.source === 'upload' },
    },
    { name: 'description', type: 'textarea' },
  ],
}
