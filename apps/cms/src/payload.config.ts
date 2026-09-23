import path from 'path'
import { fileURLToPath } from 'url'

import { postgresAdapter } from '@payloadcms/db-postgres'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
import { HOME_SLUG } from '@mighty-meats/shared/constants'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { ContactSubmissions } from './collections/ContactSubmissions'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Partners } from './collections/Partners'
import { ProductCategories } from './collections/ProductCategories'
import { Products } from './collections/Products'
import { Testimonials } from './collections/Testimonials'
import { Users } from './collections/Users'
import { Videos } from './collections/Videos'
import { contactEndpoint } from './endpoints/contact'
import { healthEndpoint } from './endpoints/health'
import { env, isS3Enabled } from './env'
import { Navigation } from './globals/Navigation'
import { SiteSettings } from './globals/SiteSettings'
import { migrations } from './migrations'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default buildConfig({
  serverURL: env.serverUrl,
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [
    Pages,
    Products,
    ProductCategories,
    Partners,
    Videos,
    Testimonials,
    Media,
    ContactSubmissions,
    Users,
  ],
  globals: [SiteSettings, Navigation],
  endpoints: [contactEndpoint, healthEndpoint],
  // The static website calls the contact endpoint from the browser
  cors: [env.webUrl],
  csrf: [env.webUrl],
  editor: lexicalEditor(),
  secret: env.payloadSecret,
  sharp,
  typescript: {
    // Shared with the website, which renders the same data
    outputFile: path.resolve(dirname, '../../../packages/shared/src/payload-types.ts'),
  },
  db: postgresAdapter({
    pool: { connectionString: env.databaseUrl },
    // Schema changes go through migrations; they run automatically on production start
    push: false,
    prodMigrations: migrations,
  }),
  plugins: [
    seoPlugin({
      collections: ['pages'],
      uploadsCollection: 'media',
      tabbedUI: true,
      generateTitle: ({ doc }) => doc?.title ?? '',
      generateURL: ({ doc }) =>
        `${env.webUrl}${doc?.slug === HOME_SLUG ? '' : `/${doc?.slug ?? ''}`}`,
    }),
    s3Storage({
      enabled: isS3Enabled,
      // Keep the plugin's fields in the schema even when S3 is off (local dev),
      // so migrations are identical in every environment
      alwaysInsertFields: true,
      bucket: env.s3.bucket,
      config: {
        endpoint: env.s3.endpoint,
        region: env.s3.region,
        forcePathStyle: true,
        credentials: {
          accessKeyId: env.s3.accessKeyId,
          secretAccessKey: env.s3.secretAccessKey,
        },
      },
      collections: {
        media: {
          // Files are served straight from the public bucket, so the website
          // never waits for the (possibly sleeping) CMS to load an image.
          disablePayloadAccessControl: true,
          generateFileURL: ({ filename, prefix }) =>
            [env.s3.publicUrl, prefix, filename].filter(Boolean).join('/'),
        },
      },
    }),
  ],
})
