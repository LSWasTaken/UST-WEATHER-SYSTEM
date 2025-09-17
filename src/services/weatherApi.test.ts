import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { getCachedWeatherData } from './weatherApi';

const mockResponse = {
  current: {
    temperature_2m: 30,
    relative_humidity_2m: 60,
    weather_code: 1,
    wind_speed_10m: 5,
    wind_direction_10m: 180,
    surface_pressure: 1007,
    visibility: 10000,
    uv_index: 5,
    time: '2024-01-01T00:00:00Z'
  },
  hourly: {
    time: Array.from({ length: 24 }, (_, i) => `2024-01-01T${String(i).padStart(2, '0')}:00:00Z`),
    temperature_2m: Array(24).fill(30),
    weather_code: Array(24).fill(1),
    precipitation: Array(24).fill(0),
    precipitation_probability: Array(24).fill(10),
    relative_humidity_2m: Array(24).fill(60),
    wind_speed_10m: Array(24).fill(5)
  }
};

describe('weatherApi', () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));
    // @ts-expect-error - mock fetch
    global.fetch = vi.fn(() => Promise.resolve({ ok: true, json: () => Promise.resolve(mockResponse) }));
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    global.fetch = originalFetch;
    localStorage.clear();
  });

  it('fetches and transforms data, then caches it', async () => {
    const data = await getCachedWeatherData();
    expect(data.current.temperature).toBe(30);
    expect(data.hourly).toHaveLength(24);
    // Should hit cache on next call (no additional fetch)
    const fetchCalls = (global.fetch as unknown as ReturnType<typeof vi.fn>).mock.calls.length;
    await getCachedWeatherData();
    const fetchCallsAfter = (global.fetch as unknown as ReturnType<typeof vi.fn>).mock.calls.length;
    expect(fetchCallsAfter).toBe(fetchCalls); // no new fetch
  });

  it('falls back to localStorage if network fails', async () => {
    await getCachedWeatherData(); // warm cache
    // Fail network
    // @ts-expect-error - mock fetch
    global.fetch = vi.fn(() => Promise.reject(new Error('Network error')));
    const data = await getCachedWeatherData();
    expect(data.current.temperature).toBe(30);
  });
});


