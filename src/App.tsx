import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Index from "./pages/Index";
import Settings from "./pages/Settings";
import DevOptionsPage from "./pages/DevOptions";
import { AppStoppedScreen } from "./pages/AppStoppedScreen"; // Correction de l'importation
import { SoundProvider } from "./context/SoundContext";
import { AppStatusProvider } from "./context/AppStatusContext";
import { ThemeProvider } from "./components/theme-provider";

function App() {
  const [isAppRunning, setIsAppRunning] = useState(false); // Initial state for app status

  useEffect(() => {
    // Simulate app startup logic
    const timer = setTimeout(() => {
      setIsAppRunning(true);
    }, 3000); // App starts after 3 seconds

    return () => clearTimeout(timer);
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <AppStatusProvider>
        <SoundProvider>
          <Router>
            <Routes>
              {isAppRunning ? (
                <Route path="/" element={<Layout />}>
                  <Route index element={<Index />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="dev-options" element={<DevOptionsPage />} />
                </Route>
              ) : (
                <Route path="*" element={<AppStoppedScreen />} />
              )}
            </Routes>
          </Router>
        </SoundProvider>
      </AppStatusProvider>
    </ThemeProvider>
  );
}

export default App;