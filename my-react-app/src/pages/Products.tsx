import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  fetchProducts,
  type ProductSummary,
  type ProductsResponse,
} from '../api/products'
import { useNotificationsStore } from '../stores/notifications'

const PAGE_SIZE = 5

const Products = () => {
  const addNotification = useNotificationsStore((s) => s.addNotification)
  const [searchParams] = useSearchParams()
  const isBroken = searchParams.get('broken') === '1'

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<ProductsResponse, Error>({
    queryKey: ['products', { broken: isBroken }],
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      if (isBroken) {
        const response = await fetch('https://dummyjson.com/does-not-exist')
        if (!response.ok) {
          throw new Error('Failed to load products')
        }
      }
      return fetchProducts(pageParam, PAGE_SIZE)
    },
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.skip + lastPage.limit
      return nextSkip < lastPage.total ? nextSkip : undefined
    },
  })

  useEffect(() => {
    if (!isError) return
    addNotification({
      id: 'products-load-error',
      type: 'error',
      message: 'Failed to load products',
      timeout: 6000,
    })
  }, [isError, error, addNotification])

  if (isLoading) {
    return <p>Loading products...</p>
  }

  if (isError) {
    return <p>Something went wrong: {error.message}</p>
  }

  const products =
    data?.pages.flatMap<ProductSummary>((page) => page.products) ?? []

  return (
    <section className="card">
      <h2>Products</h2>
      <p className="muted small">
        Test error toast:{' '}
        <Link to="/products/0">
          <strong>Open a fake product</strong>
        </Link>
        {' · '}
        <Link to={isBroken ? '/products' : '/products?broken=1'}>
          <strong>{isBroken ? 'Stop products error mode' : 'Simulate products API error'}</strong>
        </Link>
      </p>
      <ul className="contact-list">
        {products.map((product) => (
          <li key={product.id}>
            <Link to={`/products/${product.id}`}>
              <strong>{product.title}</strong>
            </Link>
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage ? 'Loading...' : hasNextPage ? 'Load more' : 'No more products'}
      </button>
    </section>
  )
}

export default Products
