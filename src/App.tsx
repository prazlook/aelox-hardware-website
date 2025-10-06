import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Index from './pages/Index'
import { ThemeProvider } from './components/theme-provider'
import { AsicProvider } from './context/AsicContext'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <AsicProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Index />} />
            </Routes>
          </Router>
        </AsicProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App