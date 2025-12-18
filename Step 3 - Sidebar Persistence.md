# Step 3 — Persist Sidebar with a Custom `localStorage` Hook

## Hook design (how it works)

- `useLocalStorageState(key, defaultValue)` reads `localStorage.getItem(key)` on first load and tries to `JSON.parse` it.
- If the key is missing or the stored value is invalid JSON, it falls back to `defaultValue`.
- Whenever the state changes, it saves the new value back to `localStorage` via `localStorage.setItem(key, JSON.stringify(value))`.
- The hook guards against non-browser/SSR environments by checking for `window`/`localStorage` before reading/writing.
- This hook is used inside the Provider (`CartProvider`) to persist the global sidebar open/closed state.

## Manual persistence test results (expected)

- Open cart sidebar → refresh → should remain open.
- Close cart sidebar → refresh → should remain closed.

