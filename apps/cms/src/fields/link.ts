import type { GroupField } from 'payload'

/** A link that points either to a CMS page or to an arbitrary URL. */
export const linkField = (name = 'link'): GroupField => ({
  name,
  type: 'group',
  fields: [
    { name: 'label', type: 'text', required: true },
    {
      name: 'type',
      type: 'radio',
      defaultValue: 'page',
      options: [
        { label: 'Page', value: 'page' },
        { label: 'Custom URL', value: 'custom' },
      ],
      admin: { layout: 'horizontal' },
    },
    {
      name: 'page',
      type: 'relationship',
      relationTo: 'pages',
      required: true,
      admin: { condition: (_, siblingData) => siblingData?.type === 'page' },
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      admin: { condition: (_, siblingData) => siblingData?.type === 'custom' },
    },
    { name: 'newTab', type: 'checkbox', label: 'Open in new tab' },
  ],
})
