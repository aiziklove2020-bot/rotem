import { useEffect } from 'react'
import { useTranslation } from '../i18n/useTranslation'

export function ImageLightbox({ open, src, images = [], currentIndex = 0, onClose, onPrev, onNext }) {
  const t = useTranslation()
  const hasMultiple = images.length > 1

  useEffect(() => {
    if (!open) return
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev?.()
      if (e.key === 'ArrowRight') onNext?.()
    }
    window.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose, onPrev, onNext])

  if (!open) return null

  return (
    <div
      className="lightbox-overlay"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      role="dialog"
      aria-modal="true"
      aria-label={t('product.clickToEnlarge')}
    >
      <button type="button" className="lightbox-close" onClick={onClose} aria-label={t('product.close')}>
        ✕
      </button>
      {hasMultiple && (
        <>
          <button type="button" className="lightbox-nav lightbox-prev" onClick={onPrev} aria-label={t('product.prevImage')}>
            ‹
          </button>
          <button type="button" className="lightbox-nav lightbox-next" onClick={onNext} aria-label={t('product.nextImage')}>
            ›
          </button>
        </>
      )}
      <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
        <img src={src} alt="" className="lightbox-img" />
      </div>
    </div>
  )
}
