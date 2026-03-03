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
  const [productsLoading, setProductsLoading] = useState(true)
  const [orders, setOrders] = useState(() => JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]'))
  const [socialLinks, setSocialLinksState] = useState(() => JSON.parse(localStorage.getItem(SOCIAL_KEY) || '{}'))
  const [siteContent, setSiteContentState] = useState(() => JSON.parse(localStorage.getItem(CONTENT_KEY) || '{}'))
  const [useFirebase, setUseFirebase] = useState(false)

  useEffect(() => {
    let mounted = true
    const PRODUCTS_LOAD_TIMEOUT_MS = 12000
    const RETRY_DELAY_MS = 1500
    const MAX_ATTEMPTS = 3
    const timeoutId = setTimeout(() => {
      if (mounted) setProductsLoading(false)
    }, PRODUCTS_LOAD_TIMEOUT_MS)

    function imageCount(p) {
      if (!p) return 0
      if (p.images?.length) return p.images.length
      return p.image ? 1 : 0
    }

    async function init() {
      let lastError
      for (let attempt = 1; attempt <= MAX_ATTEMPTS && mounted; attempt++) {
        try {
          const snapProducts = await getDocs(collection(db, 'products'))
          if (!mounted) return
          const fromDb = snapProducts.docs.map((d) => ({ id: d.id, ...d.data() }))
          const idsFromDb = new Set(fromDb.map((p) => String(p.id)))
          setProducts((prev) => {
            const localOnly = prev.filter((p) => !idsFromDb.has(String(p.id)))
            const mergedFromDb = fromDb.map((dbProduct) => {
              const local = prev.find((p) => String(p.id) === String(dbProduct.id))
              if (local && imageCount(local) > imageCount(dbProduct)) return local
              return dbProduct
            })
            const merged = [...mergedFromDb, ...localOnly]
            try {
              localStorage.setItem(PRODUCTS_KEY, JSON.stringify(merged))
            } catch (_) {}
            return merged
          })
          setUseFirebase(true)
          return
        } catch (err) {
          lastError = err
          if (attempt < MAX_ATTEMPTS && mounted) {
            await new Promise((r) => setTimeout(r, RETRY_DELAY_MS))
          }
        }
      }
      if (mounted) setUseFirebase(false)
    }

    init().finally(() => {
      clearTimeout(timeoutId)
      if (mounted) setProductsLoading(false)
    })
    return () => {
      mounted = false
      clearTimeout(timeoutId)
    }
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
    const idStr = String(id)
    setProducts(prev => {
      const next = prev.map(p => (String(p.id) === idStr ? { ...p, ...updates } : p))
      localStorage.setItem(PRODUCTS_KEY, JSON.stringify(next))
      return next
    })
    if (useFirebase) {
      try {
        const cleanUpdates = Object.fromEntries(
          Object.entries(updates).filter(([, v]) => v !== undefined)
        )
        await updateDoc(doc(db, 'products', idStr), cleanUpdates)
      } catch (err) {
        throw err
      }
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
        productsLoading,
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
