import { useEffect, useMemo } from 'react'
import { useCart } from '../../contexts/CartContext'

const CartSidebar = () => {
  const { isOpen, items, close, removeItem, clear } = useCart()

  useEffect(() => {
    if (!isOpen) return
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') close()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, close])

  const total = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items],
  )

  return (
    <div className="sidebar-overlay" data-open={isOpen} aria-hidden={!isOpen}>
      <button
        type="button"
        className="sidebar-backdrop"
        aria-label="Close cart"
        onClick={close}
      />
      <aside
        id="global-cart"
        className="sidebar-panel"
        aria-label="Cart"
        role="complementary"
      >
        <div className="sidebar-header">
          <h2>Cart</h2>
          <button type="button" onClick={close}>
            Close
          </button>
        </div>

        {items.length === 0 ? (
          <p className="muted">Your cart is empty.</p>
        ) : (
          <>
            <ul className="cart-list">
              {items.map((item) => (
                <li key={item.id} className="cart-item">
                  <img className="cart-thumb" src={item.thumbnail} alt={item.title} />
                  <div className="cart-item-main">
                    <div className="cart-item-title">
                      <strong>{item.title}</strong>
                    </div>
                    <div className="muted small">
                      Qty {item.quantity} · ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                  <button type="button" onClick={() => removeItem(item.id)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div className="cart-footer">
              <div>
                <span className="muted">Total</span>
                <div>
                  <strong>${total.toFixed(2)}</strong>
                </div>
              </div>
              <button type="button" onClick={clear}>
                Clear
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}

export default CartSidebar
