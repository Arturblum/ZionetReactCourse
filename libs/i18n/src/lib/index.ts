import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import en from './locales/en.json'
import he from './locales/he.json'

export const LANGUAGE_STORAGE_KEY = 'app-language'

export const isRtlLang = (language: string) => language === 'he'

export const saveLanguagePreference = (language: string) => {
  localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
}

i18n
  .use(initReactI18next)
  .init({
    resources: { en, he },
    lng: 'en',
    fallbackLng: 'en',
    ns: ['common', 'products', 'checkin'],
    defaultNS: 'common',
    interpolation: {
      escapeValue: false,
    },
  })

export default i18n
