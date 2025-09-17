import React from 'react';
import { AlertTriangle, Clock, Droplets, TrendingUp, MapPin } from 'lucide-react';
import { HourlyForecast } from '../types/weather';

interface FloodPredictionProps {
  hourly: HourlyForecast[];
}

interface FloodRisk {
  time: string;
  riskLevel: 'low' | 'moderate' | 'high' | 'severe';
  probability: number;
  expectedRainfall: number;
  floodDepth: number;
  affectedAreas: string[];
  timestamp: Date;
}

const FloodPrediction: React.FC<FloodPredictionProps> = ({ hourly }) => {
  // Calculate flood risk based on rainfall data
  const calculateFloodRisk = (): FloodRisk[] => {
    const now = new Date();
    const predictions: FloodRisk[] = [];

    // Get next 24 hours of data
    const next24Hours = hourly.slice(0, 24);

    next24Hours.forEach((hour, index) => {
      const hourTime = new Date(hour.time);
      const rainfall = hour.precipitation || 0;
      const probability = hour.precipitationProbability || 0;

      let riskLevel: 'low' | 'moderate' | 'high' | 'severe' = 'low';
      let floodDepth = 0;
      let affectedAreas: string[] = [];

      // Risk calculation based on rainfall intensity and probability
      if (rainfall > 20 || probability > 80) {
        riskLevel = 'severe';
        floodDepth = Math.min(rainfall * 0.5, 50); // Max 50cm
        affectedAreas = ['UST Main Building', 'Quadricentennial Pavilion', 'UST Hospital', 'España Boulevard'];
      } else if (rainfall > 15 || probability > 60) {
        riskLevel = 'high';
        floodDepth = Math.min(rainfall * 0.3, 30);
        affectedAreas = ['UST Main Building', 'Quadricentennial Pavilion'];
      } else if (rainfall > 10 || probability > 40) {
        riskLevel = 'moderate';
        floodDepth = Math.min(rainfall * 0.2, 15);
        affectedAreas = ['UST Main Building'];
      }

      // Only show future predictions
      if (hourTime > now) {
        predictions.push({
          time: hourTime.toLocaleTimeString('en-PH', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Asia/Manila'
          }),
          riskLevel,
          probability: Math.round(probability),
          expectedRainfall: Math.round(rainfall),
          floodDepth: Math.round(floodDepth),
          affectedAreas,
          timestamp: hourTime
        });
      }
    });

    return predictions;
  };

  const floodPredictions = calculateFloodRisk();
  const currentRisk = floodPredictions[0]?.riskLevel || 'low';

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'severe': return 'text-red-400 bg-red-900/30 border-red-500';
      case 'high': return 'text-orange-400 bg-orange-900/30 border-orange-500';
      case 'moderate': return 'text-yellow-400 bg-yellow-900/30 border-yellow-500';
      default: return 'text-green-400 bg-green-900/30 border-green-500';
    }
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case 'severe': return '🔴';
      case 'high': return '🟠';
      case 'moderate': return '🟡';
      default: return '🟢';
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Risk Alert */}
      <div className={`rounded-lg p-4 border-2 ${getRiskColor(currentRisk)}`}>
        <div className="flex items-center space-x-3">
          <AlertTriangle className="w-6 h-6" />
          <div>
            <h3 className="text-lg font-semibold">Current Flood Risk</h3>
            <p className="text-sm">
              {currentRisk === 'severe' && 'SEVERE RISK - Avoid low-lying areas immediately'}
              {currentRisk === 'high' && 'HIGH RISK - Exercise caution in campus areas'}
              {currentRisk === 'moderate' && 'MODERATE RISK - Monitor conditions closely'}
              {currentRisk === 'low' && 'LOW RISK - Normal conditions expected'}
            </p>
          </div>
          <div className="text-2xl">{getRiskIcon(currentRisk)}</div>
        </div>
      </div>

      {/* Flood Predictions Timeline */}
      <div className="bg-gray-800/50 rounded-lg p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center space-x-2">
          <Clock className="w-5 h-5" />
          <span>24-Hour Flood Predictions</span>
        </h3>

        <div className="space-y-4">
          {floodPredictions.slice(0, 12).map((prediction, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border-l-4 ${getRiskColor(prediction.riskLevel)}`}
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
                    {prediction.riskLevel.toUpperCase()} RISK
                  </span>
                  <span className="text-lg">{getRiskIcon(prediction.riskLevel)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div className="flex items-center space-x-2">
                  <Droplets className="w-4 h-4 text-blue-400" />
                  <span>Rain: {prediction.expectedRainfall}mm</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-green-400" />
                  <span>Probability: {prediction.probability}%</span>
                </div>
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 text-orange-400" />
                  <span>Depth: {prediction.floodDepth}cm</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-red-400" />
                  <span>Areas: {prediction.affectedAreas.length}</span>
                </div>
              </div>

              {prediction.affectedAreas.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-gray-400 mb-1">Potentially affected areas:</p>
                  <div className="flex flex-wrap gap-1">
                    {prediction.affectedAreas.map((area, areaIndex) => (
                      <span
                        key={areaIndex}
                        className="px-2 py-1 bg-gray-700 text-gray-300 rounded text-xs"
                      >
                        {area}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {floodPredictions.length === 0 && (
          <div className="text-center text-gray-400 py-8">
            <p>No significant flood risk predicted in the next 24 hours</p>
          </div>
        )}
      </div>

      {/* Safety Tips */}
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-blue-300 mb-2">Safety Tips</h4>
        <ul className="text-sm text-blue-200 space-y-1">
          <li>• Avoid walking through flooded areas</li>
          <li>• Stay updated with official UST announcements</li>
          <li>• Keep emergency contacts handy</li>
          <li>• Move to higher ground if flooding occurs</li>
        </ul>
      </div>
    </div>
  );
};

export default FloodPrediction;
