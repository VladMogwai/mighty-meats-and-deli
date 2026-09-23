import type { Block } from 'payload'

export const ContactFormBlock: Block = {
  slug: 'contactForm',
  interfaceName: 'ContactFormBlock',
  fields: [
    { name: 'heading', type: 'text' },
    { name: 'intro', type: 'textarea' },
    { name: 'successMessage', type: 'text', defaultValue: 'Thank you! We will get back to you soon.' },
  ],
}
