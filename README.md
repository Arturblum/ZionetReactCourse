# ZionetReactCourse

This repo hosts a simple Vite + React + TypeScript app in `my-react-app`. The app is a contact form with an About page powered by React Router. It collects first/last name, email, and phone, shows saved contacts, and updates a badge count + document title as you add entries.

## Advanced 1 Homework - i18n Setup

**Starting Point:** Path A - continuing from existing app with TanStack Query.
Starting Advanced 1 from commit `972c364`. API used: FakeStore API (https://fakestoreapi.com).

### Step 1 - i18n Setup ✅

**Locales:** English (en) and Hebrew (he)

**Namespaces:**
- `common` - Header, buttons, generic UI labels (navigation links, cart button, theme button, loading states, errors)
- `products` - Product catalog, list, and detail page strings (product titles, search, counts, product details)

**Implementation:**
- Installed `i18next` and `react-i18next`
- Created `/src/i18n.ts` with configuration and translation resources
- Initialized i18n in `main.tsx` entry point
- Both languages support interpolation (e.g., "Cart ({{count}})", "Showing {{count}} products")
- Both languages support pluralization (e.g., "1 product" vs "2 products")
- Hebrew translations include RTL support

### Step 2 - Use i18n for real ✅

**Example keys used in UI:**
- Interpolation: `products.showingCount` on the Products page (shows count)
- Pluralization: `products.showingCount` on the Products page (1 vs many)
- `<Trans />`: `products.testErrorToast` on the Products page (link inside translation)

## Getting started
1) `cd my-react-app`
2) Install deps: `npm install`
3) Start dev server: `npm run dev` (opens at http://localhost:5173)
4) Build for production: `npm run build`
5) Preview production build: `npm run preview`

## Notes
- Routes: `/` for the contact form, `/about` for the static page.
- Tooling: Vite, TypeScript, React Router, and ESLint with React hooks/refresh rules.
