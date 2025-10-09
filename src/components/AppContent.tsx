import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import Layout from "@/components/Layout";
import WalletPage from "@/pages/Wallet";
import ConfigurationPage from "@/pages/Configuration";
import StatisticsPage from "@/pages/Statistics";
import AsicManagementPage from "@/pages/AsicManagement";
import DevOptionsPage from "@/pages/DevOptions";
import AppStoppedScreen from "@/pages/AppStoppedScreen";
import { useAppStatus } from "@/context/AppStatusContext";

const AppContent: React.FC = () => {
  const { isAppRunning } = useAppStatus();

  if (!isAppRunning) {
    return <AppStoppedScreen />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Index />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/wallet" element="/wallet" element={<WalletPage />} />
          <Route path="/asic-management" element={<AsicManagementPage />} />
          <Route path="/configuration" element={<ConfigurationPage />} />
          <Route path="/dev-options" element={<DevOptionsPage />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppContent;