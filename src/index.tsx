import { render } from 'preact'
import 'baseline-status'
import './style.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { FeatureDashboard } from './components/feature-dashboard'
import { WEB_FEATURES } from './constants/web-features'

const queryClient = new QueryClient()

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <header class="appHeader">
        <h1 class="appTitle">Baseline feature dashboard</h1>
        <p class="appSubtitle">
          Browse Baseline status from webstatus.dev, and star your favorites.
        </p>
      </header>
      <FeatureDashboard featureIds={[...WEB_FEATURES]} />
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}

render(<App />, document.getElementById('app'))
