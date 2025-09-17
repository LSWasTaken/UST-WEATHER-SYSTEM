import React from 'react';
import { HourlyForecast } from '../types/weather';
import { Clock, Thermometer, Droplets, Wind, Cloud } from 'lucide-react';

interface HourlyDetailsProps {
  hourly: HourlyForecast[];
}

const HourlyDetails: React.FC<HourlyDetailsProps> = ({ hourly }) => {
  const now = new Date();
  
  // Get next 24 hours of data (future only)
  const futureHours = hourly.filter(hour => new Date(hour.time) > now).slice(0, 24);

  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-PH', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Manila'
    });
  };

  const formatDate = (timeString: string) => {
    return new Date(timeString).toLocaleDateString('en-PH', {
      month: 'short',
      day: 'numeric',
      timeZone: 'Asia/Manila'
    });
  };

  const getWeatherIcon = (weatherCode: number) => {
    // Simple weather icon mapping based on weather codes
    if (weatherCode >= 0 && weatherCode <= 3) return '☀️';
    if (weatherCode >= 45 && weatherCode <= 48) return '🌫️';
    if (weatherCode >= 51 && weatherCode <= 67) return '🌧️';
    if (weatherCode >= 71 && weatherCode <= 77) return '❄️';
    if (weatherCode >= 80 && weatherCode <= 86) return '⛈️';
    if (weatherCode >= 95 && weatherCode <= 99) return '⛈️';
    return '☁️';
  };

  const getWeatherDescription = (weatherCode: number) => {
    const descriptions: { [key: number]: string } = {
      0: 'Clear sky',
      1: 'Mainly clear',
      2: 'Partly cloudy',
      3: 'Overcast',
      45: 'Fog',
      48: 'Depositing rime fog',
      51: 'Light drizzle',
      53: 'Moderate drizzle',
      55: 'Dense drizzle',
      61: 'Slight rain',
      63: 'Moderate rain',
      65: 'Heavy rain',
      71: 'Slight snow',
      73: 'Moderate snow',
      75: 'Heavy snow',
      80: 'Slight rain showers',
      81: 'Moderate rain showers',
      82: 'Violent rain showers',
      95: 'Thunderstorm',
      96: 'Thunderstorm with slight hail',
      99: 'Thunderstorm with heavy hail'
    };
    return descriptions[weatherCode] || 'Unknown';
  };

  return (
    <div className="space-y-6">
      <div className="bg-gray-800/50 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <Clock className="w-5 h-5" />
          <span>24-Hour Detailed Forecast</span>
        </h3>

        <div className="space-y-3">
          {futureHours.map((hour, index) => (
            <div
              key={index}
              className="bg-gray-700/50 rounded-lg p-4 hover:bg-gray-700/70 transition-colors"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className="text-2xl">{getWeatherIcon(hour.weatherCode)}</div>
                  <div>
                    <div className="text-lg font-semibold text-white">
                      {formatTime(hour.time)}
                    </div>
                    <div className="text-sm text-gray-400">
                      {formatDate(hour.time)}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white">
                    {Math.round(hour.temperature)}°C
                  </div>
                  <div className="text-sm text-gray-400">
                    Feels like {Math.round(hour.temperature + 2)}°C
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-300 mb-3">
                {getWeatherDescription(hour.weatherCode)}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center space-x-2">
                  <Droplets className="w-4 h-4 text-blue-400" />
                  <div>
                    <div className="text-xs text-gray-400">Humidity</div>
                    <div className="text-sm font-medium text-white">{hour.humidity}%</div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <Wind className="w-4 h-4 text-green-400" />
                  <div>
                    <div className="text-xs text-gray-400">Wind</div>
                    <div className="text-sm font-medium text-white">{hour.windSpeed} km/h</div>
                  </div>
                </div>

                {/* Removed unsupported visibility/pressure fields from HourlyForecast */}
              </div>

              {(hour.precipitation || hour.precipitationProbability) && (
                <div className="mt-3 pt-3 border-t border-gray-600">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Cloud className="w-4 h-4 text-blue-400" />
                      <div>
                        <div className="text-xs text-gray-400">Rainfall</div>
                        <div className="text-sm font-medium text-white">
                          {hour.precipitation || 0} mm
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Droplets className="w-4 h-4 text-blue-400" />
                      <div>
                        <div className="text-xs text-gray-400">Rain Chance</div>
                        <div className="text-sm font-medium text-white">
                          {hour.precipitationProbability || 0}%
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {futureHours.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            <Clock className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <p>No future hourly data available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HourlyDetails;
