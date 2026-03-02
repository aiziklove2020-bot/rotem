import { useState } from 'react'
import { useNavigate, Navigate } from 'react-router-dom'
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

export function AdminLogin() {
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [loginError, setLoginError] = useState(false)
  const navigate = useNavigate()
  const t = useTranslation()

  if (sessionStorage.getItem('adminLoggedIn') === 'true') {
    return <Navigate to="/admin/orders" replace />
  }

  const handleLogin = (e) => {
    e?.preventDefault()
    const cred = getCredentials()
    if (user === cred.username && pass === cred.password) {
      sessionStorage.setItem('adminLoggedIn', 'true')
      setLoginError(false)
      navigate('/admin/orders', { replace: true })
    } else {
      setLoginError(true)
      setPass('')
    }
  }

  return (
    <div className="admin-root admin-login-page">
      <div className="admin-login-overlay">
        <h2 className="admin-login-title">{t('admin.loginTitle')}</h2>
        <p className="admin-login-subtitle">{t('admin.loginSubtitle')}</p>
        <form onSubmit={handleLogin} className="admin-login-form">
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
            className="admin-login-input admin-login-input-password"
            placeholder={t('admin.passwordPlaceholder')}
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            dir="rtl"
          />
          <button type="submit" className="admin-btn-ui admin-btn-full admin-login-submit">
            {t('admin.loginButton')}
          </button>
        </form>
        {loginError && <p className="admin-login-error">{t('admin.loginError')}</p>}
      </div>
    </div>
  )
}
