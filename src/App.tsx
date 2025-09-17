import React, { useState, useEffect, Suspense } from 'react';
import { WeatherData, WEATHER_CODES } from './types/weather';
import { TabId, Banner, LocationTab, APP_NAME } from './types/app';
import { getCachedWeatherData } from './services/weatherApi';
import { getRainNotification } from './utils/alertUtils';
import { formatLastUpdated } from './utils/weatherHelpers';
import { useMediaQuery } from './hooks/useMediaQuery';

// Components
import {
  Sidebar,
  Header,
  LoadingSpinner,
  ErrorMessage,
  NotificationBanner,
  RealTimeUpdates,
  RainPrediction,
  FloodPrediction,
  CurrentTabContent,
  HourlyTabContent,
  DetailsTabContent,
  MapsTabContent,
  MonthlyTabContent,
  TrendsTabContent,
  NewsTabContent,
  TabSection
} from './components';
import { DarkModeProvider } from './contexts/DarkModeContext';

const App: React.FC = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabId>('current');
  const [forecastTab, setForecastTab] = useState('Overview');
  const [activeLocation, setActiveLocation] = useState('santo-tomas');
  const [banner, setBanner] = useState<Banner | null>(null);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  
  // Use media query hook for mobile detection
  const isMobile = useMediaQuery('(max-width: 768px)');

  const locations: LocationTab[] = [
    { id: 'santo-tomas', name: 'Santo Tomas', temperature: 30, icon: 'cloud', hasAlert: false },
  ];

  const fetchWeather = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getCachedWeatherData();
      setWeatherData(data);
      setLastUpdated(formatLastUpdated(new Date()));

      // Rain alert banner
      const rainMsg = getRainNotification(data.hourly);
      if (rainMsg) {
        setBanner({
          message: rainMsg,
          type: rainMsg.includes('Heavy') ? 'danger' : 'warning'
        });
      } else {
        setBanner(null);
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
      setBanner({
        message: 'Back online. Syncing latest weather…',
        type: 'info'
      });
      fetchWeather();
    };
    const handleOffline = () => {
      setIsOnline(false);
      setBanner({
        message: 'You are offline. Showing last cached data.',
        type: 'warning'
      });
    };
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      clearInterval(interval);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Update document title with current conditions
  useEffect(() => {
    if (weatherData) {
      const temp = weatherData.current.temperature;
      const code = WEATHER_CODES[weatherData.current.weatherCode];
      const desc = code ? code.description : 'Weather';
      document.title = `${temp}° • ${desc} • ${APP_NAME}`;
    } else {
      document.title = APP_NAME;
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

  const renderTabContent = () => {
    if (!weatherData) return null;

    switch (activeTab) {
      case 'current':
        return <CurrentTabContent weatherData={weatherData} />;
      case 'hourly':
        return <HourlyTabContent weatherData={weatherData} />;
      case 'details':
        return <DetailsTabContent weatherData={weatherData} />;
      case 'maps':
        return <MapsTabContent />;
      case 'monthly':
        return <MonthlyTabContent />;
      case 'trends':
        return <TrendsTabContent />;
      case 'news':
        return <NewsTabContent />;
      default:
        return <CurrentTabContent weatherData={weatherData} />;
    }
  };

  return (
    <div className="min-h-screen">
      <NotificationBanner 
        message={banner?.message || null} 
        type={banner?.type || 'info'} 
        leftOffsetPx={bannerLeftOffset} 
        topOffsetPx={20} 
      />
      
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={(tab: string) => setActiveTab(tab as TabId)} 
        collapsed={sidebarCollapsed} 
        onToggleCollapse={() => setSidebarCollapsed(v => !v)} 
      />

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
              lastUpdated={lastUpdated ? new Date(lastUpdated) : null}
              loading={loading}
            />
          </Suspense>

          {/* Tab Content */}
          {renderTabContent()}

          {/* Additional Forecast Sections */}
          {forecastTab === 'Precipitation' && activeTab === 'current' && (
            <TabSection>
              <Suspense fallback={<LoadingSpinner />}>
                <FloodPrediction hourly={weatherData.hourly} />
              </Suspense>
            </TabSection>
          )}

          {forecastTab === 'Overview' && activeTab === 'current' && (
            <TabSection>
              <Suspense fallback={<LoadingSpinner />}>
                <RainPrediction hourly={weatherData.hourly} />
              </Suspense>
            </TabSection>
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
