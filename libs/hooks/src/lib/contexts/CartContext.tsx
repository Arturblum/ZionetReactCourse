import { createContext, useContext } from 'react'
import type { CartItem } from '../types'

export type CartContextValue = {
  isOpen: boolean
  items: CartItem[]
  open: () => void
  close: () => void
  toggle: () => void
  // eslint-disable-next-line no-unused-vars
  addItem: (item: Omit<CartItem, 'quantity'>, options?: { notify?: boolean }) => void
  // eslint-disable-next-line no-unused-vars
  removeItem: (id: number) => void
  clear: () => void
}

export const CartContext = createContext<CartContextValue | null>(null)

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
