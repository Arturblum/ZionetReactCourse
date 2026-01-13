import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useAddToCartMutation, useCart, useNotificationsStore, useProductDetail } from '@my-app/hooks'
import { GlobalLoader } from '@my-app/ui'

export const ProductDetail = () => {
  const { id } = useParams<{ id: string }>()
  const { addItem } = useCart()
  const addNotification = useNotificationsStore((s) => s.addNotification)
  const { t } = useTranslation(['products', 'common'])

  const {
    data,
    isLoading,
    isError,
    error,
  } = useProductDetail({
    id,
    missingIdMessage: t('missingId', { ns: 'products' }),
  })

  const addToCartMutation = useAddToCartMutation({
    product: data,
    missingProductMessage: t('missingProduct', { ns: 'products' }),
    onSuccess: (product) => {
      addItem(
        {
          id: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
        },
        { notify: false },
      )
      addNotification({
        type: 'success',
        message: t('addToCartSuccess', { ns: 'products' }),
        timeout: 3000,
      })
    },
    onError: (mutationError) => {
      addNotification({
        id: `add-to-cart-error:${id ?? 'missing-id'}`,
        type: 'error',
        message: mutationError.message || t('addToCartFailed', { ns: 'products' }),
        timeout: 6000,
      })
    },
  })

  useEffect(() => {
    if (!isError) return
    addNotification({
      id: `product-load-error:${id ?? 'missing-id'}`,
      type: 'error',
      message: error?.message ?? t('errors.detailLoadFailed', { ns: 'products' }),
      timeout: 6000,
    })
  }, [isError, error, id, addNotification, t])

  if (!id) {
    return <p>{t('missingId', { ns: 'products' })}</p>
  }

  if (isLoading) {
    return <GlobalLoader message={t('loadingDetail', { ns: 'products' })} />
  }

  if (isError) {
    return (
      <p>
        {t('detailError', { ns: 'products' })} {error.message}
      </p>
    )
  }

  return (
    <section className="card">
      <Link to="/products">← {t('backToProducts', { ns: 'products' })}</Link>
      <h2>{data?.title}</h2>
      <img
        src={data?.thumbnail}
        alt={data?.title}
        style={{ maxWidth: '250px', borderRadius: '0.5rem' }}
      />
      <p>
        <strong>{t('details.description', { ns: 'products' })}:</strong> {data?.description}
      </p>
      <p>
        <strong>
          {t('details.price', { ns: 'products' })}: ${data?.price}
        </strong>
      </p>
      <button
        type="button"
        onClick={() => addToCartMutation.mutate()}
        disabled={!data || addToCartMutation.isPending}
      >
        {addToCartMutation.isPending
          ? t('addingToCart', { ns: 'products' })
          : t('button.addToCart', { ns: 'common' })}
      </button>
    </section>
  )
}
