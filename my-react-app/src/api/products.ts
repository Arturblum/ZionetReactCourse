const PRODUCTS_URL = 'https://dummyjson.com/products'

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

