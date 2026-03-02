import { useData } from '../context/DataContext'
import { ProductCard } from '../components/ProductCard'
import { useTranslation } from '../i18n/useTranslation'

export function Shop() {
  const { products } = useData()
  const t = useTranslation()

  return (
    <main id="shop-page" className="page active">
      <section className="section-padding" style={{ paddingTop: '150px' }}>
        <h2 className="section-title">{t('shop.title')}</h2>
        <div className="product-grid">
          {products.length ? (
            products.map((p) => <ProductCard key={p.id} product={p} />)
          ) : (
            <p style={{ gridColumn: '1/-1', textAlign: 'center' }}>{t('shop.empty')}</p>
          )}
        </div>
      </section>
    </main>
  )
}
