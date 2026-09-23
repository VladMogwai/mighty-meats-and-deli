import type { Block } from 'payload'

export const PartnerListBlock: Block = {
  slug: 'partnerList',
  interfaceName: 'PartnerListBlock',
  fields: [
    { name: 'heading', type: 'text' },
    {
      name: 'partners',
      type: 'relationship',
      relationTo: 'partners',
      hasMany: true,
      admin: { description: 'Leave empty to show all partners.' },
    },
  ],
}
