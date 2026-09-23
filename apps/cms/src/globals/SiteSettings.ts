import { WEEK_DAYS } from '@mighty-meats/shared/constants'
import type { GlobalConfig } from 'payload'

import { anyone, authenticated } from '../access'
import { rebuildWebsiteAfterGlobalChange } from '../hooks/rebuildWebsite'

const TIME_PATTERN = /^([01]\d|2[0-3]):[0-5]\d$/

const validateTime = (value: null | string | undefined) =>
  !value || TIME_PATTERN.test(value) ? true : 'Use 24-hour HH:MM, e.g. 09:00'

/** Business details shared by the header, footer, contact page and structured data. */
export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: {
    read: anyone,
    update: authenticated,
  },
  hooks: { afterChange: [rebuildWebsiteAfterGlobalChange] },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'General',
          fields: [
            { name: 'siteName', type: 'text', required: true },
            { name: 'tagline', type: 'text' },
            { name: 'logo', type: 'upload', relationTo: 'media' },
            {
              name: 'defaultOgImage',
              type: 'upload',
              relationTo: 'media',
              admin: { description: 'Used for social sharing when a page has no own image.' },
            },
          ],
        },
        {
          label: 'Contacts',
          fields: [
            { name: 'phone', type: 'text' },
            { name: 'email', type: 'email' },
            {
              name: 'address',
              type: 'group',
              fields: [
                { name: 'street', type: 'text' },
                {
                  type: 'row',
                  fields: [
                    { name: 'city', type: 'text' },
                    { name: 'region', type: 'text', admin: { description: 'Province / state' } },
                    { name: 'postalCode', type: 'text' },
                  ],
                },
                { name: 'country', type: 'text', defaultValue: 'CA' },
              ],
            },
            {
              name: 'openingHours',
              type: 'array',
              admin: { description: 'Days that are not listed are shown as closed.' },
              fields: [
                {
                  name: 'days',
                  type: 'select',
                  hasMany: true,
                  required: true,
                  options: WEEK_DAYS.map((day) => ({ label: day, value: day })),
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'opens', type: 'text', required: true, validate: validateTime },
                    { name: 'closes', type: 'text', required: true, validate: validateTime },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'Social',
          fields: [
            {
              name: 'socialLinks',
              type: 'array',
              fields: [
                {
                  name: 'platform',
                  type: 'select',
                  required: true,
                  options: ['facebook', 'instagram', 'youtube', 'tiktok', 'x'].map((value) => ({
                    label: value,
                    value,
                  })),
                },
                { name: 'url', type: 'text', required: true },
              ],
            },
          ],
        },
      ],
    },
  ],
}
