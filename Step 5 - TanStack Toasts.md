# Step 5 — Connect Toasts to Real Events with TanStack Query

## Success toast (real API operation)

When clicking **Add to cart** on the product detail page, a TanStack Query `useMutation` runs a real `POST` request to the DummyJSON API (`/carts/add`). If the request succeeds, a toast is added to the global store with the message **"Product added to cart"** and it can be dismissed via the toast close button.

- Mutation + toast: `my-react-app/src/pages/ProductDetail.tsx`
- API call: `my-react-app/src/api/products.ts`

## Success toast (mark favorite)

When clicking **Mark favorite** (or **Unfavorite**) on the product detail page, a TanStack Query `useMutation` runs a real `PUT` request to DummyJSON (`/products/:id`) to update a `favorite` field. On success it shows a toast (“Marked as favorite” / “Removed from favorites”) and updates the cached `['product', id]` query so the button label reflects the new state.

## Error toast (failed products query)

On the products page, if the products query fails, an error toast is shown with the message **"Failed to load products"** while the page still renders its normal inline error UI (“Something went wrong…”). You can reliably trigger the failure by opening **Simulate products API error** which adds `?broken=1` to the `/products` URL.
