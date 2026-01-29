"use client";

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home } from 'lucide-react';

const About = () => {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-white">À Propos</h1>
        <Button asChild variant="outline">
          <Link to="/" className="flex items-center gap-2">
            <Home size={18} />
            Retour
          </Link>
        </Button>
      </div>
      <div className="prose prose-invert">
        <p className="text-xl text-gray-300">
          Aelox Hardware est leader dans la conception de solutions de minage haute performance.
        </p>
      </div>
    </div>
  );
};

export default About;