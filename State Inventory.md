# State Inventory

This document lists the current pieces of state in this project and classifies each as **server state** (API-backed, cacheable, syncable) vs **client/UI state** (frontend-only).

## Server state (TanStack Query)

- **Products list (paginated)** — **Server state**  
  - Stored in React Query cache under `queryKey: ['products']` via `useInfiniteQuery` in `my-react-app/src/pages/Products.tsx`.

- **Products pagination cursor (`skip` / `pageParam`)** — **Server state**  
  - Managed as part of the infinite query’s page params (`initialPageParam`, `getNextPageParam`) in `my-react-app/src/pages/Products.tsx`.

- **Single product detail (by id)** — **Server state**  
  - Stored in React Query cache under `queryKey: ['product', id]` via `useQuery` in `my-react-app/src/pages/ProductDetail.tsx`.

- **Request lifecycle flags/errors for queries** (e.g. `isLoading`, `isError`, `error`, `isFetchingNextPage`, `hasNextPage`) — **Server state**  
  - Exposed by TanStack Query hooks and derived from query cache/network status.

## Client/UI state (local component state)

- **Contact form fields** (`firstName`, `lastName`, `email`, `phone`) — **Client/UI state**  
  - Local `useState` in `my-react-app/src/CheckInForm.tsx`.

- **Saved contacts list** (`contacts: Contact[]`) — **Client/UI state**  
  - Local `useState` in `my-react-app/src/CheckInForm.tsx` (in-memory only; not persisted or synced to a backend).

- **Contacts count label** (`countLabel`) — **Client/UI state** (derived UI state)  
  - Local `useState` updated from `contacts.length` in `my-react-app/src/CheckInForm.tsx`.

## Client/UI state (router/URL state)

- **Selected product id** (`id` route param) — **Client/UI state**  
  - Comes from the URL via React Router `useParams` in `my-react-app/src/pages/ProductDetail.tsx`.

## Client/UI state (global app state via Context)

- **Cart sidebar open/closed** (`isOpen`) — **Client/UI state**  
  - Global UI state stored in Context in `my-react-app/src/cart/CartContext.tsx`.

- **Cart contents** (`items: CartItem[]`) — **Client/UI state**  
  - Global client state stored in Context (persisted to `localStorage` as `cart-items`) in `my-react-app/src/cart/CartContext.tsx`.

- **Cart item quantity** (`CartItem.quantity`) — **Client/UI state**  
  - Stored per item inside `items` in `my-react-app/src/cart/CartContext.tsx`.

## Context API (Cart sidebar)

- **Fields:** `isOpen`, `items`
- **Actions:** `open()`, `close()`, `toggle()`, `addItem()`, `removeItem()`, `clear()`

## Side effects (not state, but driven by state)

- **Document title** — derived from `contacts.length`  
  - Updated via `useEffect` in `my-react-app/src/CheckInForm.tsx`.

## Derived UI values (computed, not stored)

- **Cart badge count** — derived from `items.length` in `my-react-app/src/App.tsx`.
- **Cart total** — derived from `items` in `my-react-app/src/cart/CartSidebar.tsx`.

## Client/UI state (global app state via Zustand)

- **Theme** (`theme: 'light' | 'dark'`) — **Client/UI state**  
  - Global UI preference stored in Zustand (persisted to `localStorage`) in `my-react-app/src/stores/theme.ts`.

## Conclusion

The products list, pagination cursor, product detail, and all loading/error flags clearly belong in **TanStack Query** because they’re API-backed and benefit from caching and request lifecycle management. The cart sidebar open/close flag and cart contents make sense as **global client state** because multiple routes can add items and the header/sidebar can read it, and theme is also a good global UI preference (especially when persisted). The contact form fields and contacts list are best kept as **local UI state** inside `CheckInForm` since they’re only used there and aren’t synced to a server.
