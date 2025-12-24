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

## Step 3 - Language Switcher + Persistence

### Implementation
Added a language switcher button in the header that toggles between English and Hebrew. The button displays the current language name in that language (e.g., "Language: English" or "שפה: עברית").

### How Persistence Works
1. When the app first loads, it checks localStorage for a saved language preference using the key `app-language`
2. If a saved language exists, it automatically switches to that language before the UI renders
3. When the user clicks the language switcher button, it calls `i18n.changeLanguage()` to update the UI immediately
4. The new language selection is saved to localStorage so it persists across page reloads
5. If no language is saved in localStorage, the app defaults to English (en)

### Screenshots
- English version: [step3-english.png](docs/screenshots/step3-english.png)
- Hebrew version: [step3-hebrew.png](docs/screenshots/step3-hebrew.png)
- After refresh (Hebrew persisted): [step3-hebrew-after-refresh.png](docs/screenshots/step3-hebrew-after-refresh.png)
