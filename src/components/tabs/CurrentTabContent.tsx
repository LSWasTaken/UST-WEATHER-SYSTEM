import React, { Suspense, useMemo } from 'react';
import { WeatherData } from '../../types/weather';
import { getNextHourChance, getRainTotal24h, getMaxRainProbability24h } from '../../utils/weatherHelpers';
import TabSection from '../TabSection';
import SkeletonLoader from '../SkeletonLoader';
import LoadingSpinner from '../LoadingSpinner';

// Lazy imports
const CurrentWeatherDetailed = React.lazy(() => import('../CurrentWeatherDetailed'));
const QuickAnalytics = React.lazy(() => import('../QuickAnalytics'));
const NextRainExpected = React.lazy(() => import('../NextRainExpected'));
const CumulativePrecipArea = React.lazy(() => import('../CumulativePrecipArea'));
const DailyHiLoBands = React.lazy(() => import('../DailyHiLoBands'));

interface CurrentTabContentProps {
  weatherData: WeatherData;
}

const CurrentTabContent: React.FC<CurrentTabContentProps> = ({ weatherData }) => {
  // Memoize derived data
  const hourly24 = useMemo(() => weatherData.hourly.slice(0, 24), [weatherData.hourly]);
  const temps = useMemo(() => hourly24.map(h => h.temperature), [hourly24]);
  const precip = useMemo(() => hourly24.map(h => h.precipitation), [hourly24]);
  const prob = useMemo(() => hourly24.map(h => h.precipitationProbability), [hourly24]);
  const hourlyTimes = useMemo(() => hourly24.map(h => h.time), [hourly24]);
  
  const nextHourChance = useMemo(() => getNextHourChance(weatherData.hourly), [weatherData.hourly]);
  const rainTotal24h = useMemo(() => getRainTotal24h(weatherData.hourly), [weatherData.hourly]);
  const maxRainProb24h = useMemo(() => getMaxRainProbability24h(weatherData.hourly), [weatherData.hourly]);

  return (
    <TabSection>
      {/* Main weather display */}
      <Suspense fallback={<LoadingSpinner />}>
        <CurrentWeatherDetailed current={weatherData.current} />
      </Suspense>
      
      {/* Analytics and charts */}
      <Suspense fallback={<SkeletonLoader height="h-28" />}>
        <QuickAnalytics 
          temps={temps}
          precip={precip}
          prob={prob}
          hourlyTimes={hourlyTimes}
        />
      </Suspense>

      {/* Compact rain metrics */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="weather-card p-4">
          <div className="text-sm text-gray-300">Next hour chance</div>
          <div className="mt-1 text-3xl md:text-3xl font-bold text-white">{nextHourChance.value}%</div>
          <div className="text-xs text-gray-400 mt-1">{nextHourChance.label}</div>
        </div>
        <div className="weather-card p-4">
          <div className="text-sm text-gray-300">Rain total next 24h</div>
          <div className="mt-1 text-3xl font-bold text-white">{rainTotal24h.toFixed(1)} mm</div>
        </div>
        <div className="weather-card p-4">
          <div className="text-sm text-gray-300">Max rain probability 24h</div>
          <div className="mt-1 text-3xl font-bold text-white">{Math.round(maxRainProb24h)}%</div>
        </div>
      </div>

      {/* Next rain expected */}
      <Suspense fallback={<SkeletonLoader height="h-20" />}>
        <NextRainExpected hourly={weatherData.hourly} />
      </Suspense>

      {/* Cumulative precipitation */}
      <Suspense fallback={<SkeletonLoader height="h-36" />}>
        <CumulativePrecipArea values={precip} />
      </Suspense>

      {/* Daily hi/lo bands */}
      <Suspense fallback={<SkeletonLoader height="h-40" />}>
        <DailyHiLoBands 
          times={weatherData.hourly.slice(0, 72).map(h => h.time)} 
          temps={weatherData.hourly.slice(0, 72).map(h => h.temperature)} 
        />
      </Suspense>
    </TabSection>
  );
};

export default CurrentTabContent;
