import { createRoot } from 'react-dom/client'
import 'baseline-status'
import './style.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AppHeader } from './components/app-header'
import { Dashboard } from './components/dashboard'
import { WEB_FEATURES } from './constants/web-features'

const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppHeader />
      <Dashboard featureIds={WEB_FEATURES} />
    </QueryClientProvider>
  )
}

const container = document.getElementById('app')
if (container) {
  createRoot(container).render(<App />)
}
