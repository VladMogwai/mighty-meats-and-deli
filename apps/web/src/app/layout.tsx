import type { Metadata, Viewport } from 'next'
import { Bebas_Neue, Montserrat } from 'next/font/google'
import type { ReactNode } from 'react'

import { RevealObserver } from '@/components/motion/RevealObserver'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { TopBar } from '@/components/layout/TopBar'
import { getNavigation, getSiteSettings } from '@/lib/cms'
import { getSiteUrl } from '@/lib/siteUrl'
import { buildBusinessJsonLd } from '@/lib/structuredData'

import './styles.css'
import '@/components/motion/motion.css'

const displayFont = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const bodyFont = Montserrat({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const siteName = settings.siteName || 'Mighty Meats and Deli'

  return {
    metadataBase: new URL(getSiteUrl()),
    title: { default: siteName, template: `%s | ${siteName}` },
    description: settings.tagline || undefined,
    applicationName: siteName,
    formatDetection: { telephone: true, address: true },
  }
}

export default async function FrontendLayout({ children }: { children: ReactNode }) {
  const [settings, navigation] = await Promise.all([getSiteSettings(), getNavigation()])

  return (
    <html lang="en" className={`${displayFont.variable} ${bodyFont.variable}`}>
      <body>
        <a href="#content" className="skip-link">
          Skip to content
        </a>
        <TopBar settings={settings} />
        <SiteHeader settings={settings} navigation={navigation} />
        <main id="content">{children}</main>
        <SiteFooter settings={settings} navigation={navigation} />
        <RevealObserver />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(buildBusinessJsonLd(settings)) }}
        />
      </body>
    </html>
  )
}
