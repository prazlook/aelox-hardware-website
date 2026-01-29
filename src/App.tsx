"use client";

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Dashboard from './pages/Dashboard';
import About from './pages/About';
import AppStoppedScreen from './pages/AppStoppedScreen';
import { AppStatusProvider, useAppStatus } from './context/AppStatusContext';
import { cn } from './lib/utils';

const AppContent = () => {
  const { isAppRunning, triggerShutdownAnimation } = useAppStatus();

  if (!isAppRunning) {
    return <AppStoppedScreen />;
  }

  return (
    <div className={cn(
      "min-h-screen bg-theme-dark transition-all duration-1000",
      triggerShutdownAnimation && "animate-app-shutdown"
    )}>
      <main className="container mx-auto pb-20 pt-8">
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <AppStatusProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AppStatusProvider>
  );
}

export default App;