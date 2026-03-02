import { Routes, Route, Navigate } from 'react-router-dom'
import { DataProvider } from './context/DataContext'
import { CartProvider } from './context/CartContext'
import { PublicLayout } from './components/PublicLayout'
import { Home } from './pages/Home'
import { About } from './pages/About'
import { Shop } from './pages/Shop'
import { Contact } from './pages/Contact'
import { AdminLayout } from './pages/admin/AdminLayout'
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
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="orders" replace />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="site" element={<AdminSite />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </CartProvider>
    </DataProvider>
  )
}
