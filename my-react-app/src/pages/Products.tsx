import { useInfiniteQuery } from '@tanstack/react-query'
import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Trans, useTranslation } from 'react-i18next'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { fetchProducts, type ProductSummary, type ProductsResponse } from '../api'
import { useNotificationsStore } from '../stores'

const PAGE_SIZE = 20

const Products = () => {
  const addNotification = useNotificationsStore((s) => s.addNotification)
  const [searchParams] = useSearchParams()
  const isBroken = searchParams.get('broken') === '1'
  const { t } = useTranslation(['products', 'common'])
  const loadFailedMessage = t('errors.loadFailed', { ns: 'products' })
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'list' | 'table'>('table')
  const [currentPage, setCurrentPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10)

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

  // Auto-fetch more data when user navigates in table mode
  useEffect(() => {
    if (viewMode !== 'table') return
    
    const lastRowOnCurrentPage = (currentPage + 1) * rowsPerPage
    const needsMoreData = lastRowOnCurrentPage >= filteredProducts.length && hasNextPage && !isFetchingNextPage
    
    if (needsMoreData) {
      fetchNextPage()
    }
  }, [viewMode, currentPage, rowsPerPage, filteredProducts.length, hasNextPage, isFetchingNextPage, fetchNextPage])

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
      
      {/* View Mode Toggle */}
      <div style={{ marginBottom: '1rem' }}>
        <button
          type="button"
          onClick={() => setViewMode('list')}
          style={{
            marginRight: '0.5rem',
            fontWeight: viewMode === 'list' ? 'bold' : 'normal',
            backgroundColor: viewMode === 'list' ? '#007bff' : '#6c757d',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
          }}
        >
          List View
        </button>
        <button
          type="button"
          onClick={() => setViewMode('table')}
          style={{
            fontWeight: viewMode === 'table' ? 'bold' : 'normal',
            backgroundColor: viewMode === 'table' ? '#007bff' : '#6c757d',
            color: 'white',
            border: 'none',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
          }}
        >
          Table View
        </button>
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

      {viewMode === 'list' ? (
        <>
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
        </>
      ) : (
        <DataTable
          value={filteredProducts}
          paginator
          scrollable
          scrollHeight="420px"
          rows={rowsPerPage}
          first={currentPage * rowsPerPage}
          onPage={(e) => {
            setCurrentPage(e.page ?? 0)
            setRowsPerPage(e.rows)
          }}
          rowsPerPageOptions={[5, 10, 20]}
          sortMode="multiple"
          removableSort
          emptyMessage={
            isFiltering
              ? t('noSearchResults', { ns: 'products' })
              : t('emptyList', { ns: 'products' })
          }
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="{first} to {last} of {totalRecords}"
          loading={isFetchingNextPage}
        >
          <Column
            field="title"
            header="Title"
            sortable
            style={{ minWidth: '200px' }}
          />
          <Column
            field="price"
            header="Price"
            sortable
            body={(rowData: ProductSummary) => `$${rowData.price.toFixed(2)}`}
            style={{ width: '100px' }}
          />
          <Column
            field="category"
            header="Category"
            sortable
            style={{ width: '150px' }}
          />
          <Column
            header="Image"
            body={(rowData: ProductSummary) => (
              <img
                src={rowData.thumbnail}
                alt={rowData.title}
                style={{ width: '60px', height: '60px', objectFit: 'cover' }}
              />
            )}
            style={{ width: '80px' }}
          />
          <Column
            header="Action"
            body={(rowData: ProductSummary) => (
              <Link to={`/products/${rowData.id}`}>
                <button type="button">{t('button.viewDetails', { ns: 'common' })}</button>
              </Link>
            )}
            style={{ width: '120px' }}
          />
        </DataTable>
      )}
    </section>
  )
}

export default Products
