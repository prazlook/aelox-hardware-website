import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom'
import Index from './pages/Index'
import { ThemeProvider } from './components/ui/theme-provider'
import { AsicProvider } from './context/AsicContext'
import { SoundProvider } from './context/SoundContext' // Import SoundProvider
import AppStoppedScreen from './pages/AppStoppedScreen'
import { useState } from 'react'
import Layout from './components/Layout' // Import Layout
import StatisticsPage from './pages/Statistics' // Import StatisticsPage
import WalletPage from './pages/Wallet' // Import WalletPage
import AsicManagementPage from './pages/AsicManagement' // Import AsicManagementPage
import ConfigurationPage from './pages/Configuration' // Import ConfigurationPage
import DevOptionsPage from './pages/DevOptions' // Import DevOptionsPage
import NotFound from './pages/NotFound' // Import NotFound
import { AppStatusProvider } from './context/AppStatusContext' // Import AppStatusProvider
import { DevOptionsProvider } from './context/DevOptionsContext' // Import DevOptionsProvider
import { AnimationProvider } from './context/AnimationContext' // Import AnimationProvider


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
        <AppStatusProvider>
          <AsicProvider>
            <SoundProvider>
              <DevOptionsProvider>
                <AnimationProvider>
                  <Router>
                    <Routes>
                      <Route path="/" element={<Layout />}>
                        <Route index element={<Index />} />
                        <Route path="/statistics" element={<StatisticsPage />} />
                        <Route path="/wallet" element={<WalletPage />} />
                        <Route path="/asic-management" element={<AsicManagementPage />} />
                        <Route path="/configuration" element={<ConfigurationPage />} />
                        <Route path="/dev-options" element={<DevOptionsPage />} />
                        <Route path="*" element={<NotFound />} />
                      </Route>
                    </Routes>
                  </Router>
                </AnimationProvider>
              </DevOptionsProvider>
            </SoundProvider>
          </AsicProvider>
        </AppStatusProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

export default App