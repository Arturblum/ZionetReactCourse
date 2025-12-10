import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'

type Product = {
  id: number
  title: string
  description: string
  price: number
  thumbnail: string
}

const PRODUCT_DETAIL_URL = 'https://dummyjson.com/products'

function ProductDetail() {
  const { id } = useParams<{ id: string }>()

  const {
    data,
    isLoading,
    isError,
    error,
  } = useQuery<Product, Error>({
    queryKey: ['product', id],
    queryFn: async () => {
      const response = await fetch(`${PRODUCT_DETAIL_URL}/${id}`)
      if (!response.ok) {
        throw new Error('Failed to load product')
      }
      return response.json()
    },
    enabled: Boolean(id),
  })

  if (!id) {
    return <p>Missing product id.</p>
  }

  if (isLoading) {
    return <p>Loading product...</p>
  }

  if (isError) {
    return <p>Something went wrong: {error.message}</p>
  }

  return (
    <section className="card">
      <Link to="/products">← Back to products</Link>
      <h2>{data?.title}</h2>
      <img
        src={data?.thumbnail}
        alt={data?.title}
        style={{ maxWidth: '250px', borderRadius: '0.5rem' }}
      />
      <p>{data?.description}</p>
      <p>
        <strong>${data?.price}</strong>
      </p>
    </section>
  )
}

export default ProductDetail

