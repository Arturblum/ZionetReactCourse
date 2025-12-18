import { Link, Route, Routes } from 'react-router-dom'
import './App.css'
import About from './About'
import CheckInForm from './CheckInForm'
import ProductDetail from './pages/ProductDetail'
import Products from './pages/Products'
import CartSidebar from './cart/CartSidebar'
import { useCart } from './cart/CartContext'
import ToastHost from './toast/ToastHost'

function App() {
  const { isOpen, toggle, items } = useCart()

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
