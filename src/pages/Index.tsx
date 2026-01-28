import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { MadeWithDyad } from '@/components/made-with-dyad';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const h1Text = "Aelox Hardware";
  const pText = "Votre partenaire de confiance pour des solutions matérielles innovantes et performantes. Découvrez notre expertise en minage de cryptomonnaies et bien plus encore.";

  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col items-center justify-center text-center p-4 sm:p-8">
      <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-white mb-6 font-orbitron">
        <span
          className="inline-block animate-text-reveal typewriter-cursor"
          style={{
            animationDelay: '0.2s',
            '--text-reveal-duration': `${h1Text.length * 0.08}s`, // Dynamic duration
            '--text-reveal-steps': h1Text.length, // Dynamic steps
          } as React.CSSProperties}
        >
          Aelox <span className="text-theme-cyan">Hardware</span>
        </span>
      </h1>
      <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mb-10 font-orbitron">
        <span
          className="inline-block animate-text-reveal typewriter-cursor"
          style={{
            animationDelay: '0.8s',
            '--text-reveal-duration': `${pText.length * 0.03}s`, // Dynamic duration
            '--text-reveal-steps': pText.length, // Dynamic steps
          } as React.CSSProperties}
        >
          {pText}
        </span>
      </p>
      <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-slide-up" style={{ animationDelay: '1.5s' }}>
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