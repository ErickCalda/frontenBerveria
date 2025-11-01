import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const LoadingOverlay = ({ 
  isVisible, 
  message = 'Procesando...', 
  subMessage = '' 
}) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-zinc-800 rounded-xl p-8 shadow-2xl max-w-md mx-4 text-center">
        <LoadingSpinner 
          size="lg" 
          color="yellow-400" 
          text="" 
          className="justify-center mb-4"
        />
        <h3 className="text-xl font-semibold text-white mb-2">
          {message}
        </h3>
        {subMessage && (
          <p className="text-zinc-400 text-sm">
            {subMessage}
          </p>
        )}
        <div className="mt-4 bg-zinc-700 rounded-lg p-3">
          <p className="text-yellow-400 text-xs">
            ⏳ Por favor espera mientras procesamos tu reserva...
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingOverlay;

