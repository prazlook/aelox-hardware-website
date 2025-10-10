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
import AppStoppedScreen from "./pages/AppStoppedScreen";
import { SoundProvider } from "./context/SoundContext";
import { AsicProvider } from "./context/AsicContext";
import { AnimationProvider } from "./context/AnimationContext";
import { DevOptionsProvider } from "./context/DevOptionsContext";
import { AppStatusProvider, useAppStatus } from "./context/AppStatusContext";
import { cn } from "./lib/utils"; // Import cn for conditional classNames

const queryClient = new QueryClient();

const AppContent = () => {
  const { isAppRunning, triggerShutdownAnimation } = useAppStatus();

  if (!isAppRunning && !triggerShutdownAnimation) { // Only show stopped screen if not running AND not animating shutdown
    return <AppStoppedScreen />;
  }

  return (
    <div className={cn(triggerShutdownAnimation && "animate-app-shutdown")}>
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
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SoundProvider>
        <AsicProvider>
          <AnimationProvider>
            <DevOptionsProvider>
              <AppStatusProvider>
                <Toaster />
                <Sonner />
                <AppContent />
              </AppStatusProvider>
            </DevOptionsProvider>
          </AnimationProvider>
        </AsicProvider>
      </SoundProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;