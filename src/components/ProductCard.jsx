import { useState, useEffect } from 'react'
import { useCart } from '../context/CartContext'
import { useTranslation } from '../i18n/useTranslation'
import { getProductImages } from '../utils/productImages'
import { ProductDetailModal } from './ProductDetailModal'

const DESCRIPTION_PREVIEW_LINES = 2
const CAROUSEL_INTERVAL_MS = 4000

export function ProductCard({ product }) {
  const { addToCart } = useCart()
  const t = useTranslation()
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const imageList = getProductImages(product)
  const isOut = product.stock === 'out-of-stock'
  const desc = product.description || ''
  const lines = desc.split(/\r?\n/)
  const needsToggle = lines.length > DESCRIPTION_PREVIEW_LINES
  const displayDesc = needsToggle
    ? lines.slice(0, DESCRIPTION_PREVIEW_LINES).join('\n').trim() + '…'
    : desc

  useEffect(() => {
    if (imageList.length <= 1) return
    const id = setInterval(() => {
      setCarouselIndex((i) => (i + 1) % imageList.length)
    }, CAROUSEL_INTERVAL_MS)
    return () => clearInterval(id)
  }, [imageList.length])

  const goPrev = () => setCarouselIndex((i) => (i - 1 + imageList.length) % imageList.length)
  const goNext = () => setCarouselIndex((i) => (i + 1) % imageList.length)

  const media =
    imageList.length > 0 ? (
      <div className="card-media">
        <img
          src={imageList[carouselIndex]}
          className="card-product-img"
          alt={product.name}
        />
        {imageList.length > 1 && (
          <>
            <button
              type="button"
              className="card-carousel-nav card-carousel-prev"
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              aria-label={t('product.prevImage')}
            >
              ›
            </button>
            <button
              type="button"
              className="card-carousel-nav card-carousel-next"
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              aria-label={t('product.nextImage')}
            >
              ‹
            </button>
            <div className="card-carousel-dots">
              {imageList.map((_, i) => (
                <span
                  key={i}
                  className={`card-carousel-dot ${i === carouselIndex ? 'active' : ''}`}
                  aria-hidden
                />
              ))}
            </div>
          </>
        )}
      </div>
    ) : (
      <div className="card-media" style={{ fontSize: '4rem' }}>{product.emoji || '🕯️'}</div>
    )

  return (
    <div className={`card ${detailModalOpen ? 'card-detail-open' : ''}`}>
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
      {desc && (
        <p className="card-description" style={{ color: 'var(--sea-medium)', fontSize: '0.9rem', marginBottom: '10px' }}>
          {displayDesc}
          {needsToggle && (
            <button
              type="button"
              className="card-read-more"
              onClick={() => setDetailModalOpen(true)}
            >
              {t('product.readMore')}
            </button>
          )}
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
      <ProductDetailModal product={product} open={detailModalOpen} onClose={() => setDetailModalOpen(false)} />
    </div>
  )
}
