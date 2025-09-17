import React from 'react';
import { CurrentWeather as CurrentWeatherType, WEATHER_CODES } from '../types/weather';
import { Thermometer, Droplets, Wind, Eye, Gauge } from 'lucide-react';

interface CurrentWeatherProps {
  current: CurrentWeatherType;
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ current }) => {
  const weatherInfo = WEATHER_CODES[current.weatherCode] || { description: 'Unknown', icon: '❓' };
  
  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-PH', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Manila'
    });
  };

  return (
    <div className="weather-card p-6 mb-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Current Weather</h2>
          <p className="text-sm text-gray-600 dark:text-gray-300">University of Santo Tomas, Manila</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">Updated: {formatTime(current.time)}</p>
        </div>
        <div className="text-6xl">{weatherInfo.icon}</div>
      </div>

      {/* Main Temperature */}
      <div className="text-center mb-6">
        <div className="text-6xl font-bold text-gray-800 dark:text-gray-100 mb-2">
          {current.temperature}°C
        </div>
        <div className="text-xl text-gray-600 dark:text-gray-300">{weatherInfo.description}</div>
      </div>

      {/* Weather Details Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white/50 dark:bg-gray-700/50 rounded-lg p-3 text-center transition-colors duration-300">
          <Droplets className="w-6 h-6 text-blue-500 mx-auto mb-1" />
          <div className="text-sm text-gray-600 dark:text-gray-300">Humidity</div>
          <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">{current.humidity}%</div>
        </div>

        <div className="bg-white/50 dark:bg-gray-700/50 rounded-lg p-3 text-center transition-colors duration-300">
          <Wind className="w-6 h-6 text-green-500 mx-auto mb-1" />
          <div className="text-sm text-gray-600 dark:text-gray-300">Wind</div>
          <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">{current.windSpeed} km/h</div>
        </div>

        <div className="bg-white/50 dark:bg-gray-700/50 rounded-lg p-3 text-center transition-colors duration-300">
          <Eye className="w-6 h-6 text-purple-500 mx-auto mb-1" />
          <div className="text-sm text-gray-600 dark:text-gray-300">Visibility</div>
          <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">{current.visibility} km</div>
        </div>

        <div className="bg-white/50 dark:bg-gray-700/50 rounded-lg p-3 text-center transition-colors duration-300">
          <Gauge className="w-6 h-6 text-orange-500 mx-auto mb-1" />
          <div className="text-sm text-gray-600 dark:text-gray-300">Pressure</div>
          <div className="text-lg font-semibold text-gray-800 dark:text-gray-100">{current.pressure} hPa</div>
        </div>
      </div>

      {/* UV Index */}
      <div className="mt-4 bg-white/50 dark:bg-gray-700/50 rounded-lg p-3 transition-colors duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Thermometer className="w-5 h-5 text-yellow-500 mr-2" />
            <span className="text-sm text-gray-600 dark:text-gray-300">UV Index</span>
          </div>
          <div className="flex items-center">
            <span className="text-lg font-semibold text-gray-800 dark:text-gray-100 mr-2">{current.uvIndex}</span>
            <span className={`text-xs px-2 py-1 rounded-full ${
              current.uvIndex <= 2 ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200' :
              current.uvIndex <= 5 ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200' :
              current.uvIndex <= 7 ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-200' :
              current.uvIndex <= 10 ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200' :
              'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-200'
            }`}>
              {current.uvIndex <= 2 ? 'Low' :
               current.uvIndex <= 5 ? 'Moderate' :
               current.uvIndex <= 7 ? 'High' :
               current.uvIndex <= 10 ? 'Very High' : 'Extreme'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather;
