import { WeatherData, HourlyForecast } from '../types/weather';

export interface NextHourChance {
  value: number;
  label: string;
}

export function getNextHourChance(hourly: HourlyForecast[]): NextHourChance {
  const nowTs = Date.now();
  
  // Find the next full forecast hour (not rolling 60 minutes)
  const nextHour = hourly.find(h => {
    const hourTs = new Date(h.time).getTime();
    return hourTs > nowTs;
  });
  
  const targetHour = nextHour || hourly[0];
  const hourLabel = new Date(targetHour.time).toLocaleTimeString('en-PH', { 
    hour: '2-digit', 
    minute: '2-digit', 
    timeZone: 'Asia/Manila' 
  });
  const value = Math.round(targetHour?.precipitationProbability ?? 0);
  
  return {
    value,
    label: `Next hour: ${hourLabel}`
  };
}

export function getRainTotal24h(hourly: HourlyForecast[]): number {
  return hourly.slice(0, 24).reduce((sum, h) => sum + (h.precipitation || 0), 0);
}

export function getMaxRainProbability24h(hourly: HourlyForecast[]): number {
  return Math.max(...hourly.slice(0, 24).map(h => h.precipitationProbability || 0));
}

export function formatLastUpdated(date: Date): string {
  return new Intl.DateTimeFormat('en-PH', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Manila'
  }).format(date);
}
