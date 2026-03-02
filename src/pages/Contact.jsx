import { useData } from '../context/DataContext'
import { useTranslation } from '../i18n/useTranslation'

export function Contact() {
  const { socialLinks } = useData()
  const t = useTranslation()
  const wa = socialLinks.whatsapp || '972000000000'
  const waHref = `https://wa.me/${wa.replace(/\D/g, '')}`

  return (
    <main id="contact-page" className="page active">
      <section className="section-padding" style={{ paddingTop: '150px' }}>
        <h2 className="section-title">{t('contact.title')}</h2>
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ marginBottom: '50px', color: 'var(--sea-deep)' }}>
            <p style={{ fontSize: '1.3rem', fontWeight: '600', marginBottom: '15px' }}>{t('contact.interested')}</p>
            <p style={{ fontSize: '1.1rem' }}>{t('contact.description')}</p>
          </div>
          <a href={waHref} target="_blank" rel="noreferrer" className="whatsapp-banner">
            <div>
              <h3 style={{ fontFamily: 'Assistant', fontWeight: 700, fontSize: '1.8rem' }}>{t('contact.whatsappTitle')}</h3>
              <p style={{ fontSize: '1rem', opacity: 0.9 }}>{t('contact.whatsappCta')}</p>
            </div>
            <div style={{ fontSize: '3.5rem' }}>💬</div>
          </a>
          <div
            style={{
              marginTop: '60px',
              color: 'var(--sea-medium)',
              fontSize: '0.9rem',
              borderTop: '1px solid var(--sand-warm)',
              paddingTop: '20px',
            }}
          >
            <p>{t('contact.hours')}</p>
          </div>
        </div>
      </section>
    </main>
  )
}
