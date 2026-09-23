/** Environment of the CMS. Everything optional has a working local default. */
export const env = {
  databaseUrl: process.env.DATABASE_URL ?? '',
  payloadSecret: process.env.PAYLOAD_SECRET ?? '',
  /** Public origin of this CMS. On Render it defaults to the URL Render assigns to the service. */
  serverUrl: (
    process.env.PAYLOAD_PUBLIC_SERVER_URL ||
    process.env.RENDER_EXTERNAL_URL ||
    'http://localhost:3001'
  ).replace(/\/$/, ''),
  /** Public origin of the website — allowed for CORS and used for SEO previews. */
  webUrl: (process.env.WEB_URL || 'http://localhost:3000').replace(/\/$/, ''),
  /** Cloudflare Pages deploy hook; the site is rebuilt after content changes. */
  webDeployHookUrl: process.env.WEB_DEPLOY_HOOK_URL ?? '',
  s3: {
    bucket: process.env.S3_BUCKET ?? '',
    endpoint: process.env.S3_ENDPOINT ?? '',
    region: process.env.S3_REGION || 'us-east-1',
    accessKeyId: process.env.S3_ACCESS_KEY_ID ?? '',
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? '',
    /** Public base URL of the bucket, e.g. https://<ref>.supabase.co/storage/v1/object/public/media */
    publicUrl: (process.env.S3_PUBLIC_URL ?? '').replace(/\/$/, ''),
  },
}

/** Uploads go to S3 (Supabase Storage) when configured, otherwise to the local disk. */
export const isS3Enabled = Boolean(env.s3.bucket && env.s3.accessKeyId)
