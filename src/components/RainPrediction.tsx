import React from 'react';
import { CloudRain, Clock, Droplets, AlertCircle, Calendar } from 'lucide-react';
import { HourlyForecast } from '../types/weather';

interface RainPredictionProps {
  hourly: HourlyForecast[];
}

interface RainEvent {
  time: string;
  intensity: 'light' | 'moderate' | 'heavy' | 'extreme';
  probability: number;
  duration: number; // in minutes
  expectedRainfall: number; // in mm
  timestamp: Date;
  description: string;
}

const RainPrediction: React.FC<RainPredictionProps> = ({ hourly }) => {
  // Calculate rain predictions for the next 24 hours
  const calculateRainPredictions = (): RainEvent[] => {
    const now = new Date();
    const predictions: RainEvent[] = [];

    // Get next 24 hours of data
    const next24Hours = hourly.slice(0, 24);

    next24Hours.forEach((hour, index) => {
      const hourTime = new Date(hour.time);
      const rainfall = hour.precipitation || 0;
      const probability = hour.precipitationProbability || 0;

      // Only show future predictions
      if (hourTime > now && probability > 20) {
        let intensity: 'light' | 'moderate' | 'heavy' | 'extreme' = 'light';
        let duration = 60; // Default 1 hour
        let description = '';

        if (rainfall > 30) {
          intensity = 'extreme';
          duration = 120;
          description = 'Torrential downpour expected - avoid outdoor activities';
        } else if (rainfall > 20) {
          intensity = 'heavy';
          duration = 90;
          description = 'Heavy rainfall - use umbrella and avoid flooded areas';
        } else if (rainfall > 10) {
          intensity = 'moderate';
          duration = 75;
          description = 'Moderate rain - carry umbrella and waterproof gear';
        } else {
          intensity = 'light';
          duration = 60;
          description = 'Light rain - light jacket or umbrella recommended';
        }

        predictions.push({
          time: hourTime.toLocaleTimeString('en-PH', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Manila'
          }),
          intensity,
          probability: Math.round(probability),
          duration,
          expectedRainfall: Math.round(rainfall),
          timestamp: hourTime,
          description
        });
      }
    });

    return predictions;
  };

  const rainPredictions = calculateRainPredictions();
  const nextRain = rainPredictions[0];

  const getIntensityColor = (intensity: string) => {
    switch (intensity) {
      case 'extreme': return 'text-red-400 bg-red-900/30 border-red-500';
      case 'heavy': return 'text-orange-400 bg-orange-900/30 border-orange-500';
      case 'moderate': return 'text-yellow-400 bg-yellow-900/30 border-yellow-500';
      default: return 'text-blue-400 bg-blue-900/30 border-blue-500';
    }
  };

  const getIntensityIcon = (intensity: string) => {
    switch (intensity) {
      case 'extreme': return '🌧️💥';
      case 'heavy': return '🌧️';
      case 'moderate': return '🌦️';
      default: return '🌧️';
    }
  };

  const getIntensityLabel = (intensity: string) => {
    switch (intensity) {
      case 'extreme': return 'EXTREME RAIN';
      case 'heavy': return 'HEAVY RAIN';
      case 'moderate': return 'MODERATE RAIN';
      default: return 'LIGHT RAIN';
    }
  };

  return (
    <div className="space-y-6">
      {/* Next Rain Alert */}
      {nextRain && (
        <div className={`rounded-lg p-4 border-2 ${getIntensityColor(nextRain.intensity)}`}>
          <div className="flex items-center space-x-3">
            <CloudRain className="w-6 h-6" />
            <div>
              <h3 className="text-lg font-semibold">Next Rain Expected</h3>
              <p className="text-sm font-medium">
                {getIntensityLabel(nextRain.intensity)} at {nextRain.time} ({nextRain.timestamp.toLocaleDateString('en-PH', {
                  month: 'short',
                  day: 'numeric',
                  timeZone: 'Asia/Manila'
                })})
              </p>
              <p className="text-xs mt-1">{nextRain.description}</p>
            </div>
            <div className="text-2xl">{getIntensityIcon(nextRain.intensity)}</div>
          </div>
        </div>
      )}

      {/* Rain Predictions Timeline */}
      <div className="bg-gray-800/50 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <Calendar className="w-5 h-5" />
          <span>24-Hour Rain Forecast</span>
        </h3>

        <div className="space-y-4">
          {rainPredictions.slice(0, 8).map((prediction, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-l-4 ${getIntensityColor(prediction.intensity)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <span className="text-lg font-semibold">{prediction.time}</span>
                  <span className="text-sm text-gray-400">
                    {prediction.timestamp.toLocaleDateString('en-PH', {
                      month: 'short',
                      day: 'numeric',
                      timeZone: 'Asia/Manila'
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">
                    {getIntensityLabel(prediction.intensity)}
                  </span>
                  <span className="text-lg">{getIntensityIcon(prediction.intensity)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-2">
                <div className="flex items-center space-x-2">
                  <Droplets className="w-4 h-4 text-blue-400" />
                  <span>Rainfall: {prediction.expectedRainfall}mm</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-green-400" />
                  <span>Duration: {prediction.duration}min</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-yellow-400" />
                  <span>Probability: {prediction.probability}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CloudRain className="w-4 h-4 text-purple-400" />
                  <span>Intensity: {prediction.intensity}</span>
                </div>
              </div>

              <p className="text-xs text-gray-300 mt-2">{prediction.description}</p>
            </div>
          ))}
        </div>

        {rainPredictions.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            <CloudRain className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <p>No significant rain expected in the next 24 hours</p>
            <p className="text-sm mt-2">Enjoy the clear weather! ☀️</p>
          </div>
        )}
      </div>

      {/* Rain Safety Tips */}
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-blue-300 mb-2">Rain Safety Tips</h4>
        <ul className="text-sm text-blue-200 space-y-1">
          <li>• Always carry an umbrella or raincoat</li>
          <li>• Wear waterproof shoes to avoid slipping</li>
          <li>• Avoid walking under trees during heavy rain</li>
          <li>• Stay indoors during extreme weather conditions</li>
          <li>• Check weather updates before leaving home</li>
        </ul>
      </div>

      {/* Rain Intensity Legend */}
      <div className="bg-gray-800/30 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-white mb-3">Rain Intensity Guide</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-blue-400">🌧️</span>
            <span className="text-gray-300">Light: 0-10mm/h</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-yellow-400">🌦️</span>
            <span className="text-gray-300">Moderate: 10-20mm/h</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-orange-400">🌧️</span>
            <span className="text-gray-300">Heavy: 20-30mm/h</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-red-400">🌧️💥</span>
            <span className="text-gray-300">Extreme: 30mm+/h</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RainPrediction;
