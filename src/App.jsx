import { Routes, Route, Navigate, Outlet } from 'react-router-dom'
import { DataProvider } from './context/DataContext'
import { CartProvider } from './context/CartContext'
import { PublicLayout } from './components/PublicLayout'
import { Home } from './pages/Home'
import { About } from './pages/About'
import { Shop } from './pages/Shop'
import { Contact } from './pages/Contact'
import { AdminLayout } from './pages/admin/AdminLayout'
import { AdminLogin } from './pages/admin/AdminLogin'
import { AdminGuard } from './pages/admin/AdminGuard'
import { AdminRedirect } from './pages/admin/AdminRedirect'
import { AdminOrders } from './pages/admin/AdminOrders'
import { AdminProducts } from './pages/admin/AdminProducts'
import { AdminSite } from './pages/admin/AdminSite'

export default function App() {
  return (
    <DataProvider>
      <CartProvider>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
          {/* Login: standalone page at /adminLogin; no login on /admin */}
          <Route path="/adminLogin" element={<AdminLogin />} />
          {/* Admin: guard redirects to /adminLogin if not authenticated; no login card here */}
          <Route path="/admin" element={<AdminGuard />}>
            <Route index element={<AdminRedirect />} />
            <Route path="orders" element={<AdminLayout />}>
              <Route index element={<AdminOrders />} />
            </Route>
            <Route path="products" element={<AdminLayout />}>
              <Route index element={<AdminProducts />} />
            </Route>
            <Route path="site" element={<AdminLayout />}>
              <Route index element={<AdminSite />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CartProvider>
    </DataProvider>
  )
}
