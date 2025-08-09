'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type Theme = 'dark' | 'light' | 'system'
type Language = 'ar' | 'en'

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  defaultLanguage?: Language
  storageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  language: Language
  setTheme: (theme: Theme) => void
  setLanguage: (language: Language) => void
}

const initialState: ThemeProviderState = {
  theme: 'system',
  language: 'ar',
  setTheme: () => null,
  setLanguage: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  defaultTheme = 'system',
  defaultLanguage = 'ar',
  storageKey = 'amrikyy-ui-theme',
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme)
  const [language, setLanguage] = useState<Language>(defaultLanguage)

  useEffect(() => {
    // Load saved preferences
    const savedTheme = localStorage.getItem(storageKey) as Theme
    const savedLanguage = localStorage.getItem('amrikyy-language') as Language
    
    if (savedTheme) {
      setTheme(savedTheme)
    }
    
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [storageKey])

  useEffect(() => {
    const root = window.document.documentElement
    const body = window.document.body

    // Remove previous theme classes
    root.classList.remove('light', 'dark')
    body.classList.remove('rtl', 'ltr')

    // Apply theme
    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      root.classList.add(systemTheme)
      root.setAttribute('data-theme', systemTheme)
    } else {
      root.classList.add(theme)
      root.setAttribute('data-theme', theme)
    }

    // Apply language direction
    if (language === 'ar') {
      body.classList.add('rtl')
      root.setAttribute('dir', 'rtl')
      root.setAttribute('lang', 'ar')
    } else {
      body.classList.add('ltr')
      root.setAttribute('dir', 'ltr')
      root.setAttribute('lang', 'en')
    }

    // Save preferences
    localStorage.setItem(storageKey, theme)
    localStorage.setItem('amrikyy-language', language)
  }, [theme, language, storageKey])

  const value = {
    theme,
    language,
    setTheme: (theme: Theme) => {
      setTheme(theme)
    },
    setLanguage: (language: Language) => {
      setLanguage(language)
    },
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error('useTheme must be used within a ThemeProvider')

  return context
}
