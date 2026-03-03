import { Link } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { ProductCard } from '../components/ProductCard'
import { useTranslation } from '../i18n/useTranslation'

export function Home() {
  const { products, productsLoading, siteContent } = useData()
  const t = useTranslation()
  const title = siteContent.title || t('home.defaultTitle')
  const subtitle = siteContent.subtitle || t('home.defaultSubtitle')
  const featured = products.slice(0, 3)

  return (
    <main id="home-page" className="page active">
      <section className="hero hero-seashore">
        <div className="hero-content-clean">
          <h2>{title}</h2>
          <h2>art&Candle</h2>
          <p>{subtitle}</p>
          <Link to="/shop">
            <button type="button" className="btn-action">
              {t('home.toCollection')}
            </button>
          </Link>
        </div>
      </section>
      <section className="section-padding">
        <h2 className="section-title">{t('home.featuredTitle')}</h2>
        <div className="product-grid">
          {productsLoading ? (
            <div className="products-loader" style={{ gridColumn: '1/-1', display: 'flex', justifyContent: 'center', padding: '2rem' }}>
              <span className="loader-spinner" aria-hidden />
            </div>
          ) : featured.length ? (
            featured.map((p) => <ProductCard key={p.id} product={p} />)
          ) : (
            <p style={{ gridColumn: '1/-1', textAlign: 'center' }}>{t('home.comingSoon')}</p>
          )}
        </div>
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link to="/shop" style={{ color: 'var(--accent-gold)', fontWeight: 'bold', textDecoration: 'underline' }}>
            {t('home.toAllProducts')}
          </Link>
        </div>
      </section>
    </main>
  )
}
