import { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { useData } from '../../context/DataContext'
import { useTranslation } from '../../i18n/useTranslation'
import './admin.css'

export function AdminLayout() {
  const [clock, setClock] = useState('00:00:00')
  const [authChecked, setAuthChecked] = useState(false)
  const { products, orders, useFirebase } = useData()
  const navigate = useNavigate()
  const location = useLocation()
  const t = useTranslation()

  useEffect(() => {
    setAuthChecked(true)
  }, [])

  useEffect(() => {
    if (!authChecked) return
    const clockInterval = setInterval(() => setClock(new Date().toLocaleTimeString('he-IL')), 1000)
    return () => clearInterval(clockInterval)
  }, [authChecked])

  const isLoggedIn = sessionStorage.getItem('adminLoggedIn') === 'true'
  const panel = (location.pathname.match(/\/admin\/([^/]+)/) || [])[1] || 'orders'

  if (!authChecked) {
    return <div className="admin-root admin-auth-check" aria-hidden="true" />
  }

  if (!isLoggedIn) {
    return <Navigate to="/adminLogin" replace />
  }

  return (
    <div className="admin-root">
      <aside className="admin-aside">
        <div className="admin-brand">
          <h1>ROTEM BAR</h1>
          <p className="admin-brand-version">{t('admin.panelVersion')}</p>
        </div>
        <nav className="admin-nav">
          <button
            type="button"
            className={`admin-nav-link ${panel === 'orders' ? 'active' : ''}`}
            onClick={() => navigate('/admin/orders')}
          >
            <span>{t('admin.nav.orders')}</span>
            {orders.length > 0 && (
              <span className="admin-counter-badge">{orders.length}</span>
            )}
          </button>
          <button
            type="button"
            className={`admin-nav-link ${panel === 'products' ? 'active' : ''}`}
            onClick={() => navigate('/admin/products')}
          >
            <span>{t('admin.nav.products')}</span>
          </button>
          <button
            type="button"
            className={`admin-nav-link ${panel === 'site' ? 'active' : ''}`}
            onClick={() => navigate('/admin/site')}
          >
            <span>{t('admin.nav.site')}</span>
          </button>
        </nav>
        <div className="admin-aside-footer">
          <button
            type="button"
            className="admin-btn-danger admin-btn-full"
            onClick={() => {
              if (window.confirm(t('admin.resetConfirm'))) {
                localStorage.clear()
                sessionStorage.clear()
                window.location.reload()
              }
            }}
          >
            {t('admin.resetSystem')}
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <div className="admin-top-bar">
          <h2>{t('admin.welcome')}</h2>
          <div className="admin-clock">{clock}</div>
        </div>
        <div className="admin-summary-grid">
          <div className="admin-stat-box">
            <span>{t('admin.stats.orders')}</span>
            <h2>{orders.length}</h2>
          </div>
          <div className="admin-stat-box">
            <span>{t('admin.stats.products')}</span>
            <h2>{products.length}</h2>
          </div>
          <div className="admin-stat-box">
            <span>{t('admin.stats.connection')}</span>
            <h2 className={useFirebase ? 'admin-stat-firebase' : 'admin-stat-online'}>
              {useFirebase ? 'FIREBASE' : 'ONLINE'}
            </h2>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  )
}

