import React, { useState, useEffect, Suspense } from 'react';
import { WeatherData, WEATHER_CODES } from './types/weather';
import { getCachedWeatherData } from './services/weatherApi';
import { calculateAlertLevel, getRainNotification, checkFloodWarning } from './utils/alertUtils';

// Components
import Sidebar from './components/Sidebar';
import Header from './components/Header';
const CurrentWeatherDetailed = React.lazy(() => import('./components/CurrentWeatherDetailed'));
const FreeMapSection = React.lazy(() => import('./components/FreeMapSection'));
const ForecastTabs = React.lazy(() => import('./components/ForecastTabs'));
const ForecastChart = React.lazy(() => import('./components/ForecastChart'));
const DailyForecast = React.lazy(() => import('./components/DailyForecast'));
const NewsSection = React.lazy(() => import('./components/NewsSection'));
const FloodPrediction = React.lazy(() => import('./components/FloodPrediction'));
const RainPrediction = React.lazy(() => import('./components/RainPrediction'));
const HourlyDetails = React.lazy(() => import('./components/HourlyDetails'));
const RealTimeUpdates = React.lazy(() => import('./components/RealTimeUpdates'));
const WeatherDetailsGrid = React.lazy(() => import('./components/WeatherDetailsGrid'));
const QuickAnalytics = React.lazy(() => import('./components/QuickAnalytics'));
const NextRainExpected = React.lazy(() => import('./components/NextRainExpected'));
const CumulativePrecipArea = React.lazy(() => import('./components/CumulativePrecipArea'));
const DailyHiLoBands = React.lazy(() => import('./components/DailyHiLoBands'));
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { DarkModeProvider } from './contexts/DarkModeContext';
import NotificationBanner from './components/NotificationBanner';

const App: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [activeTab, setActiveTab] = useState('current');
  const [forecastTab, setForecastTab] = useState('Overview');
  const [viewMode, setViewMode] = useState<'chart' | 'list'>('chart');
  const [activeLocation, setActiveLocation] = useState('santo-tomas');
  const [bannerMessage, setBannerMessage] = useState<string | null>(null);
  const [bannerType, setBannerType] = useState<'info' | 'warning' | 'danger'>('info');
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth < 768);

  const locations = [
    { id: 'santo-tomas', name: 'Santo Tomas', temperature: 30, icon: 'cloud' as const, hasAlert: false },
  ];

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCachedWeatherData();
      setWeatherData(data);
      setLastUpdated(new Date());

      // Rain alert banner
      const rainMsg = getRainNotification(data.hourly);
      if (rainMsg) {
        setBannerMessage(rainMsg);
        setBannerType(rainMsg.includes('Heavy') ? 'danger' : 'warning');
      } else {
        setBannerMessage(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather();
    
    // Auto-refresh every 10 minutes
    const interval = setInterval(fetchWeather, 10 * 60 * 1000);
    
    // Online/offline listeners
    const handleOnline = () => {
      setIsOnline(true);
      setBannerMessage('Back online. Syncing latest weather…');
      setBannerType('info');
      fetchWeather();
    };
    const handleOffline = () => {
      setIsOnline(false);
      setBannerMessage('You are offline. Showing last cached data.');
      setBannerType('warning');
    };
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('resize', handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Update document title with current conditions
  useEffect(() => {
    if (weatherData) {
      const temp = weatherData.current.temperature;
      const code = WEATHER_CODES[weatherData.current.weatherCode];
      const desc = code ? code.description : 'Weather';
      document.title = `${temp}° • ${desc} • UST Weather`;
    } else {
      document.title = 'UST Weather';
    }
  }, [weatherData]);

  if (loading && !weatherData) {
    return (
      <div className="min-h-screen">
        <div className="flex items-center justify-center h-screen">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error && !weatherData) {
    return (
      <div className="min-h-screen">
        <div className="flex items-center justify-center h-screen">
          <ErrorMessage message={error} onRetry={fetchWeather} />
        </div>
      </div>
    );
  }

  if (!weatherData) {
    return null;
  }

  const bannerLeftOffset = isMobile ? 16 : (sidebarCollapsed ? 24 : 272);

  return (
    <div className="min-h-screen">
      <NotificationBanner message={bannerMessage} type={bannerType} leftOffsetPx={bannerLeftOffset} topOffsetPx={20} />
      {/* Sidebar */}
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} collapsed={sidebarCollapsed} onToggleCollapse={() => setSidebarCollapsed(v => !v)} />

      {/* Header */}
      <Header 
        locations={locations}
        activeLocation={activeLocation}
        onLocationChange={setActiveLocation}
      />

      {/* Main Content */}
      <main className={`${sidebarCollapsed ? 'md:ml-16' : 'md:ml-64'} ml-0 pt-16 transition-all duration-200`}>
        <div className="p-6 space-y-6">
          {/* Real-time Updates Bar */}
          <Suspense fallback={<div className="h-10" />}> 
            <RealTimeUpdates 
              onRefresh={fetchWeather}
              lastUpdated={lastUpdated}
              loading={loading}
            />
          </Suspense>
          {/* Current Weather Section */}
          {activeTab === 'current' && (
            <div className="space-y-6">
              {/* Main weather display */}
              <Suspense fallback={<LoadingSpinner />}>
                <CurrentWeatherDetailed current={weatherData.current} />
              </Suspense>
              
              {/* Analytics and charts */}
              <Suspense fallback={<div className="h-28 bg-gray-800/30 rounded-lg" />}> 
                <QuickAnalytics 
                  temps={weatherData.hourly.slice(0,24).map(h => h.temperature)}
                  precip={weatherData.hourly.slice(0,24).map(h => h.precipitation)}
                  prob={weatherData.hourly.slice(0,24).map(h => h.precipitationProbability)}
                  hourlyTimes={weatherData.hourly.slice(0,24).map(h => h.time)}
                />
              </Suspense>

              {/* Compact rain metrics */}
              <div className="grid md:grid-cols-3 gap-4">
                <div className="weather-card p-4">
                  <div className="text-sm text-gray-300">Rain chance next hour</div>
                  <div className="mt-1 text-3xl font-bold text-white">{Math.round(weatherData.hourly[0]?.precipitationProbability ?? 0)}%</div>
                </div>
                <div className="weather-card p-4">
                  <div className="text-sm text-gray-300">Rain total next 24h</div>
                  <div className="mt-1 text-3xl font-bold text-white">{weatherData.hourly.slice(0,24).reduce((s,h)=>s+(h.precipitation||0),0).toFixed(1)} mm</div>
                </div>
                <div className="weather-card p-4">
                  <div className="text-sm text-gray-300">Max rain probability 24h</div>
                  <div className="mt-1 text-3xl font-bold text-white">{Math.max(...weatherData.hourly.slice(0,24).map(h=>h.precipitationProbability||0))}%</div>
                </div>
              </div>

              {/* Next rain expected */}
              <Suspense fallback={<div className="h-20 bg-gray-800/30 rounded-lg" />}> 
                <NextRainExpected hourly={weatherData.hourly} />
              </Suspense>

              {/* Cumulative precipitation */}
              <Suspense fallback={<div className="h-36 bg-gray-800/30 rounded-lg" />}> 
                <CumulativePrecipArea values={weatherData.hourly.slice(0,24).map(h => h.precipitation)} />
              </Suspense>

              {/* Daily hi/lo bands */}
              <Suspense fallback={<div className="h-40 bg-gray-800/30 rounded-lg" />}> 
                <DailyHiLoBands times={weatherData.hourly.slice(0,72).map(h => h.time)} temps={weatherData.hourly.slice(0,72).map(h => h.temperature)} />
              </Suspense>
            </div>
          )}

          {/* Hourly Forecast Section */}
          {activeTab === 'hourly' && (
            <div className="space-y-6">
              <Suspense fallback={<LoadingSpinner />}>
                <HourlyDetails hourly={weatherData.hourly} />
              </Suspense>
            </div>
          )}

          {/* Details Section */}
          {activeTab === 'details' && (
            <div className="space-y-6">
              <Suspense fallback={<LoadingSpinner />}>
                <WeatherDetailsGrid data={weatherData} />
              </Suspense>
              <Suspense fallback={<LoadingSpinner />}>
                <HourlyDetails hourly={weatherData.hourly} />
              </Suspense>
            </div>
          )}

          {/* Maps Section */}
          {activeTab === 'maps' && (
            <div className="space-y-6">
              <Suspense fallback={<div className="h-64 bg-gray-800/30 rounded-lg" />}> 
                <FreeMapSection />
              </Suspense>
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">Weather Map Layers</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-white mb-2">Temperature Map</h4>
                    <p className="text-gray-400 text-sm">Real-time temperature visualization across the UST area</p>
                  </div>
                  <div className="bg-gray-700/50 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-white mb-2">Precipitation Map</h4>
                    <p className="text-gray-400 text-sm">Rainfall intensity and probability mapping</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Monthly Section */}
          {activeTab === 'monthly' && (
            <div className="space-y-6">
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">Monthly Weather Overview</h3>
                <p className="text-gray-400">Monthly weather statistics and trends for UST area</p>
                <div className="mt-4 text-center text-gray-500">
                  <p>Monthly data visualization coming soon...</p>
                </div>
              </div>
            </div>
          )}

          {/* Trends Section */}
          {activeTab === 'trends' && (
            <div className="space-y-6">
              <div className="bg-gray-800/50 rounded-lg p-6">
                <h3 className="text-xl font-bold text-white mb-4">Weather Trends</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Temperature Trends</h4>
                    <p className="text-gray-400 text-sm">Historical temperature patterns and predictions</p>
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-white mb-2">Precipitation Trends</h4>
                    <p className="text-gray-400 text-sm">Rainfall patterns and seasonal analysis</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* News Section */}
          {activeTab === 'news' && (
            <div className="space-y-6">
              <Suspense fallback={<div className="h-64 bg-gray-800/30 rounded-lg" />}> 
                <NewsSection />
              </Suspense>
            </div>
          )}

          {/* Flood Prediction Section */}
          {forecastTab === 'Precipitation' && activeTab === 'current' && (
            <div className="space-y-6">
              <Suspense fallback={<LoadingSpinner />}>
                <FloodPrediction hourly={weatherData.hourly} />
              </Suspense>
            </div>
          )}

          {/* Rain Prediction Section */}
          {forecastTab === 'Overview' && activeTab === 'current' && (
            <div className="space-y-6">
              <Suspense fallback={<LoadingSpinner />}>
                <RainPrediction hourly={weatherData.hourly} />
              </Suspense>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const AppWithDarkMode: React.FC = () => {
  return (
    <DarkModeProvider>
      <App />
    </DarkModeProvider>
  );
};

export default AppWithDarkMode;
