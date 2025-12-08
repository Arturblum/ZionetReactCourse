import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

type Product = {
  id: number
  title: string
}

type ProductsResponse = {
  products: Product[]
}

const PRODUCTS_URL = 'https://dummyjson.com/products'

function Products() {
  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery<ProductsResponse, Error>({
    queryKey: ['products'],
    queryFn: async () => {
      const response = await fetch(PRODUCTS_URL)
      if (!response.ok) {
        throw new Error('Failed to load products')
      }
      return response.json()
    },
  })

  if (isLoading) {
    return <p>Loading products...</p>
  }

  if (isError) {
    return <p>Something went wrong: {error.message}</p>
  }

  return (
    <section className="card">
      <h2>Products</h2>
      <ul className="contact-list">
        {data?.products.map((product) => (
          <li key={product.id}>
            <Link to={`/products/${product.id}`}>
              <strong>{product.title}</strong>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default Products
