import type { CollectionConfig } from 'payload'

import { authenticated } from '../access'

/** Messages sent through the contact form. Created only via the /api/contact endpoint. */
export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  access: {
    read: authenticated,
    create: () => false,
    update: authenticated,
    delete: authenticated,
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'createdAt'],
    group: 'Inbox',
  },
  defaultSort: '-createdAt',
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'phone', type: 'text' },
    { name: 'message', type: 'textarea', required: true },
  ],
}
