import Script from 'next/script'
import React from 'react'

import type { Theme } from '../types'

import { defaultTheme, themeLocalStorageKey } from '../ThemeSelector/types'

interface InitThemeProps {
  allowThemeSwitch?: boolean
  defaultThemeSetting?: Theme
}

export const InitTheme: React.FC<InitThemeProps> = ({
  allowThemeSwitch = true,
  defaultThemeSetting = defaultTheme,
}) => {
  return (
    // eslint-disable-next-line @next/next/no-before-interactive-script-outside-document
    <Script
      dangerouslySetInnerHTML={{
        __html: `
  (function () {
    function getImplicitPreference() {
      var mediaQuery = '(prefers-color-scheme: dark)'
      var mql = window.matchMedia(mediaQuery)

      if (typeof mql.matches === 'boolean') {
        return mql.matches ? 'dark' : 'light'
      }

      return null
    }

    function themeIsValid(theme) {
      return theme === 'light' || theme === 'dark'
    }

    var allowThemeSwitch = ${JSON.stringify(allowThemeSwitch)}
    var defaultTheme = ${JSON.stringify(defaultThemeSetting)}
    var themeToSet = defaultTheme

    if (allowThemeSwitch) {
      var preference = window.localStorage.getItem('${themeLocalStorageKey}')

      if (themeIsValid(preference)) {
        themeToSet = preference
      } else {
        var implicitPreference = getImplicitPreference()

        if (implicitPreference) {
          themeToSet = implicitPreference
        }
      }
    } else {
      window.localStorage.removeItem('${themeLocalStorageKey}')
    }

    document.documentElement.setAttribute('data-theme', themeToSet)
  })();
  `,
      }}
      id="theme-script"
      strategy="beforeInteractive"
    />
  )
}
