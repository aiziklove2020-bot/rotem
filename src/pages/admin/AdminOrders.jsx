import { useData } from '../../context/DataContext'
import { useTranslation } from '../../i18n/useTranslation'

export function AdminOrders() {
  const { orders, deleteOrder } = useData()
  const t = useTranslation()

  const handleDelete = (order) => {
    if (!window.confirm(t('admin.orders.deleteConfirm'))) return
    deleteOrder(String(order.id))
  }

  return (
    <section className="admin-content-panel">
      <div className="admin-panel-head">
        <h3>{t('admin.orders.title')}</h3>
      </div>
      <div className="admin-panel-body">
        <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>{t('admin.orders.id')}</th>
              <th>{t('admin.orders.customer')}</th>
              <th>{t('admin.orders.phone')}</th>
              <th>{t('admin.orders.items')}</th>
              <th>{t('admin.orders.sum')}</th>
              <th>{t('admin.orders.time')}</th>
              <th>{t('admin.orders.actions')}</th>
            </tr>
          </thead>
          <tbody>
            {!orders.length ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px' }}>
                  {t('admin.orders.empty')}
                </td>
              </tr>
            ) : (
              orders.map((o) => {
                const customerName = o.customer?.name ?? o.customer ?? '—'
                const customerPhone = o.customer?.phone ?? o.phone ?? '—'
                const itemsList = Array.isArray(o.items)
                  ? o.items
                      .map(
                        (item) =>
                          `${item.emoji || '🕯️'} ${item.name} ×${item.quantity ?? item.qty ?? 1}`
                      )
                      .join(', ')
                  : o.items ?? '—'
                const timeStr = o.date
                  ? new Date(o.date).toLocaleString('he-IL', {
                      day: '2-digit',
                      month: '2-digit',
                      hour: '2-digit',
                      minute: '2-digit',
                    })
                  : o.time ?? '—'
                return (
                  <tr key={o.id}>
                    <td>
                      <strong style={{ color: 'var(--accent-gold)' }}>
                        #{String(o.id).slice(-6)}
                      </strong>
                    </td>
                    <td>{customerName}</td>
                    <td>{customerPhone}</td>
                    <td>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                        {itemsList}
                      </div>
                    </td>
                    <td>
                      <strong>₪{o.total}</strong>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{timeStr}</td>
                    <td>
                      <button
                        type="button"
                        className="admin-btn-danger"
                        onClick={() => handleDelete(o)}
                      >
                        {t('admin.orders.done')}
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
  )
}
