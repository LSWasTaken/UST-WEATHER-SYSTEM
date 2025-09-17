import React from 'react';
import { Cloud, CloudRain, Sun, CloudSun } from 'lucide-react';

interface DailyForecastData {
  date: string;
  day: string;
  icon: 'cloud-rain' | 'cloud-sun' | 'cloud' | 'sun';
  high: number;
  low: number;
}

const DailyForecast: React.FC = () => {
  const dailyData: DailyForecastData[] = [
    { date: '16', day: 'Yesterday', icon: 'cloud-rain', high: 27, low: 26 },
    { date: '17', day: 'Today', icon: 'cloud-sun', high: 30, low: 26 },
    { date: '18', day: 'Thu', icon: 'cloud-sun', high: 30, low: 26 },
    { date: '19', day: 'Fri', icon: 'cloud-sun', high: 30, low: 26 },
    { date: '20', day: 'Sat', icon: 'cloud-rain', high: 30, low: 26 },
    { date: '21', day: 'Sun', icon: 'cloud-sun', high: 30, low: 26 },
    { date: '22', day: 'Mon', icon: 'cloud-sun', high: 29, low: 25 },
  ];

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'cloud-rain':
        return <CloudRain className="w-6 h-6 text-blue-400" />;
      case 'cloud-sun':
        return <CloudSun className="w-6 h-6 text-yellow-400" />;
      case 'cloud':
        return <Cloud className="w-6 h-6 text-gray-400" />;
      case 'sun':
        return <Sun className="w-6 h-6 text-yellow-400" />;
      default:
        return <Cloud className="w-6 h-6 text-gray-400" />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Toggle Switch */}
      <div className="flex items-center justify-end">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-400">Feels like</span>
          <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 focus:ring-offset-gray-800">
            <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" />
          </button>
        </div>
      </div>

      {/* Daily Forecast Cards */}
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {dailyData.map((day, index) => (
          <div
            key={index}
            className="flex-shrink-0 bg-gray-800/50 rounded-lg p-4 min-w-[120px] text-center"
          >
            <div className="text-sm text-gray-400 mb-1">{day.date}</div>
            <div className="text-sm font-medium text-white mb-2">{day.day}</div>
            <div className="flex justify-center mb-3">
              {getIcon(day.icon)}
            </div>
            <div className="text-lg font-semibold text-white">
              {day.high}°/{day.low}°
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DailyForecast;
