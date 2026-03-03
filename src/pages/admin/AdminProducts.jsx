import { useState, useEffect } from 'react'
import { useData } from '../../context/DataContext'
import { useTranslation } from '../../i18n/useTranslation'
import { getProductImages } from '../../utils/productImages'

export function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useData()
  const t = useTranslation()
  const [formOpen, setFormOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [editImages, setEditImages] = useState([])
  const [alert, setAlert] = useState('')

  useEffect(() => {
    if (editingProduct) {
      setEditImages(getProductImages(editingProduct))
    } else {
      setEditImages([])
    }
  }, [editingProduct])

  const showAlert = (msg) => {
    setAlert(msg)
    setTimeout(() => setAlert(''), 3000)
  }

  const openAddForm = () => {
    setEditingProduct(null)
    setFormOpen(true)
  }

  const openEditForm = (p) => {
    setEditingProduct(p)
    setFormOpen(true)
  }

  const closeForm = () => {
    setFormOpen(false)
    setEditingProduct(null)
    setEditImages([])
  }

  const removeEditImage = (index) => {
    setEditImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleAddMoreImages = async (e) => {
    const files = Array.from(e.target.files || []).filter((f) => f?.size > 0)
    if (!files.length) return
    const newImages = await Promise.all(files.map((file) => readAndResizeImage(file)))
    setEditImages((prev) => [...prev, ...newImages])
    e.target.value = ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const fd = new FormData(e.target)
    const name = fd.get('name')?.toString().trim()
    const price = fd.get('price')?.toString()
    if (!name || !price) {
      window.alert(t('admin.products.fillNamePrice'))
      return
    }
    const description = fd.get('description')?.toString() || ''
    const emoji = fd.get('emoji')?.toString() || '🕯️'
    const stock = fd.get('stock')?.toString() || 'in-stock'

    if (editingProduct) {
      await updateProduct(editingProduct.id, {
        name,
        description,
        price: parseFloat(price),
        emoji,
        stock,
        images: editImages,
      })
      e.target.reset()
      closeForm()
      showAlert(t('admin.products.updated'))
    } else {
      const imageFiles = fd.getAll('images').filter((f) => f?.size > 0)
      const images = imageFiles.length
        ? await Promise.all(imageFiles.map((file) => readAndResizeImage(file)))
        : []
      await addProduct({
        name,
        description,
        price: parseFloat(price),
        emoji,
        ...(images.length ? { images } : {}),
        stock,
      })
      e.target.reset()
      closeForm()
      showAlert(t('admin.products.added'))
    }
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
          <button type="button" className="admin-btn-ui" onClick={openAddForm}>
            {t('admin.products.add')}
          </button>
        </div>
        <div className="admin-panel-body">
          {formOpen && (
            <form key={editingProduct?.id ?? 'new'} onSubmit={handleSubmit} className="admin-product-form">
              <h4 style={{ marginBottom: '1rem', color: 'var(--sea-deep)' }}>
                {editingProduct ? t('admin.products.editProduct') : t('admin.products.add')}
              </h4>
              <label className="admin-form-label">{t('admin.products.name')}</label>
              <input
                type="text"
                name="name"
                className="admin-input-ui"
                required
                defaultValue={editingProduct?.name}
              />
              <label className="admin-form-label">{t('admin.products.description')}</label>
              <textarea
                name="description"
                className="admin-input-ui admin-input-textarea"
                rows={2}
                defaultValue={editingProduct?.description}
              />
              <label className="admin-form-label">{t('admin.products.price')}</label>
              <input
                type="number"
                name="price"
                className="admin-input-ui"
                step="0.01"
                required
                defaultValue={editingProduct?.price}
              />
              <label className="admin-form-label">{t('admin.products.emoji')}</label>
              <input
                type="text"
                name="emoji"
                className="admin-input-ui"
                placeholder="🕯️"
                defaultValue={editingProduct?.emoji}
              />
              <label className="admin-form-label">{t('admin.products.image')}</label>
              {editingProduct ? (
                <>
                  <div className="admin-edit-images">
                    {editImages.map((src, i) => (
                      <div key={i} className="admin-edit-image-wrap">
                        <img src={src} alt="" className="admin-edit-image-thumb" />
                        <button
                          type="button"
                          className="admin-edit-image-remove"
                          onClick={() => removeEditImage(i)}
                          title={t('admin.products.removeImage')}
                          aria-label={t('admin.products.removeImage')}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                  <label className="admin-form-label" style={{ marginTop: '8px' }}>
                    {t('admin.products.addMoreImages')}
                  </label>
                  <input
                    type="file"
                    name="images"
                    className="admin-input-ui"
                    accept="image/*"
                    multiple
                    onChange={handleAddMoreImages}
                  />
                </>
              ) : (
                <>
                  <input type="file" name="images" className="admin-input-ui" accept="image/*" multiple />
                  <span style={{ fontSize: '0.85rem', color: 'var(--sea-medium)', display: 'block', marginTop: '4px' }}>
                    {t('admin.products.imagesHint')}
                  </span>
                </>
              )}
              <label className="admin-form-label">{t('admin.products.stock')}</label>
              <select name="stock" className="admin-input-ui" defaultValue={editingProduct?.stock ?? 'in-stock'}>
                <option value="in-stock">{t('admin.products.inStock')}</option>
                <option value="out-of-stock">{t('admin.products.outOfStock')}</option>
              </select>
              <div style={{ display: 'flex', gap: '10px', marginTop: '1rem' }}>
                <button type="submit" className="admin-btn-ui">
                  {t('admin.products.save')}
                </button>
                <button type="button" className="admin-btn-ui" style={{ background: 'var(--sand-warm)' }} onClick={closeForm}>
                  {t('cart.close')}
                </button>
              </div>
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
                  const firstImg = getProductImages(p)[0]
                  return (
                    <tr key={p.id}>
                      <td>
                        {firstImg ? (
                          <img
                            src={firstImg}
                            alt=""
                            style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'contain', background: 'var(--sand-warm)' }}
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
                          onClick={() => openEditForm(p)}
                        >
                          {t('admin.products.edit')}
                        </button>
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
