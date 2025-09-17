// Weather data types for Open-Meteo API
export interface CurrentWeather {
  temperature: number;
  humidity: number;
  weatherCode: number;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  visibility: number;
  uvIndex: number;
  time: string;
}

export interface HourlyForecast {
  time: string;
  temperature: number;
  weatherCode: number;
  precipitation: number;
  precipitationProbability: number;
  humidity: number;
  windSpeed: number;
}

export interface WeatherData {
  current: CurrentWeather;
  hourly: HourlyForecast[];
  location: {
    name: string;
    latitude: number;
    longitude: number;
  };
}

export interface AlertLevel {
  level: 'safe' | 'warning' | 'danger';
  message: string;
  icon: string;
}

// Weather code mappings for Open-Meteo
export const WEATHER_CODES: Record<number, { description: string; icon: string }> = {
  0: { description: 'Clear sky', icon: '☀️' },
  1: { description: 'Mainly clear', icon: '🌤️' },
  2: { description: 'Partly cloudy', icon: '⛅' },
  3: { description: 'Overcast', icon: '☁️' },
  45: { description: 'Fog', icon: '🌫️' },
  48: { description: 'Depositing rime fog', icon: '🌫️' },
  51: { description: 'Light drizzle', icon: '🌦️' },
  53: { description: 'Moderate drizzle', icon: '🌦️' },
  55: { description: 'Dense drizzle', icon: '🌦️' },
  61: { description: 'Slight rain', icon: '🌧️' },
  63: { description: 'Moderate rain', icon: '🌧️' },
  65: { description: 'Heavy rain', icon: '🌧️' },
  71: { description: 'Slight snow', icon: '❄️' },
  73: { description: 'Moderate snow', icon: '❄️' },
  75: { description: 'Heavy snow', icon: '❄️' },
  77: { description: 'Snow grains', icon: '❄️' },
  80: { description: 'Slight rain showers', icon: '🌦️' },
  81: { description: 'Moderate rain showers', icon: '🌦️' },
  82: { description: 'Violent rain showers', icon: '🌦️' },
  85: { description: 'Slight snow showers', icon: '🌨️' },
  86: { description: 'Heavy snow showers', icon: '🌨️' },
  95: { description: 'Thunderstorm', icon: '⛈️' },
  96: { description: 'Thunderstorm with slight hail', icon: '⛈️' },
  99: { description: 'Thunderstorm with heavy hail', icon: '⛈️' },
};
