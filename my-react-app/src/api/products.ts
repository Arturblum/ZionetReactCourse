const PRODUCTS_URL = 'https://dummyjson.com/products'
const CARTS_URL = 'https://dummyjson.com/carts'

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

export async function fetchProduct(id: string) {
  const response = await fetch(`${PRODUCTS_URL}/${id}`)
  if (!response.ok) {
    throw new Error('Failed to load product')
  }
  return response.json() as Promise<Product>
}

export async function fetchProducts(skip: number, limit: number) {
  const response = await fetch(`${PRODUCTS_URL}?limit=${limit}&skip=${skip}`)
  if (!response.ok) {
    throw new Error('Failed to load products')
  }
  return response.json() as Promise<ProductsResponse>
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

export async function addProductToCart(productId: number, quantity = 1, userId = 1) {
  const response = await fetch(`${CARTS_URL}/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userId,
      products: [{ id: productId, quantity }],
    }),
  })

  if (!response.ok) {
    throw new Error('Failed to add product to cart')
  }

  return response.json() as Promise<AddToCartResponse>
}
