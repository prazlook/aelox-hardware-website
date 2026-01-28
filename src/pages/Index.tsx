import React from 'react';
import { Button } from '@/components/ui/button';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { Link } from 'react-router-dom';
import { cn } from '@/lib/utils'; // Import cn for conditional classNames
import { AnimatedButtonText } from '@/components/AnimatedButtonText'; // Import new component

const HomePage = () => {
  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center text-center p-4 sm:p-8">
      <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-white mb-6 animate-fade-in-slide-up" style={{ animationDelay: '0.2s' }}>
        Aelox <span className="text-theme-cyan">Hardware</span>
      </h1>
      <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mb-10 animate-fade-in-slide-up" style={{ animationDelay: '0.4s' }}>
        Votre partenaire de confiance pour des solutions matérielles innovantes et performantes.
        Découvrez notre expertise en minage de cryptomonnaies et bien plus encore.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-slide-up" style={{ animationDelay: '0.6s' }}>
        <Button asChild className="bg-theme-cyan text-black hover:bg-theme-cyan/90 px-8 py-6 text-lg rounded-xl shadow-lg">
          <Link to="/dashboard" className={cn("relative overflow-hidden flex items-center justify-center animate-button-build")} style={{ animationDelay: '0.8s' }}>
            <AnimatedButtonText startTypingDelay={1.4}>
              Accéder au Tableau de Bord
            </AnimatedButtonText>
          </Link>
        </Button>
        <Button asChild variant="outline" className="border-gray-600 text-white hover:bg-gray-800 px-8 py-6 text-lg rounded-xl shadow-lg">
          <Link to="/about" className={cn("relative overflow-hidden flex items-center justify-center animate-button-build")} style={{ animationDelay: '1.0s' }}>
            <AnimatedButtonText startTypingDelay={1.6}>
              En savoir plus
            </AnimatedButtonText>
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