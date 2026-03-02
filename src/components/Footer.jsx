import { useTranslation } from '../i18n/useTranslation'

export function Footer() {
  const t = useTranslation()
  return (
    <footer className="site-footer">
      <p>{t('footer.copyright')}</p>
    </footer>
  )
}
