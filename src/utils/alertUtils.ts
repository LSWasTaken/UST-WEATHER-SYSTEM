import { AlertLevel, HourlyForecast } from '../types/weather';

/**
 * Calculate alert level based on precipitation probability and amount
 */
export const calculateAlertLevel = (hourlyData: HourlyForecast[]): AlertLevel => {
  // Check next 3 hours for immediate alerts
  const next3Hours = hourlyData.slice(0, 3);
  
  // Check for heavy rain/flood risk
  const heavyRainHours = next3Hours.filter(hour => 
    hour.precipitation > 20 || hour.precipitationProbability > 80
  );
  
  if (heavyRainHours.length > 0) {
    return {
      level: 'danger',
      message: '⚠️ High flood risk! Heavy rain expected. Avoid low-lying areas near UST.',
      icon: '🚨'
    };
  }
  
  // Check for moderate rain
  const moderateRainHours = next3Hours.filter(hour => 
    hour.precipitation > 5 || hour.precipitationProbability > 50
  );
  
  if (moderateRainHours.length > 0) {
    return {
      level: 'warning',
      message: '🌧️ Rain expected within 3 hours. Consider bringing an umbrella.',
      icon: '⚠️'
    };
  }
  
  // Check for light rain
  const lightRainHours = next3Hours.filter(hour => 
    hour.precipitation > 0 || hour.precipitationProbability > 30
  );
  
  if (lightRainHours.length > 0) {
    return {
      level: 'warning',
      message: '🌦️ Light rain possible. Keep an eye on the weather.',
      icon: '☁️'
    };
  }
  
  // Safe conditions
  return {
    level: 'safe',
    message: '☀️ Clear conditions expected. Safe to be outdoors.',
    icon: '✅'
  };
};

/**
 * Get notification message for rain alerts
 */
export const getRainNotification = (hourlyData: HourlyForecast[]): string | null => {
  const nextHour = hourlyData[0];
  
  if (nextHour && nextHour.precipitationProbability > 50) {
    const precipitation = nextHour.precipitation;
    if (precipitation > 20) {
      return '🚨 Heavy rain expected in 1 hour! Possible flooding near UST.';
    } else if (precipitation > 5) {
      return '🌧️ Rain expected in 1 hour. Bring an umbrella!';
    } else {
      return '🌦️ Light rain expected in 1 hour.';
    }
  }
  
  return null;
};

/**
 * Check for flood warning based on rainfall amount
 */
export const checkFloodWarning = (hourlyData: HourlyForecast[]): boolean => {
  // Check next 6 hours for cumulative rainfall
  const next6Hours = hourlyData.slice(0, 6);
  const totalRainfall = next6Hours.reduce((sum, hour) => sum + hour.precipitation, 0);
  
  // If more than 20mm in 6 hours, show flood warning
  return totalRainfall > 20;
};
