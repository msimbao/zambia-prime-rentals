import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingOverlay = ({ 
  isLoading, 
  message = "Loading...",
  progress = null 
}) => {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm mx-4 text-center">
        <div className="flex justify-center mb-4">
          <Loader2 className="h-16 w-16 text-blue-500 animate-spin" />
        </div>
        
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {message}
        </h3>
        
        {progress !== null && (
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
              <div 
                className="bg-blue-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 font-medium">
              {progress}%
            </p>
          </div>
        )}
        
        <p className="text-sm text-gray-500 mt-3">
          Please wait...
        </p>
      </div>
    </div>
  );
};

export default LoadingOverlay;