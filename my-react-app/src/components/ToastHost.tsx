import { useEffect } from 'react'
import { useNotificationsStore, type Notification } from '../stores/notifications'

type RemoveNotification = ReturnType<typeof useNotificationsStore.getState>['removeNotification']

function ToastItem({
  toast,
  onClose,
}: {
  toast: Notification
  onClose: RemoveNotification
}) {
  useEffect(() => {
    if (!toast.timeout) return
    const handle = window.setTimeout(() => onClose(toast.id), toast.timeout)
    return () => window.clearTimeout(handle)
  }, [toast.id, toast.timeout, onClose])

  return (
    <li className={`toast toast--${toast.type}`} role="status" aria-live="polite">
      <div className="toast-message">{toast.message}</div>
      <button type="button" className="toast-close" onClick={() => onClose(toast.id)}>
        ×
      </button>
    </li>
  )
}

export default function ToastHost() {
  const notifications = useNotificationsStore((s) => s.notifications)
  const removeNotification = useNotificationsStore((s) => s.removeNotification)

  if (notifications.length === 0) return null

  return (
    <ol className="toast-host" aria-label="Notifications">
      {notifications.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={removeNotification} />
      ))}
    </ol>
  )
}
