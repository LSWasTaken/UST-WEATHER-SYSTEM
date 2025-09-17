import React from 'react';
import { Search, MoreVertical, Home, Cloud } from 'lucide-react';
import DarkModeToggle from './DarkModeToggle';

interface LocationTab {
  id: string;
  name: string;
  temperature: number;
  icon: 'home' | 'cloud';
  hasAlert?: boolean;
}

interface HeaderProps {
  locations: LocationTab[];
  activeLocation: string;
  onLocationChange: (locationId: string) => void;
}

const Header: React.FC<HeaderProps> = ({ locations, activeLocation, onLocationChange }) => {
  const getIcon = (icon: 'home' | 'cloud') => {
    switch (icon) {
      case 'home':
        return <Home className="w-4 h-4" />;
      case 'cloud':
        return <Cloud className="w-4 h-4" />;
      default:
        return <Cloud className="w-4 h-4" />;
    }
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-600 sticky top-0 z-40 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 px-4 py-4 md:ml-64">
        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search for location"
              className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-500 rounded-lg text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              aria-label="Search for location"
            />
          </div>
        </div>

        {/* Location Tabs */}
        <div className="flex items-center space-x-2 md:ml-6">
          {locations.map((location) => (
            <button
              key={location.id}
              onClick={() => onLocationChange(location.id)}
              className={`flex items-center px-4 py-2 rounded-lg transition-colors duration-200 ${
                activeLocation === location.id
                  ? 'bg-yellow-500 text-gray-900'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                {getIcon(location.icon)}
                <span className="text-sm font-medium">
                  {location.name.length > 8 ? `${location.name.substring(0, 8)}...` : location.name}
                </span>
                <span className="text-sm font-semibold">{location.temperature}°</span>
                {location.hasAlert && (
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                )}
              </div>
            </button>
          ))}
          
          {/* More Options */}
            <button className="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200" aria-label="More options">
            <MoreVertical className="w-4 h-4" />
          </button>
          
          {/* Instagram Link */}
          <a
            href="https://www.instagram.com/lsf4k.cs"
            target="_blank"
            rel="noopener noreferrer"
            className="ml-2 px-3 py-2 rounded-lg text-pink-600 dark:text-pink-400 hover:text-pink-800 dark:hover:text-pink-300 transition-colors"
            aria-label="Follow @lsf4k.cs on Instagram"
            title="@lsf4k.cs"
          >
            @lsf4k.cs
          </a>
          
          {/* Theme Toggle */}
          <div className="ml-2">
            <DarkModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
