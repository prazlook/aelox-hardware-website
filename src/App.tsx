import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppStoppedScreen from "./pages/AppStoppedScreen"; // Keep this import for AppStoppedScreen
import { SoundProvider } from "./context/SoundContext";
import { AsicProvider } from "./context/AsicContext";
import { AnimationProvider } from "./context/AnimationContext";
import { DevOptionsProvider } from "./context/DevOptionsContext";
import { AppStatusProvider } from "./context/AppStatusContext"; // No need for useAppStatus here anymore
import AppContent from "./components/AppContent"; // Import the new AppContent component

const queryClient = new QueryClient();

const App = () => {
  return (
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
};

export default App;