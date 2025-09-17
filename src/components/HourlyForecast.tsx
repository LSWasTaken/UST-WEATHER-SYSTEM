import React from 'react';
import { HourlyForecast as HourlyForecastType, WEATHER_CODES } from '../types/weather';

interface HourlyForecastProps {
  hourly: HourlyForecastType[];
}

const HourlyForecast: React.FC<HourlyForecastProps> = ({ hourly }) => {
  const formatTime = (timeString: string) => {
    const date = new Date(timeString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString('en-PH', {
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Manila'
      });
    } else {
      return date.toLocaleDateString('en-PH', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZone: 'Asia/Manila'
      });
    }
  };

  const getPrecipitationColor = (precipitation: number, probability: number) => {
    if (precipitation > 20 || probability > 80) return 'text-red-600 bg-red-50';
    if (precipitation > 5 || probability > 50) return 'text-orange-600 bg-orange-50';
    if (precipitation > 0 || probability > 30) return 'text-yellow-600 bg-yellow-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="weather-card p-6 mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">24-Hour Forecast</h2>
      
      <div className="space-y-3">
        {hourly.map((hour, index) => {
          const weatherInfo = WEATHER_CODES[hour.weatherCode] || { description: 'Unknown', icon: '❓' };
          const precipitationColor = getPrecipitationColor(hour.precipitation, hour.precipitationProbability);
          
          return (
            <div 
              key={hour.time} 
              className="flex items-center justify-between p-3 bg-white/50 rounded-lg hover:bg-white/70 transition-colors"
            >
              {/* Time */}
              <div className="w-20 text-sm font-medium text-gray-700">
                {index === 0 ? 'Now' : formatTime(hour.time)}
              </div>

              {/* Weather Icon */}
              <div className="text-2xl w-12 text-center">
                {weatherInfo.icon}
              </div>

              {/* Temperature */}
              <div className="w-16 text-center">
                <div className="text-lg font-semibold text-gray-800">
                  {hour.temperature}°C
                </div>
              </div>

              {/* Precipitation */}
              <div className="flex-1 max-w-32">
                <div className={`text-xs px-2 py-1 rounded-full text-center ${precipitationColor}`}>
                  {hour.precipitation > 0 ? `${hour.precipitation.toFixed(1)}mm` : '0mm'}
                </div>
                <div className="text-xs text-gray-500 text-center mt-1">
                  {hour.precipitationProbability}% chance
                </div>
              </div>

              {/* Additional Info */}
              <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="mr-1">💧</span>
                  {hour.humidity}%
                </div>
                <div className="flex items-center">
                  <span className="mr-1">💨</span>
                  {hour.windSpeed} km/h
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap gap-4 text-xs text-gray-600">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-gray-50 rounded-full mr-2"></div>
            No rain
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-yellow-50 rounded-full mr-2"></div>
            Light rain
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-orange-50 rounded-full mr-2"></div>
            Moderate rain
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-red-50 rounded-full mr-2"></div>
            Heavy rain
          </div>
        </div>
      </div>
    </div>
  );
};

export default HourlyForecast;
