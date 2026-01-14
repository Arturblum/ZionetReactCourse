import type { ReactNode } from 'react'
import { useCallback, useEffect, useMemo, useRef } from 'react'
import { CartContext, useLocalStorageState, useNotificationsStore, type CartItem } from '@my-app/hooks'

export function CartProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useLocalStorageState('cart-open', false, {
    validate: (value): value is boolean => typeof value === 'boolean',
  })
  const [items, setItems] = useLocalStorageState<CartItem[]>('cart-items', [], {
    validate: Array.isArray,
  })
  const itemsRef = useRef(items)

  useEffect(() => {
    itemsRef.current = items
  }, [items])

  const open = useCallback(() => setIsOpen(true), [setIsOpen])
  const close = useCallback(() => setIsOpen(false), [setIsOpen])
  const toggle = useCallback(() => setIsOpen((current) => !current), [setIsOpen])

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>, options?: { notify?: boolean }) => {
    if (!item?.id || !item?.title) {
      if (options?.notify ?? true) {
        useNotificationsStore.getState().addNotification({
          type: 'error',
          message: 'Unable to add item to cart (invalid item).',
          timeout: 5000,
        })
      }
      return
    }

    const alreadyInCart = itemsRef.current.some((entry) => entry.id === item.id)

    if (options?.notify ?? true) {
      useNotificationsStore.getState().addNotification({
        type: alreadyInCart ? 'info' : 'success',
        message: alreadyInCart
          ? `Increased quantity of “${item.title}”.`
          : `Added “${item.title}” to cart.`,
        timeout: 2500,
      })
    }

    setItems((current) => {
      const existing = current.find((entry) => entry.id === item.id)
      if (!existing) return [...current, { ...item, quantity: 1 }]
      return current.map((entry) =>
        entry.id === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry,
      )
    })
    setIsOpen(true)
  }, [setIsOpen, setItems])

  const removeItem = useCallback((id: number) => {
    const existing = itemsRef.current.find((entry) => entry.id === id)
    if (!existing) {
      useNotificationsStore.getState().addNotification({
        type: 'error',
        message: 'Item not found in cart.',
        timeout: 5000,
      })
      return
    }

    useNotificationsStore.getState().addNotification({
      type: 'info',
      message: `Removed “${existing.title}” from cart.`,
      timeout: 2500,
    })

    setItems((current) => current.filter((entry) => entry.id !== id))
  }, [setItems])

  const clear = useCallback(() => {
    if (itemsRef.current.length === 0) {
      useNotificationsStore.getState().addNotification({
        type: 'info',
        message: 'Cart is already empty.',
        timeout: 2500,
      })
      return
    }

    useNotificationsStore.getState().addNotification({
      type: 'success',
      message: 'Cleared cart.',
      timeout: 2500,
    })

    setItems([])
  }, [setItems])

  const value = useMemo(
    () => ({
      isOpen,
      items,
      open,
      close,
      toggle,
      addItem,
      removeItem,
      clear,
    }),
    [isOpen, items, open, close, toggle, addItem, removeItem, clear],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
