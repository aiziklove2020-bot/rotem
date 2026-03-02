import { NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useTranslation } from '../i18n/useTranslation'

export function Nav({ onOpenCart }) {
  const { count } = useCart()
  const navigate = useNavigate()
  const t = useTranslation()

  return (
    <nav className="nav-bar">
      <button
        type="button"
        className="btn-action"
        style={{ margin: 0, padding: '8px 20px' }}
        onClick={onOpenCart}
      >
        🛒 ({count})
      </button>
      <div className="nav-links">
        <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>{t('nav.home')}</NavLink>
        <NavLink to="/about" className={({ isActive }) => (isActive ? 'active' : '')}>{t('nav.about')}</NavLink>
        <NavLink to="/shop" className={({ isActive }) => (isActive ? 'active' : '')}>{t('nav.shop')}</NavLink>
        <NavLink to="/contact" className={({ isActive }) => (isActive ? 'active' : '')}>{t('nav.contact')}</NavLink>
      </div>
      <div
        className="nav-brand"
        onClick={() => navigate('/')}
        onKeyDown={(e) => e.key === 'Enter' && navigate('/')}
        role="button"
        tabIndex={0}
      >
        ROTEM BAR
      </div>
    </nav>
  )
}
