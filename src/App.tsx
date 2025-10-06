import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import IndexPage from './pages/Index';
import StatisticsPage from './pages/Statistics';
import { AsicProvider } from './context/AsicContext';
import { Toaster } from "@/components/ui/toaster"

function App() {
  return (
    <AsicProvider>
      <Router>
        <div className="bg-theme-bg min-h-screen text-theme-text">
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/statistics" element={<StatisticsPage />} />
          </Routes>
        </div>
      </Router>
      <Toaster />
    </AsicProvider>
  );
}

export default App;