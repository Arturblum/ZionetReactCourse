import { Link, Route, Routes } from 'react-router-dom'
import './App.css'
import About from './pages/About'
import CheckInForm from './pages/CheckInForm'
import { ProductDetail } from './pages/ProductDetail'
import Products from './pages/Products'
import CartSidebar from './components/CartSidebar'
import { useCart } from './contexts/CartContext'
import ToastHost from './components/ToastHost'
import { useThemeStore } from './stores/theme'
import { useEffect } from 'react'

function App() {
  const { isOpen, toggle, items } = useCart()
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return (
    <div className="app-shell">
      <header className="nav">
        <h1>Contact info</h1>
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/products">Products</Link>
          <button
            type="button"
            onClick={toggle}
            aria-expanded={isOpen}
            aria-controls="global-cart"
          >
            Cart ({items.length})
          </button>
          <button type="button" onClick={toggleTheme}>
            Theme: {theme}
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
