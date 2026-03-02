import { createContext, useContext, useState, useEffect } from 'react'

const CART_KEY = 'cart'
const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem(CART_KEY) || '[]'))

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart))
  }, [cart])

  const addToCart = (product, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id)
      if (existing) {
        return prev.map(i => i.id === product.id ? { ...i, qty: (i.qty || 1) + qty } : i)
      }
      return [...prev, { ...product, qty }]
    })
  }

  const changeQty = (productId, delta) => {
    setCart(prev => {
      const item = prev.find(i => i.id === productId)
      if (!item) return prev
      const newQty = (item.qty || 1) + delta
      if (newQty <= 0) return prev.filter(i => i.id !== productId)
      return prev.map(i => i.id === productId ? { ...i, qty: newQty } : i)
    })
  }

  const clearCart = () => setCart([])

  const count = cart.reduce((s, i) => s + (i.qty || 1), 0)
  const total = cart.reduce((s, i) => s + (i.price || 0) * (i.qty || 1), 0)

  return (
    <CartContext.Provider value={{ cart, addToCart, changeQty, clearCart, count, total }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
