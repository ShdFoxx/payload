import type { Metadata } from 'next'

import { getCachedGlobal } from '@/utilities/getGlobals'
import type { SiteSetting } from '@/payload-types'

import { defaultLightTheme, defaultDarkTheme } from '@/theme/defaults'

import { cn } from '@/utilities/ui'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

function generateThemeCSS(
  theme: Record<string, string | null | undefined> | null | undefined,
  defaults: Record<string, string>,
) {
  return Object.entries(defaults)
    .map(([key, defaultValue]) => {
      const value = theme?.[key] ?? defaultValue

      // Évite l'injection de CSS arbitraire depuis les paramètres.
      const safeValue =
        typeof value === 'string' && /^[a-zA-Z0-9#(),.%\s+-]+$/.test(value) ? value : defaultValue

      const cssVariable = key.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)

      return `--${cssVariable}: ${safeValue};`
    })
    .join('\n')
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()
  const siteSettings: SiteSetting = await getCachedGlobal('site-settings', 1)()

  const allowThemeSwitch = siteSettings.allowThemeSwitch ?? true

  const defaultThemeSetting = siteSettings.defaultTheme === 'dark' ? 'dark' : 'light'
  const lightThemeCSS = generateThemeCSS(siteSettings.lightTheme, defaultLightTheme)

  const darkThemeCSS = generateThemeCSS(siteSettings.darkTheme, defaultDarkTheme)

  return (
    <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
      <head>
        <InitTheme allowThemeSwitch={allowThemeSwitch} defaultThemeSetting={defaultThemeSetting} />
        <style>{`
  html[data-theme='light'] {
    ${lightThemeCSS}
  }

  html[data-theme='dark'] {
    ${darkThemeCSS}
  }
`}</style>
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers allowThemeSwitch={allowThemeSwitch} defaultThemeSetting={defaultThemeSetting}>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
