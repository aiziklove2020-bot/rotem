import { useState } from 'react'
import { useData } from '../../context/DataContext'
import { useTranslation } from '../../i18n/useTranslation'

export function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useData()
  const t = useTranslation()
  const [formOpen, setFormOpen] = useState(false)
  const [alert, setAlert] = useState('')

  const showAlert = (msg) => {
    setAlert(msg)
    setTimeout(() => setAlert(''), 3000)
  }

  const handleAdd = async (e) => {
    e.preventDefault()
    const fd = new FormData(e.target)
    const name = fd.get('name')?.toString().trim()
    const price = fd.get('price')?.toString()
    if (!name || !price) {
      window.alert(t('admin.products.fillNamePrice'))
      return
    }
    const imageFile = fd.get('image')
    let imageData = null
    if (imageFile?.size) {
      imageData = await readAndResizeImage(imageFile)
    }
    await addProduct({
      name,
      description: fd.get('description')?.toString() || '',
      price: parseFloat(price),
      emoji: fd.get('emoji')?.toString() || '🕯️',
      image: imageData,
      stock: fd.get('stock')?.toString() || 'in-stock',
    })
    e.target.reset()
    setFormOpen(false)
    showAlert(t('admin.products.added'))
  }

  const handleToggleStock = (p) => {
    const next = p.stock === 'out-of-stock' ? 'in-stock' : 'out-of-stock'
    updateProduct(p.id, { stock: next })
  }

  const handleDelete = (p) => {
    if (!window.confirm(t('admin.products.deleteConfirm'))) return
    deleteProduct(p.id)
  }

  return (
    <>
      <section className="admin-content-panel">
        <div className="admin-panel-head">
          <h3>{t('admin.products.title')}</h3>
          <button type="button" className="admin-btn-ui" onClick={() => setFormOpen((v) => !v)}>
            {t('admin.products.add')}
          </button>
        </div>
        <div className="admin-panel-body">
          {formOpen && (
            <form onSubmit={handleAdd} className="admin-product-form">
              <label className="admin-form-label">{t('admin.products.name')}</label>
              <input type="text" name="name" className="admin-input-ui" required />
              <label className="admin-form-label">{t('admin.products.description')}</label>
              <textarea name="description" className="admin-input-ui admin-input-textarea" rows={2} />
              <label className="admin-form-label">{t('admin.products.price')}</label>
              <input type="number" name="price" className="admin-input-ui" step="0.01" required />
              <label className="admin-form-label">{t('admin.products.emoji')}</label>
              <input type="text" name="emoji" className="admin-input-ui" placeholder="🕯️" />
              <label className="admin-form-label">{t('admin.products.image')}</label>
              <input type="file" name="image" className="admin-input-ui" accept="image/*" />
              <label className="admin-form-label">{t('admin.products.stock')}</label>
              <select name="stock" className="admin-input-ui">
                <option value="in-stock">{t('admin.products.inStock')}</option>
                <option value="out-of-stock">{t('admin.products.outOfStock')}</option>
              </select>
              <button type="submit" className="admin-btn-ui">{t('admin.products.save')}</button>
            </form>
          )}
          <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>{t('admin.products.image')}</th>
                <th>{t('admin.products.product')}</th>
                <th>{t('admin.products.price')}</th>
                <th>{t('admin.products.stockLabel')}</th>
                <th>{t('admin.orders.actions')}</th>
              </tr>
            </thead>
            <tbody>
              {!products.length ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
                    {t('admin.products.empty')}
                  </td>
                </tr>
              ) : (
                products.map((p) => {
                  const isOut = p.stock === 'out-of-stock'
                  return (
                    <tr key={p.id}>
                      <td>
                        {p.image ? (
                          <img
                            src={p.image}
                            alt=""
                            style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover' }}
                          />
                        ) : (
                          <span style={{ fontSize: '2rem' }}>{p.emoji || '🕯️'}</span>
                        )}
                      </td>
                      <td>
                        <strong>{p.name}</strong>
                        <br />
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{p.description || ''}</span>
                      </td>
                      <td>₪{p.price}</td>
                      <td>
                        <span className={isOut ? 'admin-stock-out' : 'admin-stock-in'}>
                          {isOut ? `❌ ${t('admin.products.outShort')}` : `✅ ${t('admin.products.inShort')}`}
                        </span>
                      </td>
                      <td className="admin-table-actions">
                        <button
                          type="button"
                          className="admin-btn-ui"
                          style={{ padding: '8px 14px', fontSize: '0.8rem' }}
                          onClick={() => handleToggleStock(p)}
                        >
                          {isOut ? t('admin.products.restore') : t('admin.products.remove')}
                        </button>
                        <button type="button" className="admin-btn-danger" onClick={() => handleDelete(p)}>
                          {t('admin.products.delete')}
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
          </div>
        </div>
      </section>
      <div className={`admin-alert-toast ${alert ? 'show' : ''}`}>{alert}</div>
    </>
  )
}

function readAndResizeImage(file) {
  return new Promise((resolve) => {
    const reader = new FileReader()
    reader.onload = (ev) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const maxW = 800
        const scale = Math.min(1, maxW / img.width)
        canvas.width = img.width * scale
        canvas.height = img.height * scale
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height)
        resolve(canvas.toDataURL('image/jpeg', 0.8))
      }
      img.src = ev.target.result
    }
    reader.readAsDataURL(file)
  })
}
