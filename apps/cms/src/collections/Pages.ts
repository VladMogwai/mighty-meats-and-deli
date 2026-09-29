import { HOME_SLUG } from '@mighty-meats/shared/constants'
import type { CollectionConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { rebuildWebsiteHooks } from '../hooks/rebuildWebsite'
import { pageBlocks } from '../blocks'
import { slugField } from '../fields/slug'
import { pagePreview } from '../utilities/sitePreview'

export const Pages: CollectionConfig = {
  slug: 'pages',
  access: {
    read: anyone,
    create: authenticated,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
    description: `The page with slug "${HOME_SLUG}" is the home page. Open a page and edit its sections.`,
    group: 'Website',
    preview: pagePreview,
  },
  hooks: { ...rebuildWebsiteHooks },
  fields: [
    { name: 'title', type: 'text', required: true },
    slugField(),
    {
      name: 'layout',
      type: 'blocks',
      blocks: pageBlocks,
      admin: { initCollapsed: true },
    },
  ],
}
