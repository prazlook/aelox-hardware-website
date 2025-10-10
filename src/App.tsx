import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Index from './pages/Index'
import { ThemeProvider } from './components/ui/theme-provider' // Chemin corrigé
import { AsicProvider } from './context/AsicContext'
import AppStoppedScreen from './pages/AppStoppedScreen'
import { useState } from 'react'

const queryClient = new QueryClient()

function App() {
  const [isAppRunning, setIsAppRunning] = useState(false) // Initialisez à false pour afficher l'écran d'arrêt au démarrage si nécessaire

  const handleRestart = () => {
    setIsAppRunning(true)
    // Ici, vous pourriez ajouter une logique pour réellement redémarrer l'application ou recharger des données
    console.log("Application redémarrée !")
  }

  if (!isAppRunning) {
    return <AppStoppedScreen onRestart={handleRestart} />
  }

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