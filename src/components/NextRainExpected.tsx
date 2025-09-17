import React from 'react';
import { HourlyForecast } from '../types/weather';
import { CloudRain, Umbrella } from 'lucide-react';

interface Props {
  hourly: HourlyForecast[];
}

function findNextRain(hourly: HourlyForecast[]): { index: number; hour: HourlyForecast } | null {
  for (let i = 0; i < Math.min(24, hourly.length); i++) {
    const h = hourly[i];
    if ((h.precipitationProbability ?? 0) >= 30 || (h.precipitation ?? 0) > 0) {
      return { index: i, hour: h };
    }
  }
  return null;
}

function formatLocal(time: string) {
  return new Date(time).toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Manila' });
}

const NextRainExpected: React.FC<Props> = ({ hourly }) => {
  const next = React.useMemo(() => findNextRain(hourly), [hourly]);
  if (!next) return null;

  const { hour, index } = next;
  const intensity = hour.precipitation > 5 ? 'Moderate' : hour.precipitation > 0.5 ? 'Light' : 'Slight';
  const tip = hour.precipitation > 5 ? 'Raincoat and umbrella recommended' : 'Light jacket or umbrella recommended';

  return (
    <div className="rounded-xl border border-blue-400/40 bg-blue-900/20 text-blue-100 p-4 shadow-inner transition-transform duration-300 will-change-transform" style={{ transform: `scale(${1 + Math.min(0.05, index > 0 ? 0.0 : 0.05)})` }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CloudRain className="w-6 h-6 text-blue-300" />
          <div>
            <div className="text-sm uppercase tracking-wide opacity-80">Next Rain Expected</div>
            <div className="text-lg font-semibold">{intensity} rain at {formatLocal(hour.time)} (in ~{index}h)</div>
            <div className="text-xs opacity-80 mt-1">Chance {Math.round(hour.precipitationProbability)}% · {hour.precipitation.toFixed(1)} mm</div>
          </div>
        </div>
        <div className="hidden md:flex items-center gap-2 text-sm bg-blue-800/40 px-3 py-2 rounded-lg">
          <Umbrella className="w-4 h-4" />
          <span>{tip}</span>
        </div>
      </div>
    </div>
  );
};

export default NextRainExpected;



