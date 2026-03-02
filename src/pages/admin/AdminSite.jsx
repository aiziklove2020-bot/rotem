import { useState, useEffect } from 'react'
import { useData } from '../../context/DataContext'
import { useTranslation } from '../../i18n/useTranslation'

export function AdminSite() {
  const { socialLinks, siteContent, setSocialLinks, setSiteContent } = useData()
  const t = useTranslation()
  const [whatsapp, setWhatsapp] = useState(socialLinks.whatsapp || '')
  const [instagram, setInstagram] = useState(socialLinks.instagram || '')
  const [phone, setPhone] = useState(socialLinks.phone || '')
  const [title, setTitle] = useState(siteContent.title || '')
  const [subtitle, setSubtitle] = useState(siteContent.subtitle || '')
  const [alert, setAlert] = useState('')

  useEffect(() => {
    setWhatsapp(socialLinks.whatsapp || '')
    setInstagram(socialLinks.instagram || '')
    setPhone(socialLinks.phone || '')
    setTitle(siteContent.title || '')
    setSubtitle(siteContent.subtitle || '')
  }, [socialLinks, siteContent])

  const handleSave = (e) => {
    e?.preventDefault()
    setSocialLinks({ whatsapp, instagram, phone })
    setSiteContent({ title, subtitle })
    setAlert(t('admin.site.saved'))
    setTimeout(() => setAlert(''), 3000)
  }

  return (
    <>
      <section className="admin-content-panel">
        <div className="admin-panel-head">
          <h3>{t('admin.site.title')}</h3>
        </div>
        <div className="admin-panel-body">
          <form onSubmit={handleSave} className="admin-site-form">
            <div className="admin-site-editor-grid">
              <div className="admin-editor-section">
                <h4>{t('admin.site.heroTitle')}</h4>
                <input
                  type="text"
                  className="admin-input-ui"
                  placeholder={t('admin.site.heroTitlePlaceholder')}
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                  className="admin-input-ui admin-input-textarea"
                  placeholder={t('admin.site.heroDescPlaceholder')}
                  rows={3}
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                />
              </div>
              <div className="admin-editor-section">
                <h4>{t('admin.site.contactTitle')}</h4>
                <input
                  type="text"
                  className="admin-input-ui"
                  placeholder={t('admin.site.whatsappPlaceholder')}
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                />
                <input
                  type="text"
                  className="admin-input-ui"
                  placeholder={t('admin.site.instagramPlaceholder')}
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                />
                <input
                  type="text"
                  className="admin-input-ui"
                  placeholder={t('admin.site.phonePlaceholder')}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>
            <button type="submit" className="admin-btn-ui admin-site-save">
              {t('admin.site.save')}
            </button>
          </form>
        </div>
      </section>
      <div className={`admin-alert-toast ${alert ? 'show' : ''}`}>{alert}</div>
    </>
  )
}
