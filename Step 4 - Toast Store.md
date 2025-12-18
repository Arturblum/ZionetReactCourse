# Step 4 — Global Toast Store (Zustand)

## Library choice

I chose **Zustand** because it’s small, straightforward for global client state, and doesn’t require a Provider for basic usage. It’s a good fit for a tiny notification store.

- Store file location: `my-react-app/src/stores/notifications.ts`

## Notification shape + store API

- Notification shape:
  - `id: string`
  - `type: 'success' | 'error' | 'info'`
  - `message: string`
  - `timestamp?: number`
  - `timeout?: number`
- Store API:
  - `notifications` (list)
  - `addNotification(notification) -> id`
  - `removeNotification(id)`
  - `clearNotifications()`

## `<ToastHost />` description

`<ToastHost />` subscribes to the Zustand store and renders a fixed stack of toasts in the top-right. Each toast gets a different border color based on `type`, has a close button, and auto-dismisses when `timeout` is provided. It’s mounted high in the app layout in `my-react-app/src/App.tsx`.

## Screenshot instructions

Go to **About** and click **Show success toast** and **Show error toast**, then take a screenshot showing both toasts.

