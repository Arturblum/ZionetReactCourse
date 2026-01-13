import { type ReactNode, useEffect } from 'react'
import { loadPrimeReactTheme, useThemeStore } from '../stores'

type ThemeProviderProps = {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const theme = useThemeStore((s) => s.theme)
  const primeTheme = useThemeStore((s) => s.primeTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    loadPrimeReactTheme(primeTheme)
  }, [primeTheme])

  return <>{children}</>
}
