import React from 'react';

interface HumidityLadderProps {
  values: number[]; // 0-100
}

const HumidityLadder: React.FC<HumidityLadderProps> = ({ values }) => {
  const bars = values.slice(0, 5);
  return (
    <div className="space-y-2" role="img" aria-label="Humidity levels">
      {bars.map((v, idx) => (
        <div key={idx} className="h-3 bg-gray-700 rounded">
          <div className="h-3 bg-blue-500 rounded" style={{ width: `${Math.max(0, Math.min(100, v))}%` }} />
        </div>
      ))}
    </div>
  );
};

export default HumidityLadder;


