import { Navigate, Outlet } from 'react-router-dom'

/**
 * Protects /admin routes: redirects to /adminLogin if not authenticated.
 * Renders the dashboard (Outlet) only when logged in. No login UI on admin.
 */
export function AdminGuard() {
  const isLoggedIn =
    typeof window !== 'undefined' && sessionStorage.getItem('adminLoggedIn') === 'true'
  if (!isLoggedIn) {
    return <Navigate to="/adminLogin" replace />
  }
  return <Outlet />
}
