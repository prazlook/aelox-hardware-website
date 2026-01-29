"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">Tableau de Bord</h1>
        <Button asChild variant="outline">
          <Link to="/" className="flex items-center gap-2">
            <Home size={18} />
            Retour
          </Link>
        </Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-theme-card p-6 rounded-xl border border-gray-800 h-32 flex items-center justify-center">
            <p className="text-gray-400">Statistique {i}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;