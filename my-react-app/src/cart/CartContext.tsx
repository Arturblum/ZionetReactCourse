import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import useLocalStorageState from '../hooks/useLocalStorageState'
import { useNotificationsStore } from '../stores/notifications'

export type CartItem = {
  id: number
  title: string
  price: number
  thumbnail: string
  quantity: number
}

type CartContextValue = {
  isOpen: boolean
  items: CartItem[]
  open: () => void
  close: () => void
  toggle: () => void
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (id: number) => void
  clear: () => void
}

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useLocalStorageState('cart-open', false)
  const [items, setItems] = useState<CartItem[]>([])
  const itemsRef = useRef(items)

  useEffect(() => {
    itemsRef.current = items
  }, [items])

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((current) => !current), [])

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
    if (!item?.id || !item?.title) {
      useNotificationsStore.getState().addNotification({
        type: 'error',
        message: 'Unable to add item to cart (invalid item).',
        timeout: 5000,
      })
      return
    }

    const alreadyInCart = itemsRef.current.some((entry) => entry.id === item.id)

    useNotificationsStore.getState().addNotification({
      type: alreadyInCart ? 'info' : 'success',
      message: alreadyInCart
        ? `Increased quantity of “${item.title}”.`
        : `Added “${item.title}” to cart.`,
      timeout: 2500,
    })

    setItems((current) => {
      const existing = current.find((entry) => entry.id === item.id)
      if (!existing) return [...current, { ...item, quantity: 1 }]
      return current.map((entry) =>
        entry.id === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry,
      )
    })
    setIsOpen(true)
  }, [])

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
  }, [])

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
  }, [])

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

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
