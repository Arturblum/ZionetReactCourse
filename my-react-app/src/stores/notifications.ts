import { create } from 'zustand'

export type NotificationType = 'success' | 'error' | 'info'

export type Notification = {
  id: string
  type: NotificationType
  message: string
  timestamp?: number
  timeout?: number
}

type AddNotificationInput = Omit<Notification, 'id'> & { id?: string }

type NotificationsStore = {
  notifications: Notification[]
  // eslint-disable-next-line no-unused-vars
  addNotification: (notification: AddNotificationInput) => string
  // eslint-disable-next-line no-unused-vars
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

function generateId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

export const useNotificationsStore = create<NotificationsStore>((set) => ({
  notifications: [],
  addNotification: (notification) => {
    const id = notification.id ?? generateId()
    const timestamp = notification.timestamp ?? Date.now()

    set((state) => {
      const next: Notification = {
        ...notification,
        id,
        timestamp,
      }

      const existingIndex = state.notifications.findIndex((entry) => entry.id === id)
      if (existingIndex === -1) {
        return { notifications: [...state.notifications, next] }
      }

      const notifications = state.notifications.slice()
      notifications[existingIndex] = next
      return { notifications }
    })

    return id
  },
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((entry) => entry.id !== id),
    }))
  },
  clearNotifications: () => set({ notifications: [] }),
}))
