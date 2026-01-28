import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

const HomePage = () => {
  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center text-center p-4 sm:p-8">
      <h1 
        className={cn(
          "text-5xl sm:text-6xl font-bold tracking-tight mb-6",
          "text-neon-cyan"
        )} 
        style={{ 
          animationName: "fade-in-slide-up, neon-pulse",
          animationDuration: "0.8s, 2s",
          animationTimingFunction: "ease-out, ease-in-out",
          animationDelay: "0.2s, 1s",
          animationFillMode: "forwards, none",
          animationIterationCount: "1, infinite",
          animationDirection: "normal, alternate"
        }}
      >
        Aelox <span className="text-theme-cyan">Hardware</span>
      </h1>
      <p 
        className={cn(
          "text-lg sm:text-xl max-w-2xl mb-10",
          "text-neon-blue"
        )} 
        style={{ 
          animationName: "fade-in-slide-up, neon-pulse",
          animationDuration: "0.8s, 2s",
          animationTimingFunction: "ease-out, ease-in-out",
          animationDelay: "0.4s, 1.2s",
          animationFillMode: "forwards, none",
          animationIterationCount: "1, infinite",
          animationDirection: "normal, alternate"
        }}
      >
        Votre partenaire de confiance pour des solutions matérielles innovantes et performantes.
        Découvrez notre expertise en minage de cryptomonnaies et bien plus encore.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-slide-up" style={{ animationDelay: '0.6s' }}>
        <Button asChild className="bg-theme-cyan text-black hover:bg-theme-cyan/90 px-8 py-6 text-lg rounded-xl shadow-lg">
          <Link to="/dashboard">
            Accéder au Tableau de Bord <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
        <Button asChild variant="outline" className="border-gray-600 text-white hover:bg-gray-800 px-8 py-6 text-lg rounded-xl shadow-lg">
          <Link to="/about">
            En savoir plus
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