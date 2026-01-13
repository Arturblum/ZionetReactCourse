import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useCart } from '../contexts'

const CartSidebar = () => {
  const { isOpen, items, close, removeItem, clear } = useCart()
  const { t } = useTranslation(['common'])

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
        aria-label={t('cart.title')}
        role="complementary"
      >
        <div className="sidebar-header">
          <h2>{t('cart.title')}</h2>
          <button type="button" onClick={close}>
            {t('button.close')}
          </button>
        </div>

        {items.length === 0 ? (
          <p className="muted">{t('cart.empty')}</p>
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
                      {t('cart.quantity')} {item.quantity} · ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                  <button type="button" onClick={() => removeItem(item.id)}>
                    {t('button.remove')}
                  </button>
                </li>
              ))}
            </ul>
            <div className="cart-footer">
              <div>
                <span className="muted">{t('cart.total')}</span>
                <div>
                  <strong>${total.toFixed(2)}</strong>
                </div>
              </div>
              <button type="button" onClick={clear}>
                {t('button.clear')}
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  )
}

export default CartSidebar
