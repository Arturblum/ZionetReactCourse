import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// PrimeReact theme options
export type PrimeReactTheme = 
  | 'lara-light-blue'
  | 'lara-dark-blue'
  | 'lara-light-indigo'
  | 'lara-dark-indigo'

// Legacy theme type for backwards compatibility
export type Theme = 'light' | 'dark'

type ThemeStore = {
  theme: Theme
  primeTheme: PrimeReactTheme
  // eslint-disable-next-line no-unused-vars
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
  // eslint-disable-next-line no-unused-vars
  setPrimeTheme: (theme: PrimeReactTheme) => void
}

const PRIMEREACT_THEME_STORAGE_KEY = 'primereact-theme'

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'light',
      primeTheme: 'lara-light-blue',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => {
        const current = get().theme
        set({ theme: current === 'dark' ? 'light' : 'dark' })
      },
      setPrimeTheme: (primeTheme) => {
        // Auto-detect light/dark from theme name
        const isLight = primeTheme.includes('light')
        set({ primeTheme, theme: isLight ? 'light' : 'dark' })
      },
    }),
    { 
      name: 'theme',
      partialize: (state) => ({ 
        theme: state.theme,
        primeTheme: state.primeTheme 
      }),
    },
  ),
)

// Load PrimeReact theme CSS dynamically
export const loadPrimeReactTheme = (themeName: PrimeReactTheme) => {
  // Remove existing PrimeReact theme link
  const existingLink = document.getElementById('primereact-theme')
  if (existingLink) {
    existingLink.remove()
  }

  // Create new link element for the theme
  const link = document.createElement('link')
  link.id = 'primereact-theme'
  link.rel = 'stylesheet'
  link.href = `https://unpkg.com/primereact/resources/themes/${themeName}/theme.css`
  document.head.appendChild(link)

  // Persist to localStorage
  localStorage.setItem(PRIMEREACT_THEME_STORAGE_KEY, themeName)
}

// Get saved theme from localStorage
export const getSavedPrimeTheme = (): PrimeReactTheme => {
  const saved = localStorage.getItem(PRIMEREACT_THEME_STORAGE_KEY)
  return (saved as PrimeReactTheme) || 'lara-light-blue'
}

// Initialize theme on app startup
export const initializeTheme = () => {
  const savedTheme = getSavedPrimeTheme()
  const isLight = savedTheme.includes('light')
  document.documentElement.dataset.theme = isLight ? 'light' : 'dark'
  return savedTheme
}
