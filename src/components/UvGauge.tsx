import React from 'react';

interface UvGaugeProps {
  value: number; // 0-11
}

const segments = [
  { until: 2, color: '#22c55e' }, // low
  { until: 5, color: '#facc15' }, // moderate
  { until: 7, color: '#fb923c' }, // high
  { until: 10, color: '#ef4444' }, // very high
  { until: 11, color: '#a855f7' }, // extreme
];

const UvGauge: React.FC<UvGaugeProps> = ({ value }) => {
  const size = 120;
  const thickness = 12;
  const radius = (size - thickness) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const max = 11;
  const clamped = Math.max(0, Math.min(max, Math.round(value)));
  const circumference = 2 * Math.PI * radius;
  const progress = (clamped / max) * circumference;

  return (
    <div className="flex flex-col items-center justify-center" role="img" aria-label={`UV Index ${clamped}`}>
      <svg width={size} height={size}>
        <circle cx={cx} cy={cy} r={radius} stroke="#1f2937" strokeWidth={thickness} fill="none" />
        {segments.reduce((acc, seg, idx) => {
          const start = idx === 0 ? 0 : (segments[idx - 1].until / max) * circumference;
          const end = (seg.until / max) * circumference;
          const len = Math.max(0, end - start - 2); // gap
          const dashArray = `${len} ${circumference}`;
          const dashOffset = circumference - start;
          acc.push(
            <circle key={idx} cx={cx} cy={cy} r={radius} stroke={seg.color} strokeWidth={thickness}
              fill="none" strokeDasharray={dashArray} strokeDashoffset={dashOffset}
              transform={`rotate(-90 ${cx} ${cy})`} />
          );
          return acc;
        }, [] as React.ReactNode[])}
        <circle cx={cx} cy={cy} r={radius} stroke="#ffffff" strokeOpacity={0.9} strokeWidth={thickness}
          fill="none" strokeDasharray={`${progress} ${circumference}`} strokeDashoffset={circumference}
          transform={`rotate(-90 ${cx} ${cy})`} />
        <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" className="fill-white text-base">{clamped}</text>
        <text x={cx} y={cy + 18} textAnchor="middle" className="fill-gray-300 text-[10px]">UV Index</text>
      </svg>
    </div>
  );
};

export default UvGauge;


