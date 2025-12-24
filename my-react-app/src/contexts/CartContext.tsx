import { createContext, useContext } from 'react'

export type CartItem = {
  id: number
  title: string
  price: number
  thumbnail: string
  quantity: number
}

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

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
