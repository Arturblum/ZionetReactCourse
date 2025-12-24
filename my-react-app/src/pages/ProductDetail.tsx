import { useMutation, useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { addProductToCart, fetchProduct, type Product } from '../api'
import { useCart } from '../contexts'
import { useNotificationsStore } from '../stores'

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
  } = useQuery<Product, Error>({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) {
        throw new Error(t('missingId', { ns: 'products' }))
      }
      return fetchProduct(id)
    },
    enabled: Boolean(id),
  })

  const addToCartMutation = useMutation({
    mutationFn: async () => {
      if (!data) {
        throw new Error(t('missingProduct', { ns: 'products' }))
      }
      return addProductToCart(data.id, 1)
    },
    onSuccess: () => {
      if (!data) return
      addItem(
        {
          id: data.id,
          title: data.title,
          price: data.price,
          thumbnail: data.thumbnail,
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
        message:
          mutationError instanceof Error
            ? mutationError.message
            : t('addToCartFailed', { ns: 'products' }),
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
    return <p>{t('loadingDetail', { ns: 'products' })}</p>
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
