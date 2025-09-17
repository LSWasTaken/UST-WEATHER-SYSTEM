import React from 'react';

interface Props {
  values: number[]; // mm per hour up to 24
}

const CumulativePrecipArea: React.FC<Props> = ({ values }) => {
  const width = 400;
  const height = 120;
  const cum = values.reduce<number[]>((acc, v, i) => {
    acc[i] = (acc[i - 1] || 0) + (v || 0);
    return acc;
  }, []);
  const max = Math.max(1, Math.max(...cum));
  const stepX = width / Math.max(1, (cum.length - 1));
  const points = cum.map((v, i) => {
    const x = i * stepX;
    const y = height - (v / max) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div id="cum-precip" className="weather-card p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">24h cumulative precipitation</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">Total {cum[cum.length-1]?.toFixed(1)} mm</span>
      </div>
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label="cumulative precipitation">
        <polyline points={`0,${height} ${points} ${width},${height}`} fill="var(--chart-precip, #60a5fa22)" stroke="none" />
        <polyline points={points} fill="none" stroke="var(--chart-precip, #60a5fa)" strokeWidth={2} />
      </svg>
    </div>
  );
};

export default CumulativePrecipArea;


