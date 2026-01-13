import { useMutation } from '@tanstack/react-query'
import { addProductToCart, type Product } from './api'

type UseAddToCartMutationOptions = {
  product?: Product
  missingProductMessage: string
  onSuccess?: (product: Product) => void
  onError?: (error: Error) => void
}

export function useAddToCartMutation({
  product,
  missingProductMessage,
  onSuccess,
  onError,
}: UseAddToCartMutationOptions) {
  return useMutation({
    mutationFn: async () => {
      if (!product) {
        throw new Error(missingProductMessage)
      }
      return addProductToCart(product.id, 1)
    },
    onSuccess: () => {
      if (product) {
        onSuccess?.(product)
      }
    },
    onError: (error) => {
      const resolvedError = error instanceof Error ? error : new Error(String(error))
      onError?.(resolvedError)
    },
  })
}
