import { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useData } from '../../context/DataContext'
import { useTranslation } from '../../i18n/useTranslation'
import './admin.css'

const CREDENTIALS_KEY = 'adminCredentials'
const defaultCredentials = { username: 'Rotem_bar_art', password: '75546960AB@' }

function getCredentials() {
  try {
    return JSON.parse(localStorage.getItem(CREDENTIALS_KEY)) || defaultCredentials
  } catch {
    return defaultCredentials
  }
}

export function AdminLayout() {
  const [loggedIn, setLoggedIn] = useState(() => sessionStorage.getItem('adminLoggedIn') === 'true')
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [loginError, setLoginError] = useState(false)
  const [clock, setClock] = useState('00:00:00')
  const { products, orders, useFirebase } = useData()
  const navigate = useNavigate()
  const location = useLocation()
  const t = useTranslation()

  useEffect(() => {
    const t = setInterval(() => setClock(new Date().toLocaleTimeString('he-IL')), 1000)
    return () => clearInterval(t)
  }, [])

  const handleLogin = (e) => {
    e?.preventDefault()
    const cred = getCredentials()
    if (user === cred.username && pass === cred.password) {
      sessionStorage.setItem('adminLoggedIn', 'true')
      setLoggedIn(true)
      setLoginError(false)
      navigate('/admin/orders')
    } else {
      setLoginError(true)
      setPass('')
    }
  }

  const panel = location.pathname.split('/').filter(Boolean)[1] || 'orders'

  if (!loggedIn) {
    return (
      <div className="admin-root">
        <div className="admin-login-overlay">
          <div className="admin-login-card">
            <h2>{t('admin.loginTitle')}</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '25px' }}>{t('admin.loginSubtitle')}</p>
            <form onSubmit={handleLogin}>
              <input
                type="text"
                className="admin-login-input"
                placeholder={t('admin.usernamePlaceholder')}
                value={user}
                onChange={(e) => setUser(e.target.value)}
                dir="rtl"
              />
              <input
                type="password"
                className="admin-login-input"
                style={{ letterSpacing: '5px', fontSize: '1.2rem' }}
                placeholder={t('admin.passwordPlaceholder')}
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                dir="rtl"
              />
              <button type="submit" className="admin-btn-ui" style={{ width: '100%', marginTop: '10px' }}>
                {t('admin.loginButton')}
              </button>
            </form>
            {loginError && (
              <p style={{ color: 'var(--status-red)', marginTop: '20px', fontSize: '0.9rem' }}>
                {t('admin.loginError')}
              </p>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="admin-root">
      <aside className="admin-aside">
        <div className="admin-brand">
          <h1>ROTEM BAR</h1>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '5px' }}>{t('admin.panelVersion')}</p>
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
        <div style={{ padding: '20px', borderTop: '1px solid var(--border-color)' }}>
          <button
            type="button"
            className="admin-btn-danger"
            style={{ width: '100%' }}
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
            <h2
              style={{
                color: useFirebase ? 'var(--accent-gold)' : 'var(--status-green)',
                fontSize: '1.2rem',
              }}
            >
              {useFirebase ? 'FIREBASE' : 'ONLINE'}
            </h2>
          </div>
        </div>
        <Outlet />
      </main>
    </div>
  )
}

