import type { Block } from 'payload'

/** Address, phone, opening hours and a map — data comes from Site settings. */
export const LocationBlock: Block = {
  slug: 'location',
  interfaceName: 'LocationBlock',
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'showMap', type: 'checkbox', defaultValue: true },
  ],
}
