import { createRoot } from 'react-dom/client'
import 'baseline-status'
import './style.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Dashboard } from './components/dashboard'
import { WEB_FEATURES } from './constants/web-features'

const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <header className="appHeader">
        <h1 className="appTitle">Baseline feature dashboard</h1>
        <p className="appSubtitle">
          Keep an eye on Baseline status from{' '}
          <a
            href="https://webstatus.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="appLink"
          >
            webstatus.dev
          </a>
          .
        </p>
      </header>
      <Dashboard featureIds={[...WEB_FEATURES]} />
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}

const container = document.getElementById('app')
if (container) {
  createRoot(container).render(<App />)
}
