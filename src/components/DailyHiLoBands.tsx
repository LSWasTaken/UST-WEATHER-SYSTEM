import React from 'react';

interface Props {
  times: string[]; // ISO times
  temps: number[]; // same length
}

type DayBand = { day: string; min: number; max: number; avg: number };

function groupDailyBands(times: string[], temps: number[]): DayBand[] {
  const map: Record<string, number[]> = {};
  for (let i = 0; i < Math.min(times.length, temps.length); i++) {
    const d = new Date(times[i]).toLocaleDateString('en-PH', { timeZone: 'Asia/Manila' });
    (map[d] ||= []).push(temps[i]);
  }
  return Object.entries(map)
    .slice(0, 3)
    .map(([day, vals]) => {
      const min = Math.min(...vals);
      const max = Math.max(...vals);
      const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
      return { day, min, max, avg };
    });
}

const DailyHiLoBands: React.FC<Props> = ({ times, temps }) => {
  const bands = React.useMemo(() => groupDailyBands(times, temps), [times, temps]);
  if (bands.length === 0) return null;

  const width = 420;
  const height = 140;
  const padding = 30;
  const innerW = width - padding * 2;
  const innerH = height - padding * 2;
  const minT = Math.min(...bands.map(b => b.min));
  const maxT = Math.max(...bands.map(b => b.max));
  const range = Math.max(1, maxT - minT);
  const xStep = innerW / bands.length;

  const yFor = (t: number) => padding + (innerH - ((t - minT) / range) * innerH);

  return (
    <div className="weather-card p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">Daily hi/lo next 3 days</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">Range {Math.round(minT)}°–{Math.round(maxT)}°</span>
      </div>
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="daily high low">
        {/* axes */}
        <line x1={padding} y1={padding} x2={padding} y2={height - padding} stroke="var(--chart-grid)" />
        <line x1={padding} y1={height - padding} x2={width - padding} y2={height - padding} stroke="var(--chart-grid)" />
        {bands.map((b, i) => {
          const cx = padding + xStep * (i + 0.5);
          const yMin = yFor(b.min);
          const yMax = yFor(b.max);
          const yAvg = yFor(b.avg);
          return (
            <g key={b.day}>
              {/* band */}
              <rect x={cx - 20} y={yMax} width={40} height={Math.max(2, yMin - yMax)} fill="var(--chart-temp, #fbbf2433)" stroke="var(--chart-accent, #f59e0b)" />
              {/* avg */}
              <line x1={cx - 18} x2={cx + 18} y1={yAvg} y2={yAvg} stroke="#ef4444" />
              {/* labels */}
              <text x={cx} y={height - padding + 14} textAnchor="middle" className="fill-gray-300 text-[10px]">{b.day}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default DailyHiLoBands;


