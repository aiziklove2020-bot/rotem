import { useCart } from '../context/CartContext'
import { useTranslation } from '../i18n/useTranslation'

export function CartSidebar({ open, onClose, onCheckout }) {
  const { cart, changeQty, total } = useCart()
  const t = useTranslation()

  return (
    <div className={`cart-overlay ${open ? 'open' : ''}`} onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="cart-panel" onClick={(e) => e.stopPropagation()}>
        <div className="cart-header">
          <h2>🛒 {t('cart.title')}</h2>
          <button type="button" className="cart-close" onClick={onClose} aria-label={t('cart.close')}>
            ✕
          </button>
        </div>
        <div className="cart-items">
          {!cart.length ? (
            <div className="cart-empty">
              <div className="cart-empty-icon">🛒</div>
              <p>{t('cart.empty')}</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="cart-thumb">
                  {item.image ? <img src={item.image} alt={item.name} /> : (item.emoji || '🕯️')}
                </div>
                <div className="cart-item-info">
                  <div className="cart-item-name">{item.name}</div>
                  <div className="cart-item-price">₪{item.price}</div>
                </div>
                <div className="cart-qty">
                  <button type="button" className="qty-btn" onClick={() => changeQty(item.id, -1)}>
                    −
                  </button>
                  <span>{item.qty || 1}</span>
                  <button type="button" className="qty-btn" onClick={() => changeQty(item.id, 1)}>
                    +
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
        {cart.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total">
              <span>{t('cart.total')}</span>
              <span>₪{total}</span>
            </div>
            <button type="button" className="btn-action" style={{ width: '100%', padding: '12px' }} onClick={onCheckout}>
              {t('cart.toCheckout')}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
