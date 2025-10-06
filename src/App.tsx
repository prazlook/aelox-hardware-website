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
import { ConfigProvider } from "./context/ConfigContext";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SoundProvider>
        <AsicProvider>
          <AnimationProvider>
            <ConfigProvider>
              <Toaster />
              <Sonner />
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
            </ConfigProvider>
          </AnimationProvider>
        </AsicProvider>
      </SoundProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;