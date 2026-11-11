'use client'

import React, { createContext, useCallback, use, useEffect } from 'react'

import type { Theme, ThemeContextType } from './types'

import { defaultTheme, getImplicitPreference, themeLocalStorageKey } from './shared'
import { themeIsValid } from './types'

interface ThemeProviderProps {
  children: React.ReactNode
  allowThemeSwitch?: boolean
  defaultThemeSetting?: Theme
}

const initialContext: ThemeContextType = {
  setTheme: () => null,
  theme: undefined,
  preference: 'auto',
  allowThemeSwitch: true,
}

const ThemeContext = createContext(initialContext)

export const ThemeProvider = ({
  children,
  allowThemeSwitch = true,
  defaultThemeSetting = defaultTheme,
}: ThemeProviderProps) => {
  const setTheme = useCallback(
    (themeToSet: Theme | null) => {
      if (!allowThemeSwitch) return

      if (themeToSet === null) {
        window.localStorage.removeItem(themeLocalStorageKey)

        const resolvedTheme = getImplicitPreference() ?? defaultThemeSetting
        document.documentElement.setAttribute('data-theme', resolvedTheme)
      } else {
        window.localStorage.setItem(themeLocalStorageKey, themeToSet)
        document.documentElement.setAttribute('data-theme', themeToSet)
      }

      window.dispatchEvent(new Event('theme-preference-change'))
    },
    [allowThemeSwitch, defaultThemeSetting],
  )

  useEffect(() => {
    if (!allowThemeSwitch) {
      window.localStorage.removeItem(themeLocalStorageKey)
      document.documentElement.setAttribute('data-theme', defaultThemeSetting)
      window.dispatchEvent(new Event('theme-preference-change'))
    } else {
      const storedPreference = window.localStorage.getItem(themeLocalStorageKey)

      const resolvedTheme = themeIsValid(storedPreference)
        ? storedPreference
        : (getImplicitPreference() ?? defaultThemeSetting)

      document.documentElement.setAttribute('data-theme', resolvedTheme)
    }
  }, [allowThemeSwitch, defaultThemeSetting])

  return (
    <ThemeContext
      value={{
        setTheme,
        theme: undefined,
        preference: 'auto',
        allowThemeSwitch,
      }}
    >
      {children}
    </ThemeContext>
  )
}

export const useTheme = (): ThemeContextType => use(ThemeContext)
