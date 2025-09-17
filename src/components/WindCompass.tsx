import React from 'react';

interface WindCompassProps {
  speed: number; // km/h
  direction: number; // degrees
}

const WindCompass: React.FC<WindCompassProps> = ({ speed, direction }) => {
  const size = 120;
  const arrowLen = 40;
  const angle = (direction - 90) * (Math.PI / 180);
  const cx = size / 2;
  const cy = size / 2;
  const x2 = cx + arrowLen * Math.cos(angle);
  const y2 = cy + arrowLen * Math.sin(angle);

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={cx} cy={cy} r={50} fill="#111827" stroke="#374151" />
        <text x={cx} y={18} textAnchor="middle" className="fill-gray-300 text-[10px]">N</text>
        <text x={cx} y={size-6} textAnchor="middle" className="fill-gray-300 text-[10px]">S</text>
        <text x={size-8} y={cy+3} textAnchor="end" className="fill-gray-300 text-[10px]">E</text>
        <text x={8} y={cy+3} textAnchor="start" className="fill-gray-300 text-[10px]">W</text>
        <line x1={cx} y1={cy} x2={x2} y2={y2} stroke="#60a5fa" strokeWidth={4} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={3} fill="#60a5fa" />
      </svg>
      <div className="mt-2 text-sm text-gray-300">{Math.round(speed)} km/h</div>
    </div>
  );
};

export default WindCompass;


