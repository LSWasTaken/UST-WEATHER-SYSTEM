import React, { useState } from 'react';
import { BarChart3, List } from 'lucide-react';

interface ForecastTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  viewMode: 'chart' | 'list';
  onViewModeChange: (mode: 'chart' | 'list') => void;
}

const ForecastTabs: React.FC<ForecastTabsProps> = ({ 
  activeTab, 
  onTabChange, 
  viewMode, 
  onViewModeChange 
}) => {
  const tabs = [
    'Hourly',
    'Overview',
    'Precipitation',
    'Wind',
    'Air Quality',
    'Humidity',
    'Cloud cover',
    'Pressure',
    'UV',
    'Visibility',
    'Feels like'
  ];

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex space-x-1 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors duration-200 ${
                activeTab === tab
                  ? 'bg-yellow-500 text-gray-900'
                  : 'text-gray-400 hover:text-white hover:bg-gray-700 dark:hover:bg-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onViewModeChange('chart')}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              viewMode === 'chart'
                ? 'bg-yellow-500 text-gray-900'
                : 'text-gray-400 hover:text-white hover:bg-gray-700 dark:hover:bg-gray-600'
            }`}
            aria-label="Chart view"
          >
            <BarChart3 className="w-4 h-4" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              viewMode === 'list'
                ? 'bg-yellow-500 text-gray-900'
                : 'text-gray-400 hover:text-white hover:bg-gray-700 dark:hover:bg-gray-600'
            }`}
            aria-label="List view"
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForecastTabs;
