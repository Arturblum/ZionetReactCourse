import { useEffect, useState } from 'react'

function canUseLocalStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

export default function useLocalStorageState<T>(key: string, defaultValue: T) {
  const [value, setValue] = useState<T>(() => {
    if (!canUseLocalStorage()) return defaultValue
    try {
      const stored = window.localStorage.getItem(key)
      if (stored === null) return defaultValue
      return JSON.parse(stored) as T
    } catch {
      return defaultValue
    }
  })

  useEffect(() => {
    if (!canUseLocalStorage()) return
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Ignore quota/security errors and keep in-memory state.
    }
  }, [key, value])

  return [value, setValue] as const
}

