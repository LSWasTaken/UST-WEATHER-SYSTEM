import React from 'react';

interface RingGaugeProps {
  value: number; // 0-100
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
}

const RingGauge: React.FC<RingGaugeProps> = ({ value, size = 96, strokeWidth = 10, color = '#22c55e', label }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center" role="img" aria-label={label ? `${label}: ${clamped}%` : `${clamped}%`}>
      <svg width={size} height={size}>
        <circle cx={size/2} cy={size/2} r={radius} stroke="#374151" strokeWidth={strokeWidth} fill="none" />
        <circle
          cx={size/2}
          cy={size/2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size/2} ${size/2})`}
        />
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" className="fill-white text-sm">
          {Math.round(clamped)}%
        </text>
      </svg>
      {label && <div className="mt-2 text-xs text-gray-300">{label}</div>}
    </div>
  );
};

export default RingGauge;


