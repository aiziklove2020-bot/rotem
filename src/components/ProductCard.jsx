import { useCart } from '../context/CartContext'
import { useTranslation } from '../i18n/useTranslation'

export function ProductCard({ product }) {
  const { addToCart } = useCart()
  const t = useTranslation()
  const isOut = product.stock === 'out-of-stock'

  const media = product.image ? (
    <img src={product.image} className="card-product-img" alt={product.name} />
  ) : (
    <div style={{ fontSize: '4rem', marginBottom: '15px' }}>{product.emoji || '🕯️'}</div>
  )

  return (
    <div className="card">
      {media}
      {isOut && (
        <span
          style={{
            background: '#e74c3c',
            color: 'white',
            fontSize: '0.75rem',
            padding: '3px 12px',
            borderRadius: '20px',
            display: 'inline-block',
            marginBottom: '8px',
          }}
        >
          {t('product.outOfStock')}
        </span>
      )}
      <h3 style={{ marginBottom: '8px' }}>{product.name}</h3>
      {product.description && (
        <p style={{ color: 'var(--sea-medium)', fontSize: '0.9rem', marginBottom: '10px' }}>
          {product.description}
        </p>
      )}
      <p style={{ color: 'var(--accent-gold)', fontWeight: 'bold', fontSize: '1.2rem', marginBottom: '15px' }}>
        ₪{product.price}
      </p>
      <button
        type="button"
        className="btn-action"
        style={{ padding: '10px 20px', fontSize: '0.9rem' }}
        onClick={() => addToCart(product)}
        disabled={isOut}
      >
        {isOut ? t('product.outOfStock') : t('product.addToCart')}
      </button>
    </div>
  )
}
