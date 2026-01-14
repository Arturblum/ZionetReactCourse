export type NotificationType = 'success' | 'error' | 'info'

export type Notification = {
  id: string
  type: NotificationType
  message: string
  timestamp?: number
  timeout?: number
}
