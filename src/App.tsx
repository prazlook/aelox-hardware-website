import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import WalletPage from "./pages/Wallet";
import ConfigurationPage from "./pages/Configuration";
import StatisticsPage from "./pages/Statistics";
import AsicManagementPage from "./pages/AsicManagement";
import DevOptionsPage from "./pages/DevOptions";
import { SoundProvider } from "./context/SoundContext";
import { AsicProvider } from "./context/AsicContext";
import { AnimationProvider } from "./context/AnimationContext";
import { DevOptionsProvider, useDevOptions } from "./context/DevOptionsContext";
import StartupAnimation from "./components/StartupAnimation";
import { useState, useEffect } from "react";
import { Button } from "./components/ui/button";
import { Power } from "lucide-react";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isAppActive, setIsAppActive } = useDevOptions();
  const [showStartupAnimation, setShowStartupAnimation] = useState(isAppActive);

  useEffect(() => {
    if (isAppActive) {
      setShowStartupAnimation(true);
    }
  }, [isAppActive]);

  const handleAnimationComplete = () => {
    setShowStartupAnimation(false);
  };

  const handleActivateApp = () => {
    setIsAppActive(true);
  };

  if (!isAppActive) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-theme-dark text-white">
        <Button onClick={handleActivateApp} className="bg-green-600 hover:bg-green-700 text-white text-lg px-8 py-4 rounded-full">
          <Power className="w-6 h-6 mr-2" /> Activer
        </Button>
      </div>
    );
  }

  if (showStartupAnimation) {
    return <StartupAnimation onAnimationComplete={handleAnimationComplete} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Index />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/wallet" element={<WalletPage />} />
          <Route path="/asic-management" element={<AsicManagementPage />} />
          <Route path="/configuration" element={<ConfigurationPage />} />
          <Route path="/dev-options" element={<DevOptionsPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SoundProvider>
        <AsicProvider>
          <AnimationProvider>
            <DevOptionsProvider>
              <Toaster />
              <Sonner />
              <AppContent />
            </DevOptionsProvider>
          </AnimationProvider>
        </AsicProvider>
      </SoundProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;