import { useTranslation } from '../i18n/useTranslation'

export function About() {
  const t = useTranslation()
  return (
    <main id="about-page" className="page active">
      <section className="section-padding" style={{ paddingTop: '150px' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <h2 className="section-title">{t('about.title')}</h2>
          <div style={{ fontSize: '5rem', marginBottom: '30px' }}>🐚</div>
          <p style={{ fontSize: '1.4rem', color: 'var(--sea-deep)', marginBottom: '30px', fontWeight: '600' }}>
            &quot;{t('about.quote')}&quot;
          </p>
          <div style={{ textAlign: 'right', fontSize: '1.1rem', color: '#444' }}>
            <p>{t('about.p1')}</p>
            <br />
            <p>{t('about.p2')}</p>
            <br />
            <p>{t('about.p3')}</p>
            <br />
            <p>{t('about.p4')}</p>
          </div>
        </div>
      </section>
    </main>
  )
}
