import { Link, Route, Routes } from 'react-router-dom'
import './App.css'
import { CartSidebar, ToastHost } from '@my-app/ui'
import { useCart, useThemeStore, type PrimeReactTheme } from '@my-app/hooks'
import { About, CheckInForm, ProductDetail, Products } from './pages'
import { useTranslation } from 'react-i18next'
import { saveLanguagePreference } from '@my-app/i18n'

const PRIMEREACT_THEMES: { label: string; value: PrimeReactTheme }[] = [
  { label: 'Lara Light Blue', value: 'lara-light-blue' },
  { label: 'Lara Dark Blue', value: 'lara-dark-blue' },
  { label: 'Lara Light Indigo', value: 'lara-light-indigo' },
  { label: 'Lara Dark Indigo', value: 'lara-dark-indigo' },
]

function App() {
  const { isOpen, toggle, items } = useCart()
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)
  const primeTheme = useThemeStore((s) => s.primeTheme)
  const setPrimeTheme = useThemeStore((s) => s.setPrimeTheme)
  const { t, i18n } = useTranslation(['common'])

  const switchLanguage = () => {
    const newLanguage = i18n.language === 'en' ? 'he' : 'en'
    i18n.changeLanguage(newLanguage)
    saveLanguagePreference(newLanguage)
  }

  const handlePrimeThemeChange = (newTheme: PrimeReactTheme) => {
    setPrimeTheme(newTheme)
  }

  return (
    <div className="app-shell">
      <header className="nav">
        <h1>{t('header.title')}</h1>
        <nav className="nav-links">
          <Link className="nav-tab nav-tab--form" to="/">
            Form
          </Link>
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
          <select 
            value={primeTheme} 
            onChange={(e) => handlePrimeThemeChange(e.target.value as PrimeReactTheme)}
            style={{ padding: '0.5rem', borderRadius: '4px' }}
          >
            {PRIMEREACT_THEMES.map((theme) => (
              <option key={theme.value} value={theme.value}>
                {theme.label}
              </option>
            ))}
          </select>
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
