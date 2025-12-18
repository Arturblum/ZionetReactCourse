# Bonus A — Theme Toggle (Zustand)

## What was added

- A global theme store (`'light' | 'dark'`) using Zustand and persisted to `localStorage`.
- A header toggle button that switches the theme.
- The app applies the theme by setting `document.documentElement.dataset.theme` and using CSS variables for colors.

## Where it lives

- Store: `my-react-app/src/stores/theme.ts`
- Toggle button + applying the theme attribute: `my-react-app/src/App.tsx`
- Theme variables: `my-react-app/src/index.css`

