import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { fetchProduct, type Product } from '../api/products'

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
      if (!id) {
        throw new Error('Missing product id.')
      }
      return fetchProduct(id)
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
