export type Theme = 'dark' | 'light'

export type ThemePreference = Theme | 'auto'

export interface ThemeContextType {
  setTheme: (theme: Theme | null) => void
  theme?: Theme | null
  preference: ThemePreference
  allowThemeSwitch: boolean
}

export function themeIsValid(string: null | string): string is Theme {
  return string ? ['dark', 'light'].includes(string) : false
}
