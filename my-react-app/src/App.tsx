import { Link, Route, Routes } from 'react-router-dom'
import './App.css'
import { CartSidebar, ToastHost } from './components'
import { useCart } from './contexts'
import { About, CheckInForm, ProductDetail, Products } from './pages'
import { useThemeStore } from './stores'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'

const LANGUAGE_STORAGE_KEY = 'app-language'

function App() {
  const { isOpen, toggle, items } = useCart()
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)
  const { t, i18n } = useTranslation(['common'])

  // Restore language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY)
    if (savedLanguage && savedLanguage !== i18n.language) {
      i18n.changeLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  const switchLanguage = () => {
    const newLanguage = i18n.language === 'en' ? 'he' : 'en'
    i18n.changeLanguage(newLanguage)
    localStorage.setItem(LANGUAGE_STORAGE_KEY, newLanguage)
  }

  return (
    <div className="app-shell">
      <header className="nav">
        <h1>{t('header.title')}</h1>
        <nav className="nav-links">
          <Link to="/">{t('header.home')}</Link>
          <Link to="/about">{t('header.about')}</Link>
          <Link to="/products">{t('header.products')}</Link>
          <button
            type="button"
            onClick={toggle}
            aria-expanded={isOpen}
            aria-controls="global-cart"
          >
            {t('header.cart', { count: items.length })}
          </button>
          <button type="button" onClick={toggleTheme}>
            {t('header.theme', { theme })}
          </button>
          <button type="button" onClick={switchLanguage}>
            {t('header.language', { language: i18n.language === 'en' ? 'English' : 'עברית' })}
          </button>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<CheckInForm />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:id" element={<ProductDetail />} />
      </Routes>
      <CartSidebar />
      <ToastHost />
    </div>
  )
}

export default App
