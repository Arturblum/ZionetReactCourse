import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// PrimeReact CSS (theme loaded dynamically, see theme.ts)
import 'primereact/resources/primereact.min.css'
import 'primeicons/primeicons.css'

import './index.css'
import './i18n' // Initialize i18n
import App from './App'
import { CartProvider } from './providers'
import { initializeTheme, loadPrimeReactTheme } from './stores/theme'

// Initialize theme on app startup (sets data-theme attribute and loads CSS)
const savedTheme = initializeTheme()
loadPrimeReactTheme(savedTheme)

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <CartProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </CartProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)
