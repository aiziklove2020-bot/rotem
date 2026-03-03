import { useState } from 'react'
import { useCart } from '../context/CartContext'
import { useData } from '../context/DataContext'
import { useTranslation } from '../i18n/useTranslation'

export function CheckoutModal({ open, onClose }) {
  const { cart, total, clearCart } = useCart()
  const { addOrder } = useData()
  const t = useTranslation()
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || !phone.trim()) {
      window.alert(t('checkout.fillNamePhone'))
      return
    }
    const order = {
      id: Date.now(),
      date: new Date().toISOString(),
      customer: { name: name.trim(), phone: phone.trim(), email: email.trim() },
      items: cart.map((i) => ({ ...i, quantity: i.qty || 1 })),
      total,
    }
    try {
      await addOrder(order)
      clearCart()
      setName('')
      setPhone('')
      setEmail('')
      onClose()
      window.alert(t('checkout.thankYou', { name: name.trim() }))
    } catch (err) {
      window.alert(t('checkout.saveFailed') || 'Order was saved locally but could not sync. Please try again or contact us.')
    }
  }

  if (!open) return null

  return (
    <div className="modal-bg open" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <h2>{t('checkout.title')}</h2>
        <form onSubmit={handleSubmit}>
          <div className="checkout-field">
            <label htmlFor="orderName">{t('checkout.name')}</label>
            <input
              id="orderName"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('checkout.namePlaceholder')}
            />
          </div>
          <div className="checkout-field">
            <label htmlFor="orderPhone">{t('checkout.phone')}</label>
            <input
              id="orderPhone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder={t('checkout.phonePlaceholder')}
            />
          </div>
          <div className="checkout-field">
            <label htmlFor="orderEmail">{t('checkout.email')}</label>
            <input
              id="orderEmail"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('checkout.emailPlaceholder')}
            />
          </div>
          <button type="submit" className="btn-action" style={{ width: '100%', padding: '14px', marginTop: '0.5rem' }}>
            {t('checkout.submit')}
          </button>
        </form>
        <button type="button" className="modal-cancel" onClick={onClose}>
          {t('checkout.backToCart')}
        </button>
      </div>
    </div>
  )
}
