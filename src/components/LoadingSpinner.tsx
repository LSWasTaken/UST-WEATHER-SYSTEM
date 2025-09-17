import React from 'react';
import { CloudRain } from 'lucide-react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-96 space-y-4">
      <div className="relative">
        <CloudRain className="w-16 h-16 text-blue-500 animate-pulse-slow" />
        <div className="absolute inset-0 w-16 h-16 border-4 border-blue-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-700 mb-2">Loading Weather Data</h3>
        <p className="text-sm text-gray-500">Fetching latest forecast for UST Manila...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
