export type Product = {
  id: number
  title: string
  description: string
  price: number
  thumbnail: string
}

export type ProductSummary = Pick<Product, 'id' | 'title'>

export type ProductsResponse = {
  products: ProductSummary[]
  total: number
  skip: number
  limit: number
}

export type AddToCartResponse = {
  id: number
  products: Array<{ id: number; quantity: number }>
  total: number
  discountedTotal: number
  userId: number
  totalProducts: number
  totalQuantity: number
}
