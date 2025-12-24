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

## Step 4 - RTL Mode

### Implementation
When Hebrew language is active, the app automatically sets `document.documentElement.dir = "rtl"` and `document.documentElement.lang = "he"` to enable proper right-to-left layout.

### RTL Issues Fixed

1. **Sidebar positioning and border** → Fixed positioning from right to left side
   - Issue: Sidebar opened from the right side with `border-left`, causing incorrect visual appearance in RTL
   - Fix: Added CSS rule `[dir='rtl'] .sidebar-panel` to flip position to `left: 0`, swap border to `border-right`, and reverse transform direction to `translateX(-24px)`

2. **Toast notifications positioning** → Fixed placement from right to left corner
   - Issue: Toast notifications appeared in top-right corner (`right: 1rem`), which is incorrect for RTL languages
   - Fix: Added CSS rule `[dir='rtl'] .toast-host` to reposition toasts to top-left corner by setting `left: 1rem` and removing `right` property

### Screenshots
- RTL mode (Hebrew): [step4-rtl-fixed.png](docs/screenshots/step4-rtl-fixed.png)
- RTL sidebar demonstration: [step4-rtl-sidebar.png](docs/screenshots/step4-rtl-sidebar.png)

## Step 5 - PrimeReact DataTable

### Implementation
Converted the Products page list view to use PrimeReact's DataTable component with the following features:

### DataTable Columns
1. **Title** - Product name (sortable)
2. **Price** - Formatted as currency with $ symbol (sortable)
3. **Category** - Product category (sortable)
4. **Image** - Thumbnail image (60x60px, object-fit: cover)
5. **Action** - "View Details" button linking to product detail page

### Features Implemented
1. **Sorting** - Multi-column sorting enabled on Title, Price, and Category columns
   - Click column headers to sort ascending/descending
   - Supports sorting by multiple columns simultaneously
   - Visual indicators show sort direction

2. **Pagination** - Full pagination controls with customizable rows per page
   - 10 rows per page by default
   - Dropdown to select 5, 10, or 20 rows per page
   - Navigation buttons: First Page, Previous, Page Numbers, Next, Last Page
   - Current page report shows "1 to 10 of 20" format

### Screenshots
- DataTable in Hebrew with sorting by price: [step5-datatable.png](docs/screenshots/step5-datatable.png)
- DataTable in English: [step5-datatable-english.png](docs/screenshots/step5-datatable-english.png)

