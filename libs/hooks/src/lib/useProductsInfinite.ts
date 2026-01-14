import { useInfiniteQuery } from '@tanstack/react-query'
import { fetchProducts, type ProductsResponse } from './api'

const DEFAULT_PAGE_SIZE = 20

type UseProductsInfiniteOptions = {
  isBroken: boolean
  loadFailedMessage: string
  pageSize?: number
}

export function useProductsInfinite({
  isBroken,
  loadFailedMessage,
  pageSize = DEFAULT_PAGE_SIZE,
}: UseProductsInfiniteOptions) {
  return useInfiniteQuery<ProductsResponse, Error>({
    queryKey: ['products', { broken: isBroken }],
    initialPageParam: 0,
    queryFn: async ({ pageParam = 0 }) => {
      if (isBroken) {
        const response = await fetch('https://dummyjson.com/does-not-exist')
        if (!response.ok) {
          throw new Error(loadFailedMessage)
        }
      }
      return fetchProducts(pageParam, pageSize)
    },
    getNextPageParam: (lastPage) => {
      const nextSkip = lastPage.skip + lastPage.limit
      return nextSkip < lastPage.total ? nextSkip : undefined
    },
  })
}
