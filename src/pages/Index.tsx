"use client";

import React from 'react';
import { Button } from '@/components/ui/button';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center text-center p-4 sm:p-8 pt-64">
      <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-white mb-6">
        Aelox <span className="text-white">Hardware</span>
      </h1>
      <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mb-10">
        Ne planez plus, courbez l'avenir.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Button asChild className="bg-theme-cyan text-black hover:bg-theme-cyan/90 px-8 py-6 text-lg rounded-xl shadow-lg transition-transform hover:scale-105 active:scale-95">
          <Link to="/dashboard">
            Commander Aetheris-4 Gen 0
          </Link>
        </Button>

        <Button asChild variant="outline" className="border-gray-600 text-white hover:bg-gray-800 px-8 py-6 text-lg rounded-xl shadow-lg">
          <Link to="/about">
            Explorer le projet
          </Link>
        </Button>
      </div>
      <div className="mt-auto pt-16">
        <MadeWithDyad />
      </div>
    </div>
  );
};

export default HomePage;