import React from 'react';
import { MapPin, ExternalLink } from 'lucide-react';

interface MapLocation {
  name: string;
  temperature: number;
  position: { x: number; y: number };
}

const MapSection: React.FC = () => {
  const locations: MapLocation[] = [
    { name: 'Navotas', temperature: 30, position: { x: 20, y: 30 } },
    { name: 'Manila', temperature: 30, position: { x: 25, y: 35 } },
    { name: 'Cavite', temperature: 31, position: { x: 15, y: 50 } },
    { name: 'Calamba', temperature: 29, position: { x: 30, y: 60 } },
    { name: 'Polillo', temperature: 30, position: { x: 60, y: 25 } },
    { name: 'San Miguel', temperature: 29, position: { x: 40, y: 45 } },
    { name: 'Fernando', temperature: 30, position: { x: 35, y: 40 } },
  ];

  return (
    <div className="bg-gray-800/50 rounded-lg p-6">
      <div className="relative">
        {/* Map Container */}
        <div className="relative w-full h-64 bg-gradient-to-br from-blue-900/30 to-green-900/30 rounded-lg overflow-hidden">
          {/* Simple map representation */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-green-600/20 to-yellow-600/20"></div>
          
          {/* Map locations */}
          {locations.map((location, index) => (
            <div
              key={index}
              className="absolute transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${location.position.x}%`,
                top: `${location.position.y}%`,
              }}
            >
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mb-1"></div>
                <div className="text-xs text-white font-medium bg-black/50 px-1 py-0.5 rounded">
                  {location.name} {location.temperature}°
                </div>
              </div>
            </div>
          ))}
          
          {/* Map overlay text */}
          <div className="absolute bottom-4 left-4 text-white">
            <div className="text-sm font-medium">Philippines</div>
            <div className="text-xs text-gray-300">Manila Region</div>
          </div>
        </div>

        {/* Map Info */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-gray-300">
            No precipitation for at least 2 hours.
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-yellow-500 text-gray-900 rounded-lg hover:bg-yellow-400 transition-colors">
            <ExternalLink className="w-4 h-4" />
            <span className="text-sm font-medium">Open Map</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MapSection;
