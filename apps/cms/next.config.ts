import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  transpilePackages: ['@mighty-meats/shared'],
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
