import { Link, Route, Routes } from 'react-router-dom'
import './App.css'
import About from './About'
import CheckInForm from './CheckInForm'
import Products from './Products'

function App() {
  return (
    <div className="app-shell">
      <header className="nav">
        <h1>Contact info</h1>
        <nav className="nav-links">
          <Link to="/">Home</Link>
          <Link to="/about">About</Link>
          <Link to="/products">Products</Link>
        </nav>
      </header>

      <Routes>
        <Route path="/" element={<CheckInForm />} />
        <Route path="/about" element={<About />} />
        <Route path="/products" element={<Products />} />
      </Routes>
    </div>
  )
}

export default App
