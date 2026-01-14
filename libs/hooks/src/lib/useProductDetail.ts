import { useQuery } from '@tanstack/react-query'
import { fetchProduct, type Product } from './api'

type UseProductDetailOptions = {
  id?: string
  missingIdMessage: string
}

export function useProductDetail({ id, missingIdMessage }: UseProductDetailOptions) {
  return useQuery<Product, Error>({
    queryKey: ['product', id],
    queryFn: async () => {
      if (!id) {
        throw new Error(missingIdMessage)
      }
      return fetchProduct(id)
    },
    enabled: Boolean(id),
  })
}
