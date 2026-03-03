import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useTranslation } from '../i18n/useTranslation'
import { getProductImages } from '../utils/productImages'
import { ImageLightbox } from './ImageLightbox'

export function ProductDetailModal({ product, open, onClose }) {
  const { addToCart } = useCart()
  const t = useTranslation()
  const imageList = getProductImages(product)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)
  const isOut = product?.stock === 'out-of-stock'
  const currentSrc = imageList[currentIndex]

  const goPrev = () => setCurrentIndex((i) => (i - 1 + imageList.length) % imageList.length)
  const goNext = () => setCurrentIndex((i) => (i + 1) % imageList.length)

  if (!open || !product) return null

  return (
    <>
      <div
        className={`product-detail-overlay ${open ? 'open' : ''}`}
        onClick={(e) => e.target === e.currentTarget && onClose()}
        role="dialog"
        aria-modal="true"
        aria-label={product.name}
      >
        <div className="product-detail-modal" onClick={(e) => e.stopPropagation()}>
          <button type="button" className="product-detail-close" onClick={onClose} aria-label={t('product.close')}>
            ✕
          </button>
          {imageList.length > 0 ? (
            <>
              <div
                className="detail-media"
                onClick={() => setLightboxOpen(true)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setLightboxOpen(true)}
                aria-label={t('product.clickToEnlarge')}
              >
                <img src={currentSrc} alt={product.name} />
                {imageList.length > 1 && (
                  <>
                    <button type="button" className="detail-nav prev" onClick={(e) => { e.stopPropagation(); goPrev(); }} aria-label={t('product.prevImage')}>
                      ‹
                    </button>
                    <button type="button" className="detail-nav next" onClick={(e) => { e.stopPropagation(); goNext(); }} aria-label={t('product.nextImage')}>
                      ›
                    </button>
                  </>
                )}
              </div>
              {imageList.length > 1 && (
                <div className="detail-dots">
                  {imageList.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      className={`detail-dot ${i === currentIndex ? 'active' : ''}`}
                      onClick={() => setCurrentIndex(i)}
                      aria-label={`${t('product.nextImage')} ${i + 1}`}
                    />
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="detail-media" style={{ fontSize: '4rem' }}>
              {product.emoji || '🕯️'}
            </div>
          )}
          <h3 style={{ marginBottom: '8px', color: 'var(--sea-deep)' }}>{product.name}</h3>
          {product.description && (
            <p className="card-description" style={{ color: 'var(--sea-medium)', fontSize: '0.95rem', marginBottom: '1rem', whiteSpace: 'pre-wrap' }}>
              {product.description}
            </p>
          )}
          <p style={{ color: 'var(--accent-gold)', fontWeight: 'bold', fontSize: '1.3rem', marginBottom: '1rem' }}>
            ₪{product.price}
          </p>
          <button
            type="button"
            className="btn-action"
            onClick={() => { addToCart(product); onClose(); }}
            disabled={isOut}
          >
            {isOut ? t('product.outOfStock') : t('product.addToCart')}
          </button>
        </div>
      </div>
      <ImageLightbox
        open={lightboxOpen}
        src={currentSrc}
        images={imageList}
        currentIndex={currentIndex}
        onClose={() => setLightboxOpen(false)}
        onPrev={goPrev}
        onNext={goNext}
      />
    </>
  )
}
