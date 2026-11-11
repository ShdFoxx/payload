'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import React, { useSyncExternalStore } from 'react'

import type { Theme, ThemePreference } from '../types'

import { useTheme } from '..'
import { themeLocalStorageKey } from '../shared'
import { themeIsValid } from '../types'

const subscribe = (callback: () => void) => {
  window.addEventListener('theme-preference-change', callback)
  window.addEventListener('storage', callback)

  return () => {
    window.removeEventListener('theme-preference-change', callback)
    window.removeEventListener('storage', callback)
  }
}

const getSnapshot = (): ThemePreference => {
  const preference = window.localStorage.getItem(themeLocalStorageKey)
  return themeIsValid(preference) ? preference : 'auto'
}

const getServerSnapshot = (): ThemePreference => 'auto'

export const ThemeSelector: React.FC = () => {
  const { setTheme, allowThemeSwitch } = useTheme()

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  if (!allowThemeSwitch) return null

  const onThemeChange = (themeToSet: Theme | 'auto') => {
    setTheme(themeToSet === 'auto' ? null : themeToSet)
  }

  return (
    <Select onValueChange={onThemeChange} value={value}>
      <SelectTrigger
        aria-label="Select a theme"
        className="w-auto bg-transparent gap-2 pl-0 md:pl-3 border-none"
      >
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="auto">Auto</SelectItem>
        <SelectItem value="light">Light</SelectItem>
        <SelectItem value="dark">Dark</SelectItem>
      </SelectContent>
    </Select>
  )
}
