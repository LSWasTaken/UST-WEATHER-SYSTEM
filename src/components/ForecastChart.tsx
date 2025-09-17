import React from 'react';
import { HourlyForecast as HourlyForecastType } from '../types/weather';

interface ForecastChartProps {
  hourly: HourlyForecastType[];
  activeTab: string;
}

const ForecastChart: React.FC<ForecastChartProps> = ({ hourly, activeTab }) => {
  // Sample data for the chart - in a real app, this would be processed from the hourly data
  const chartData = [
    { time: '11 AM', temp: 28, precip: 27, icon: '☀️' },
    { time: 'Now', temp: 30, precip: 34, icon: '⛅' },
    { time: '3 PM', temp: 32, precip: 63, icon: '🌧️' },
    { time: '5 PM', temp: 30, precip: 48, icon: '⛅' },
    { time: '7 PM', temp: 28, precip: 45, icon: '🌧️' },
    { time: '9 PM', temp: 26, precip: 21, icon: '☁️' },
    { time: '11 PM', temp: 25, precip: 18, icon: '☁️' },
    { time: 'Thu 18 1 AM', temp: 24, precip: 16, icon: '☁️' },
    { time: '3 AM', temp: 23, precip: 0, icon: '☁️' },
    { time: '5 AM', temp: 22, precip: 0, icon: '☁️' },
    { time: '7 AM', temp: 24, precip: 0, icon: '☀️' },
    { time: '9 AM', temp: 26, precip: 0, icon: '☀️' },
  ];

  const maxTemp = Math.max(...chartData.map(d => d.temp));
  const minTemp = Math.min(...chartData.map(d => d.temp));
  const tempRange = maxTemp - minTemp;

  const getYPosition = (temp: number) => {
    return ((maxTemp - temp) / tempRange) * 200 + 20; // 200px height, 20px padding
  };

  const getCurrentTimeIndex = () => {
    const now = new Date();
    const currentHour = now.getHours();
    return Math.max(0, Math.min(chartData.length - 1, Math.floor(currentHour / 2)));
  };

  return (
    <div className="bg-gray-800/50 rounded-lg p-6">
      <div className="relative">
        {/* Chart Container */}
        <div className="relative h-64">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-gray-400">
            <span>45°</span>
            <span>35°</span>
            <span>25°</span>
            <span>15°</span>
          </div>

          {/* Chart Area */}
          <div className="ml-8 mr-4 h-full relative">
            {/* Temperature Line */}
            <svg className="absolute inset-0 w-full h-full">
              <polyline
                fill="none"
                stroke="#f59e0b"
                strokeWidth="3"
                points={chartData.map((d, i) => 
                  `${(i / (chartData.length - 1)) * 100}%,${getYPosition(d.temp)}`
                ).join(' ')}
              />
              
              {/* Current time marker */}
              <line
                x1={`${(getCurrentTimeIndex() / (chartData.length - 1)) * 100}%`}
                y1="0"
                x2={`${(getCurrentTimeIndex() / (chartData.length - 1)) * 100}%`}
                y2="100%"
                stroke="#f59e0b"
                strokeWidth="2"
                strokeDasharray="4,4"
              />
            </svg>

            {/* Precipitation bars */}
            {chartData.map((d, i) => (
              <div
                key={i}
                className="absolute bottom-0 bg-blue-500/30 rounded-t"
                style={{
                  left: `${(i / (chartData.length - 1)) * 100}%`,
                  width: `${100 / chartData.length}%`,
                  height: `${(d.precip / 100) * 40}px`,
                }}
              />
            ))}

            {/* Hour labels and weather icons */}
            <div className="absolute -top-8 left-0 right-0 flex justify-between">
              {chartData.map((d, i) => (
                <div key={i} className="flex flex-col items-center">
                  <div className="text-lg mb-1">{d.icon}</div>
                  <div className="text-xs text-white font-medium">{d.temp}°</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* X-axis labels */}
        <div className="mt-4 ml-8 mr-4 flex justify-between text-xs text-gray-400">
          {chartData.map((d, i) => (
            <span key={i} className="text-center">
              {d.time}
            </span>
          ))}
        </div>

        {/* Precipitation percentages */}
        <div className="mt-2 ml-8 mr-4 flex justify-between">
          {chartData.map((d, i) => (
            <div key={i} className="text-center">
              {d.precip > 0 && (
                <div className="flex items-center justify-center">
                  <span className="text-xs text-blue-400">💧</span>
                  <span className="text-xs text-blue-400 ml-1">{d.precip}%</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Current time indicator */}
        <div className="absolute top-0 right-4 flex items-center space-x-2">
          <div className="text-xs text-orange-400">☀️</div>
          <div className="text-xs text-orange-400">5:56 PM</div>
        </div>

        {/* Sunrise indicator */}
        <div className="absolute top-0 right-20 flex items-center space-x-2">
          <div className="text-xs text-orange-400">☀️</div>
          <div className="text-xs text-orange-400">5:44 AM</div>
        </div>

        {/* Moon phase */}
        <div className="absolute bottom-0 right-4 flex items-center space-x-2">
          <div className="text-xs text-gray-400">🌙</div>
          <div className="text-xs text-gray-400">Moon phase: Waning Crescent</div>
        </div>
      </div>
    </div>
  );
};

export default ForecastChart;
