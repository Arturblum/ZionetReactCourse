import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type Theme = 'light' | 'dark'

type ThemeStore = {
  theme: Theme
  // eslint-disable-next-line no-unused-vars
  setTheme: (theme: Theme) => void
  toggleTheme: () => void
}

export const useThemeStore = create<ThemeStore>()(
  persist(
    (set, get) => ({
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => {
        const current = get().theme
        set({ theme: current === 'dark' ? 'light' : 'dark' })
      },
    }),
    { name: 'theme' },
  ),
)
