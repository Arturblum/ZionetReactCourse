import { useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { fetchProduct, type Product } from '../api/products'
import { useCart } from '../cart/CartContext'
import { useNotificationsStore } from '../stores/notifications'

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>()
  const { addItem } = useCart()
  const addNotification = useNotificationsStore((s) => s.addNotification)

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

  useEffect(() => {
    if (!isError) return
    addNotification({
      id: `product-load-error:${id ?? 'missing-id'}`,
      type: 'error',
      message: error?.message ?? 'Failed to load product.',
      timeout: 6000,
    })
  }, [isError, error, addNotification])

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
      <button
        type="button"
        onClick={() => {
          if (!data) return
          addItem({
            id: data.id,
            title: data.title,
            price: data.price,
            thumbnail: data.thumbnail,
          })
        }}
        disabled={!data}
      >
        Add to cart
      </button>
    </section>
  )
}

export default ProductDetail
