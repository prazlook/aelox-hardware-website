"use client";

import React from 'react';

const AppStoppedScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="text-center space-y-6">
        <p className="text-xl text-gray-400">
          Tous les systèmes sont hors ligne.
        </p>
        <p className="text-lg text-gray-500">
          Veuillez contacter l'administrateur pour plus d'informations.
        </p>
      </div>
    </div>
  );
};

export default AppStoppedScreen;