import { describe, expect, it } from 'vitest';
import { calculateAlertLevel, getRainNotification, checkFloodWarning } from './alertUtils';

const makeHour = (overrides: Partial<{ precipitation: number; precipitationProbability: number }>) => ({
  time: '2024-01-01T00:00:00Z',
  temperature: 30,
  weatherCode: 1,
  precipitation: 0,
  precipitationProbability: 0,
  humidity: 60,
  windSpeed: 5,
  ...overrides,
});

describe('alertUtils', () => {
  it('calculates danger level for heavy rain', () => {
    const res = calculateAlertLevel([makeHour({ precipitation: 25, precipitationProbability: 90 }), makeHour({}), makeHour({})]);
    expect(res.level).toBe('danger');
  });

  it('calculates warning level for moderate rain', () => {
    const res = calculateAlertLevel([makeHour({ precipitation: 6, precipitationProbability: 60 }), makeHour({}), makeHour({})]);
    expect(res.level).toBe('warning');
  });

  it('returns safe when no rain expected', () => {
    const res = calculateAlertLevel([makeHour({}), makeHour({}), makeHour({})]);
    expect(res.level).toBe('safe');
  });

  it('returns rain notification when probability > 50', () => {
    const msg = getRainNotification([makeHour({ precipitation: 1, precipitationProbability: 60 })]);
    expect(msg).toBeTruthy();
  });

  it('detects flood warning when cumulative > 20', () => {
    const hours = Array.from({ length: 6 }, () => makeHour({ precipitation: 4 }));
    const warn = checkFloodWarning(hours);
    expect(warn).toBe(true);
  });
});


