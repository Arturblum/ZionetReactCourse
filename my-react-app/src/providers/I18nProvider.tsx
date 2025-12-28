import { type ReactNode, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import '../i18n'

export const LANGUAGE_STORAGE_KEY = 'app-language'

export const saveLanguagePreference = (language: string) => {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
}

type I18nProviderProps = {
  children: ReactNode
}

export function I18nProvider({ children }: I18nProviderProps) {
  const { i18n } = useTranslation()

  // Restore language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY)
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage)
    }
  }, [i18n])

  // Set RTL mode for Hebrew language
  useEffect(() => {
    const isRTL = i18n.language === 'he'
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    document.documentElement.lang = i18n.language
  }, [i18n.language])

  return <>{children}</>
}
