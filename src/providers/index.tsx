import React from 'react'

import type { Theme } from './Theme/types'

import { HeaderThemeProvider } from './HeaderTheme'
import { ThemeProvider } from './Theme'

interface ProvidersProps {
  children: React.ReactNode
  allowThemeSwitch?: boolean
  defaultThemeSetting?: Theme
}

export const Providers: React.FC<ProvidersProps> = ({
  children,
  allowThemeSwitch = true,
  defaultThemeSetting = 'light',
}) => {
  return (
    <ThemeProvider allowThemeSwitch={allowThemeSwitch} defaultThemeSetting={defaultThemeSetting}>
      <HeaderThemeProvider>{children}</HeaderThemeProvider>
    </ThemeProvider>
  )
}
