import { WeatherData, CurrentWeather, HourlyForecast } from '../types/weather';

// UST Manila coordinates
const UST_COORDINATES = {
  latitude: 14.6091,
  longitude: 120.9899,
};

// Open-Meteo API base URL (free, no API key required)
const API_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

const LOCAL_STORAGE_KEY = 'weather_cache_v1';
const LOCAL_STORAGE_TIMESTAMP_KEY = 'weather_cache_ts_v1';
const REQUEST_TIMEOUT_MS = 10000; // 10s
const MAX_RETRIES = 2;

function withTimeout(fetchPromise: Promise<Response>, timeoutMs: number): Promise<Response> {
  const timeout = new Promise<never>((_, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id);
      reject(new Error('Request timed out'));
    }, timeoutMs);
  });
  return Promise.race([fetchPromise, timeout]);
}

async function fetchWithRetry(url: string, retries: number): Promise<Response> {
  let lastError: unknown = null;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await withTimeout(fetch(url), REQUEST_TIMEOUT_MS);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      return res;
    } catch (err) {
      lastError = err;
      if (attempt < retries) {
        const backoff = 300 * Math.pow(2, attempt);
        await new Promise(resolve => setTimeout(resolve, backoff));
        continue;
      }
    }
  }
  throw lastError instanceof Error ? lastError : new Error('Network error');
}

/**
 * Fetch current weather and hourly forecast from Open-Meteo API
 */
export const fetchWeatherData = async (): Promise<WeatherData> => {
  try {
    const params = new URLSearchParams({
      latitude: UST_COORDINATES.latitude.toString(),
      longitude: UST_COORDINATES.longitude.toString(),
      current: [
        'temperature_2m',
        'relative_humidity_2m',
        'weather_code',
        'wind_speed_10m',
        'wind_direction_10m',
        'surface_pressure',
        'visibility',
        'uv_index'
      ].join(','),
      hourly: [
        'temperature_2m',
        'weather_code',
        'precipitation',
        'precipitation_probability',
        'relative_humidity_2m',
        'wind_speed_10m'
      ].join(','),
      timezone: 'Asia/Manila',
      forecast_days: '2', // Get 2 days of hourly data
    });

    const response = await fetchWithRetry(`${API_BASE_URL}?${params}`, MAX_RETRIES);
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();

    // Transform API response to our data structure
    const current: CurrentWeather = {
      temperature: Math.round(data.current.temperature_2m),
      humidity: data.current.relative_humidity_2m,
      weatherCode: data.current.weather_code,
      windSpeed: Math.round(data.current.wind_speed_10m),
      windDirection: data.current.wind_direction_10m,
      pressure: Math.round(data.current.surface_pressure),
      visibility: Math.round(data.current.visibility / 1000), // Convert to km
      uvIndex: data.current.uv_index,
      time: data.current.time,
    };

    // Transform hourly data (next 24 hours)
    const hourly: HourlyForecast[] = data.hourly.time
      .slice(0, 24) // Get next 24 hours
      .map((time: string, index: number) => ({
        time,
        temperature: Math.round(data.hourly.temperature_2m[index]),
        weatherCode: data.hourly.weather_code[index],
        precipitation: data.hourly.precipitation[index],
        precipitationProbability: data.hourly.precipitation_probability[index],
        humidity: data.hourly.relative_humidity_2m[index],
        windSpeed: Math.round(data.hourly.wind_speed_10m[index]),
      }));

    const transformed: WeatherData = {
      current,
      hourly,
      location: {
        name: 'University of Santo Tomas, Manila',
        latitude: UST_COORDINATES.latitude,
        longitude: UST_COORDINATES.longitude,
      },
    };

    // persist to localStorage best-effort
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(transformed));
      localStorage.setItem(LOCAL_STORAGE_TIMESTAMP_KEY, String(Date.now()));
    } catch {}

    return transformed;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    // fallback to local cache if available
    try {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as WeatherData;
        return parsed;
      }
    } catch {}
    throw new Error('Failed to fetch weather data. Please try again later.');
  }
};

/**
 * Get weather data with caching (5 minutes)
 */
let cachedData: WeatherData | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export const getCachedWeatherData = async (): Promise<WeatherData> => {
  const now = Date.now();
  
  if (cachedData && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedData;
  }

  // try load from localStorage if within duration
  try {
    const ts = parseInt(localStorage.getItem(LOCAL_STORAGE_TIMESTAMP_KEY) || '0', 10);
    if (!Number.isNaN(ts) && (now - ts) < CACHE_DURATION) {
      const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as WeatherData;
        cachedData = parsed;
        cacheTimestamp = ts;
        return parsed;
      }
    }
  } catch {}

  const data = await fetchWeatherData();
  cachedData = data;
  cacheTimestamp = now;
  
  return data;
};
