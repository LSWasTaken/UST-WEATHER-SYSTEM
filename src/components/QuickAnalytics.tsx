import React from 'react';
import Sparkline from './Sparkline';
import RingGauge from './RingGauge';
import { Thermometer, CloudRain, Droplets, ImageDown } from 'lucide-react';
import ExportButton from './ExportButton';

interface Props {
  temps: number[]; // up to 24
  precip: number[]; // up to 24
  prob: number[]; // up to 24
}

const QuickAnalytics: React.FC<Props> = ({ temps, precip, prob }) => {
  const STORAGE_KEY = 'qa-range-v1';
  const [range, setRange] = React.useState<number>(() => {
    const raw = Number(localStorage.getItem(STORAGE_KEY) || 12);
    return [6, 12, 24].includes(raw) ? raw : 12;
  });
  React.useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, String(range)); } catch {}
  }, [range]);

  const slice = (arr: number[]) => arr.slice(0, range);
  const tempsS = slice(temps);
  const precipS = slice(precip);
  const probS = slice(prob);
  const nextHourProb = Math.round(prob[0] ?? 0);
  const high = Math.max(...tempsS);
  const low = Math.min(...tempsS);

  const [areaMode, setAreaMode] = React.useState<boolean>(false);
  return (
    <section className="space-y-4">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span className="hidden sm:inline">Quick Analytics</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="bg-gray-800/60 border border-gray-700 rounded-lg p-0.5 text-xs">
            {[6,12,24].map(r => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`px-2 py-1 rounded ${range===r ? 'bg-yellow-500 text-gray-900' : 'text-gray-300 hover:bg-gray-700/60'}`}
              >{r}h</button>
            ))}
          </div>
          <button onClick={() => setAreaMode(v => !v)} className={`text-xs px-2 py-1 rounded border ${areaMode ? 'bg-yellow-500 text-gray-900 border-yellow-500' : 'border-gray-700 text-gray-300 hover:bg-gray-700/60'}`}>{areaMode ? 'Area' : 'Line'}</button>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {/* Temperature card */}
        <div id="qa-temp" className="weather-card p-4 bg-gradient-to-br from-gray-800/80 to-gray-900/60">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-yellow-500/20 flex items-center justify-center"><Thermometer className="w-3.5 h-3.5 text-yellow-400" /></div>
              <span className="text-sm font-medium text-gray-200">Temperature next {range}h</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">{low}° / {high}°</span>
              <ExportButton targetId="qa-temp" />
            </div>
          </div>
          <Sparkline values={tempsS} height={64} stroke="var(--chart-temp)" fill="var(--chart-temp)" area={areaMode} labels={tempsS.map((_,i)=>`${i}h`)} />
        </div>

        {/* Precipitation card */}
        <div id="qa-precip" className="weather-card p-4 bg-gradient-to-br from-gray-800/80 to-gray-900/60">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-blue-500/20 flex items-center justify-center"><CloudRain className="w-3.5 h-3.5 text-blue-400" /></div>
              <span className="text-sm font-medium text-gray-200">Precipitation next {range}h (mm)</span>
            </div>
            <ExportButton targetId="qa-precip" />
          </div>
          <Sparkline values={precipS} height={64} stroke="var(--chart-precip)" fill="var(--chart-precip)" area={areaMode} labels={precipS.map((_,i)=>`${i}h`)} />
        </div>

        {/* Probability gauge */}
        <div className="weather-card p-4 bg-gradient-to-br from-gray-800/80 to-gray-900/60 flex items-center justify-center">
          <div className="w-full">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-emerald-500/20 flex items-center justify-center"><Droplets className="w-3.5 h-3.5 text-emerald-400" /></div>
                <span className="text-sm font-medium text-gray-200">Next hour chance</span>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <RingGauge value={nextHourProb} color="#34d399" label="Next hour chance" />
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 text-[11px] text-gray-400">
        <div className="flex items-center gap-1"><span className="inline-block w-3 h-0.5 bg-[var(--chart-temp)] rounded" /> Temp</div>
        <div className="flex items-center gap-1"><span className="inline-block w-3 h-0.5 bg-[var(--chart-precip)] rounded" /> Precip</div>
        <div className="flex items-center gap-1"><span className="inline-block w-3 h-0.5 bg-[var(--chart-prob)] rounded" /> Probability</div>
      </div>
    </section>
  );
};

export default QuickAnalytics;


