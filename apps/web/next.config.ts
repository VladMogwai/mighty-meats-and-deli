import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Plain static HTML for Cloudflare Pages; content is fetched from the CMS at build time
  output: 'export',
  trailingSlash: false,
  images: {
    // No image server on a static host; files are served from Supabase Storage as uploaded
    unoptimized: true,
  },
  transpilePackages: ['@mighty-meats/shared'],
}

export default nextConfig
