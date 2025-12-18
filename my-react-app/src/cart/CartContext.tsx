import type { ReactNode } from 'react'
import { createContext, useCallback, useContext, useMemo, useState } from 'react'

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
  const [isOpen, setIsOpen] = useState(false)
  const [items, setItems] = useState<CartItem[]>([])

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])
  const toggle = useCallback(() => setIsOpen((current) => !current), [])

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setItems((current) => {
      const existing = current.find((entry) => entry.id === item.id)
      if (!existing) {
        return [...current, { ...item, quantity: 1 }]
      }
      return current.map((entry) =>
        entry.id === item.id ? { ...entry, quantity: entry.quantity + 1 } : entry,
      )
    })
    setIsOpen(true)
  }, [])

  const removeItem = useCallback((id: number) => {
    setItems((current) => current.filter((entry) => entry.id !== id))
  }, [])

  const clear = useCallback(() => setItems([]), [])

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

