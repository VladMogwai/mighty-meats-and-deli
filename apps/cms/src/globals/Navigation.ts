import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { rebuildWebsiteAfterGlobalChange } from '../hooks/rebuildWebsite'
import { linkField } from '../fields/link'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  access: {
    read: anyone,
    update: authenticated,
  },
  hooks: { afterChange: [rebuildWebsiteAfterGlobalChange] },
  fields: [
    {
      name: 'mainMenu',
      type: 'array',
      maxRows: 8,
      fields: [linkField()],
    },
  ],
}
