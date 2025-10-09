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
import { AsicProvider, useAsics } from "./context/AsicContext";
import { AnimationProvider } from "./context/AnimationContext";
import { DevOptionsProvider } from "./context/DevOptionsContext";
import { AppStatusProvider, useAppStatus } from "./context/AppStatusContext";
import { StartupIntro } from "./components/StartupIntro";
import { useMemo } from "react";
import { StatusLevel } from "./components/GlobalStatusIndicator";

const queryClient = new QueryClient();

const AppContent = () => {
  const { appPhase } = useAppStatus();
  const { asics } = useAsics();
  
  const summary = useMemo(() => {
    const totalAsicsCount = asics.length;
    const totalHashrate = asics.reduce((acc, a) => acc + a.hashrate, 0);
    const overclockedCount = asics.filter(a => a.status === 'overclocked').length;
    const isOverclockedMajority = totalAsicsCount > 0 && (overclockedCount / totalAsicsCount) >= 0.7;

    return {
      totalHashrate,
      isOverclockedMajority,
    };
  }, [asics]);

  const globalStatus: StatusLevel = useMemo(() => {
    const hasError = asics.some(a => a.status === 'error');
    const hasOverheat = asics.some(a => a.status === 'overheat');
    const allOffline = asics.every(a => a.status === 'offline');
    const avgTemp = asics.length > 0 ? asics.reduce((acc, a) => acc + a.temperature, 0) / asics.length : 0;

    let tempStatusLevel: 'optimal' | 'faible' | 'eleve' | 'surcharge';
    if (avgTemp > 85) tempStatusLevel = 'surcharge';
    else if (avgTemp > 70) tempStatusLevel = 'eleve';
    else if (avgTemp > 40) tempStatusLevel = 'optimal';
    else tempStatusLevel = 'faible';

    if (hasError) return 'error';
    if (hasOverheat || tempStatusLevel === 'surcharge') return 'surcharge';
    if (tempStatusLevel === 'eleve') return 'eleve';
    if (allOffline) return 'offline';
    
    return 'optimal';
  }, [asics]);


  if (appPhase === 'stopped') {
    return <AppStoppedScreen />;
  }

  return (
    <>
      {(appPhase === 'intro' || appPhase === 'main_ui_loading') && (
        <StartupIntro
          status={globalStatus}
          hashrate={summary.totalHashrate}
          asics={asics}
          isOverclockedMajority={summary.isOverclockedMajority}
        />
      )}

      {/* The condition appPhase !== 'stopped' is redundant here as it's handled by the early return above */}
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
    </>
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