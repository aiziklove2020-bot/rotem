import { createContext, useContext, useEffect, useState } from 'react'
import { collection, getDocs, doc, setDoc, deleteDoc, updateDoc, orderBy, query } from 'firebase/firestore'
import { db } from '../lib/firebase'

const DataContext = createContext(null)

const PRODUCTS_KEY = 'products'
const ORDERS_KEY = 'orders'
const SOCIAL_KEY = 'socialLinks'
const CONTENT_KEY = 'siteContent'

export function DataProvider({ children }) {
  const [products, setProducts] = useState(() => JSON.parse(localStorage.getItem(PRODUCTS_KEY) || '[]'))
  const [orders, setOrders] = useState(() => JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]'))
  const [socialLinks, setSocialLinksState] = useState(() => JSON.parse(localStorage.getItem(SOCIAL_KEY) || '{}'))
  const [siteContent, setSiteContentState] = useState(() => JSON.parse(localStorage.getItem(CONTENT_KEY) || '{}'))
  const [useFirebase, setUseFirebase] = useState(false)

  useEffect(() => {
    let mounted = true
    async function init() {
      try {
        const snapProducts = await getDocs(collection(db, 'products'))
        if (mounted && snapProducts.docs.length >= 0) {
          const list = snapProducts.docs.map(d => ({ id: d.id, ...d.data() }))
          setProducts(list)
          localStorage.setItem(PRODUCTS_KEY, JSON.stringify(list))
          setUseFirebase(true)
        }
      } catch {
        setUseFirebase(false)
      }
    }
    init()
    return () => { mounted = false }
  }, [])

  useEffect(() => {
    if (!useFirebase) return
    let mounted = true
    async function loadOrders() {
      try {
        const q = query(collection(db, 'orders'), orderBy('date', 'desc'))
        const snap = await getDocs(q)
        if (mounted) {
          const list = snap.docs.map(d => ({ ...d.data(), id: d.id }))
          setOrders(list)
          localStorage.setItem(ORDERS_KEY, JSON.stringify(list))
        }
      } catch {}
    }
    loadOrders()
    return () => { mounted = false }
  }, [useFirebase])

  const setSocialLinks = (links) => {
    setSocialLinksState(links)
    localStorage.setItem(SOCIAL_KEY, JSON.stringify(links))
  }

  const setSiteContent = (content) => {
    setSiteContentState(content)
    localStorage.setItem(CONTENT_KEY, JSON.stringify(content))
  }

  const addProduct = async (product) => {
    const id = 'prod_' + Date.now()
    const data = { ...product }
    setProducts(prev => {
      const next = [{ id, ...data }, ...prev]
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(next))
      return next
    })
    if (useFirebase) {
      try {
        await setDoc(doc(db, 'products', id), data)
      } catch {}
    }
    return id
  }

  const updateProduct = async (id, updates) => {
    setProducts(prev => {
      const next = prev.map(p => (p.id === id ? { ...p, ...updates } : p))
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(next))
      return next
    })
    if (useFirebase) {
      try {
        await updateDoc(doc(db, 'products', id), updates)
      } catch {}
    }
  }

  const deleteProduct = async (id) => {
    setProducts(prev => {
      const next = prev.filter(p => p.id !== id)
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(next))
      return next
    })
    if (useFirebase) {
      try {
        await deleteDoc(doc(db, 'products', id))
      } catch {}
    }
  }

  const addOrder = async (order) => {
    const id = String(order.id || Date.now())
    const data = { ...order, id }
    setOrders(prev => {
      const next = [data, ...prev]
      localStorage.setItem(ORDERS_KEY, JSON.stringify(next))
      return next
    })
    if (useFirebase) {
      try {
        await setDoc(doc(db, 'orders', id), data)
      } catch {}
    }
  }

  const deleteOrder = async (id) => {
    setOrders(prev => {
      const next = prev.filter(o => String(o.id) !== String(id))
      localStorage.setItem(ORDERS_KEY, JSON.stringify(next))
      return next
    })
    if (useFirebase) {
      try {
        await deleteDoc(doc(db, 'orders', id))
      } catch {}
    }
  }

  return (
    <DataContext.Provider
      value={{
        products,
        orders,
        socialLinks,
        siteContent,
        useFirebase,
        setSocialLinks,
        setSiteContent,
        addProduct,
        updateProduct,
        deleteProduct,
        addOrder,
        deleteOrder,
        setOrders,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const ctx = useContext(DataContext)
  if (!ctx) throw new Error('useData must be used within DataProvider')
  return ctx
}
