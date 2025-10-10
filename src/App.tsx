"use client";

import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AppStatusProvider, useAppStatus } from "./context/AppStatusContext";
import { SoundProvider } from "./context/SoundContext";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { GlobalStatusIndicator } from "./components/GlobalStatusIndicator";
import IndexPage from "./pages/Index";
import DevOptionsPage from "./pages/DevOptions";
import { AppStoppedScreen } from "./pages/AppStoppedScreen";

const AppContent = () => {
  const { isAppRunning } = useAppStatus();

  if (!isAppRunning) {
    return <AppStoppedScreen />;
  }

  return (
    <div className="flex h-screen bg-theme-dark text-theme-text-primary">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header />
        <main className="flex-1 p-6 pt-20 overflow-auto"> {/* Added pt-20 to account for fixed header */}
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/dev-options" element={<DevOptionsPage />} />
            {/* Add other routes here */}
          </Routes>
        </main>
        {/* Passage des props requises au GlobalStatusIndicator */}
        <GlobalStatusIndicator 
          status="online" // Exemple de valeur
          hashrate="1.2 TH/s" // Exemple de valeur
          asics={12} // Exemple de valeur
          isOverclockedMajority={false} // Exemple de valeur
        />
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <SoundProvider>
        <AppStatusProvider>
          <AppContent />
        </AppStatusProvider>
      </SoundProvider>
    </Router>
  );
}

export default App;