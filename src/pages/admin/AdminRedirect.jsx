import { Navigate } from 'react-router-dom'

/**
 * Renders only for the exact path /admin.
 * Redirects to /adminLogin if not authenticated, otherwise to /admin/orders.
 */
export function AdminRedirect() {
  const isLoggedIn = typeof window !== 'undefined' && sessionStorage.getItem('adminLoggedIn') === 'true'
  if (isLoggedIn) {
    return <Navigate to="/admin/orders" replace />
  }
  return <Navigate to="/adminLogin" replace />
}
