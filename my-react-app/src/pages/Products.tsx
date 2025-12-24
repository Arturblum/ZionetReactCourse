import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'
import { fetchProducts, type ProductSummary, type ProductsResponse } from '../api'
import { useNotificationsStore } from '../stores'

const PAGE_SIZE = 5

const Products = () => {
  const addNotification = useNotificationsStore((s) => s.addNotification)
  const [searchParams] = useSearchParams()
  const isBroken = searchParams.get('broken') === '1'
  const { t } = useTranslation(['products', 'common'])
  const loadFailedMessage = t('errors.loadFailed', { ns: 'products' })
  const [searchTerm, setSearchTerm] = useState('')

  console.log('Products component rendering')

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
          throw new Error(loadFailedMessage)
        }
      }
      return fetchProducts(pageParam, PAGE_SIZE)
    },
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.skip + lastPage.limit
      return nextSkip < lastPage.total ? nextSkip : undefined
    },
  })

  // Compute products and filtered products BEFORE any conditional returns
  const products =
    data?.pages.flatMap<ProductSummary>((page) => page.products) ?? []
  const filteredProducts = useMemo(() => {
    const normalizedTerm = searchTerm.trim().toLowerCase()
    if (!normalizedTerm) return products
    return products.filter((product) =>
      product.title.toLowerCase().includes(normalizedTerm),
    )
  }, [products, searchTerm])
  const isFiltering = searchTerm.trim().length > 0

  useEffect(() => {
    if (!isError) return
    addNotification({
      id: 'products-load-error',
      type: 'error',
      message: loadFailedMessage,
      timeout: 6000,
    })
  }, [isError, loadFailedMessage, addNotification])

  console.log('Products state:', { isLoading, isError, hasData: !!data })

  if (isLoading) {
    console.log('Showing loading state')
    return <p>{t('loadingList', { ns: 'products' })}</p>
  }

  if (isError) {
    console.log('Showing error state:', error)
    return (
      <p>
        {t('listError', { ns: 'products' })} {error.message}
      </p>
    )
  }

  return (
    <section className="card">
      <h2>{t('title', { ns: 'products' })}</h2>
      <p className="muted small">
        {t('showingCount', { ns: 'products', count: filteredProducts.length })}
      </p>
      <div className="field">
        <label htmlFor="product-search">
          {t('searchLabel', { ns: 'products' })}
        </label>
        <input
          id="product-search"
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder={t('searchPlaceholder', { ns: 'products' })}
        />
      </div>
      <p className="muted small">
        <Trans
          i18nKey="testErrorToast"
          ns="products"
          components={[<Link to="/products/0" />]}
        />
        {' · '}
        <Link to={isBroken ? '/products' : '/products?broken=1'}>
          <strong>
            {isBroken
              ? t('stopSimulateError', { ns: 'products' })
              : t('simulateError', { ns: 'products' })}
          </strong>
        </Link>
      </p>
      <ul className="contact-list">
        {filteredProducts.map((product) => (
          <li key={product.id}>
            <Link to={`/products/${product.id}`}>
              <strong>{product.title}</strong>
            </Link>
          </li>
        ))}
      </ul>
      {filteredProducts.length === 0 && (
        <p className="muted">
          {isFiltering
            ? t('noSearchResults', { ns: 'products' })
            : t('emptyList', { ns: 'products' })}
        </p>
      )}
      <button
        type="button"
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isFetchingNextPage
          ? t('loadingMore', { ns: 'products' })
          : hasNextPage
            ? t('loadMore', { ns: 'products' })
            : t('noMoreProducts', { ns: 'products' })}
      </button>
    </section>
  )
}

export default Products
