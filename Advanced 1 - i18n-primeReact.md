# Advanced 1 - i18n + PrimeReact Theming

## Step 0 - Prep
Starting Advanced 1 from existing app. API used: DummyJSON (https://dummyjson.com/products).

## Step 1 - i18n Setup
- **Locales**: English (en), Hebrew (he)
- **Namespaces**: `common` (header, buttons, generic UI), `products` (catalog/list/detail strings)

## Step 2 - i18n Usage Examples

1. **Interpolation**: `header.cart` key in App.tsx header navigation
   - Translation: `"Cart ({{count}})"`
   - Location: Header navigation shows "Cart (0)", "Cart (1)", etc. with dynamic count

2. **Pluralization**: `showingCount` key in Products.tsx
   - Translation: `"Showing {{count}} product"` / `"Showing {{count}} products"`
   - Location: Products page top section shows "Showing 5 products" with proper plural form

3. **Trans Component**: `testErrorToast` key in Products.tsx
   - Translation: `"Test error toast: <0>Open a fake product</0>"`
   - Location: Products page debug links section, embeds a clickable Link component inside translated text
