'use client'

import React, { createContext, useCallback, use, useEffect, useState } from 'react'

import type { Theme, ThemeContextType } from './types'

import canUseDOM from '@/utilities/canUseDOM'
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
  allowThemeSwitch: true,
}

const ThemeContext = createContext(initialContext)

export const ThemeProvider = ({
  children,
  allowThemeSwitch = true,
  defaultThemeSetting = defaultTheme,
}: ThemeProviderProps) => {
  const [theme, setThemeState] = useState<Theme | undefined>(
    canUseDOM ? (document.documentElement.getAttribute('data-theme') as Theme) : undefined,
  )

  const setTheme = useCallback(
    (themeToSet: Theme | null) => {
      if (!allowThemeSwitch) return

      if (themeToSet === null) {
        window.localStorage.removeItem(themeLocalStorageKey)

        const implicitPreference = getImplicitPreference()
        const resolvedTheme = implicitPreference ?? defaultThemeSetting

        document.documentElement.setAttribute('data-theme', resolvedTheme)
        setThemeState(resolvedTheme)
      } else {
        setThemeState(themeToSet)
        window.localStorage.setItem(themeLocalStorageKey, themeToSet)
        document.documentElement.setAttribute('data-theme', themeToSet)
      }
    },
    [allowThemeSwitch, defaultThemeSetting],
  )

  useEffect(() => {
    let themeToSet: Theme

    if (!allowThemeSwitch) {
      themeToSet = defaultThemeSetting
      window.localStorage.removeItem(themeLocalStorageKey)
    } else {
      const preference = window.localStorage.getItem(themeLocalStorageKey)

      if (themeIsValid(preference)) {
        themeToSet = preference
      } else {
        themeToSet = getImplicitPreference() ?? defaultThemeSetting
      }
    }

    document.documentElement.setAttribute('data-theme', themeToSet)
    setThemeState(themeToSet)
  }, [allowThemeSwitch, defaultThemeSetting])

  return <ThemeContext value={{ setTheme, theme, allowThemeSwitch }}>{children}</ThemeContext>
}

export const useTheme = (): ThemeContextType => use(ThemeContext)
