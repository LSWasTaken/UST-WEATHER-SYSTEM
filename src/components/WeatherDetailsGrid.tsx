import React from 'react';
import { WeatherData, HourlyForecast } from '../types/weather';
import { Sun, Thermometer, CloudRain } from 'lucide-react';
import Sparkline from './Sparkline';
import AlertBox from './AlertBox';
import { calculateAlertLevel, getRainNotification } from '../utils/alertUtils';
import RingGauge from './RingGauge';
import WindCompass from './WindCompass';
import UvGauge from './UvGauge';
import HumidityLadder from './HumidityLadder';
import ExportButton from './ExportButton';

type Props = { data: WeatherData };

function getNextHours<T>(arr: T[], n: number): T[] {
  return arr.slice(0, n);
}

function formatTimePH(date: Date) {
  return date.toLocaleTimeString('en-PH', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Manila' });
}

export const WeatherDetailsGrid: React.FC<Props> = ({ data }) => {
  const nowHour: HourlyForecast | undefined = data.hourly[0];
  const next6 = getNextHours(data.hourly, 6);

  const feelsLike = Math.round(data.current.temperature + Math.min(6, Math.max(0, (data.current.humidity - 60) / 10)));

  const sunrise = data.current.sunrise ? new Date(data.current.sunrise) : null;
  const sunset = data.current.sunset ? new Date(data.current.sunset) : null;

  return (
    <section>
      {/* Rain warning banner */}
      {(() => {
        const alert = calculateAlertLevel(data.hourly);
        if (alert.level === 'safe') return null;
        const msg = getRainNotification(data.hourly) ?? alert.message;
        return (
          <div className="mb-4">
            <AlertBox alert={{ ...alert, message: msg }} />
          </div>
        );
      })()}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Weather details</h2>
        <div className="text-xs text-gray-500 dark:text-gray-400">{formatTimePH(new Date())}</div>
      </div>

      {/* Analytics */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* Next hour rain chance */}
        <div className="weather-card p-4 bg-gradient-to-br from-gray-800/80 to-gray-900/60">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-md bg-emerald-500/20 flex items-center justify-center"><CloudRain className="w-3.5 h-3.5 text-emerald-400" /></div>
              <span className="text-sm font-medium text-gray-200">Next hour rain chance</span>
            </div>
          </div>
          <div className="flex items-center justify-center">
            <RingGauge value={Math.round((data.hourly[0]?.precipitationProbability ?? 0))} label="Probability" color="#34d399" />
          </div>
        </div>
        {/* 12h precipitation */}
        <div id="wd-precip12" className="weather-card p-4 bg-gradient-to-br from-gray-800/80 to-gray-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-200">12-hour precipitation trend</span>
            <ExportButton targetId="wd-precip12" />
          </div>
          <div className="mt-3">
            <Sparkline values={getNextHours(data.hourly, 12).map(h => h.precipitation)} height={56} stroke="var(--chart-precip)" fill="var(--chart-precip)" area labels={getNextHours(data.hourly, 12).map((h,i)=>`${i}h`)} />
          </div>
          <p className="mt-2 text-xs text-gray-400">mm per hour</p>
        </div>
        {/* 12h probability */}
        <div id="wd-prob12" className="weather-card p-4 bg-gradient-to-br from-gray-800/80 to-gray-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-200">12-hour probability trend</span>
            <ExportButton targetId="wd-prob12" />
          </div>
          <div className="mt-3">
            <Sparkline values={getNextHours(data.hourly, 12).map(h => h.precipitationProbability)} height={56} stroke="var(--chart-prob)" fill="var(--chart-prob)" area labels={getNextHours(data.hourly, 12).map((h,i)=>`${i}h`)} />
          </div>
          <p className="mt-2 text-xs text-gray-400">probability %</p>
        </div>
        {/* UV gauge */}
        <div className="weather-card p-4 bg-gradient-to-br from-gray-800/80 to-gray-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-200">UV gauge</span>
          </div>
          <div className="mt-2 flex items-center justify-center">
            <UvGauge value={data.current.uvIndex ?? 0} />
          </div>
        </div>
        {/* Humidity ladder */}
        <div className="weather-card p-4 bg-gradient-to-br from-gray-800/80 to-gray-900/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-200">Humidity ladder</span>
          </div>
          <div className="mt-3">
            <HumidityLadder values={getNextHours(data.hourly, 5).map(h => h.humidity)} />
          </div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Temperature with sparkline */}
        <div id="wd-temp" className="weather-card p-4 bg-gradient-to-br from-gray-800/80 to-gray-900/60">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-200">Temperature</span>
            <ExportButton targetId="wd-temp" />
          </div>
          <div className="mt-3 flex items-end gap-2">
            <span className="text-3xl font-bold text-white">{Math.round(data.current.temperature)}°</span>
            <span className="text-xs text-gray-400">Now</span>
          </div>
          <div className="mt-3"><Sparkline values={getNextHours(data.hourly, 12).map(h => h.temperature)} height={56} stroke="var(--chart-temp)" fill="var(--chart-temp)" area labels={getNextHours(data.hourly, 12).map((h,i)=>`${i}h`)} /></div>
          <p className="mt-2 text-xs text-gray-400">Overnight low near {Math.max(20, Math.round(data.current.temperature - 3))}°.</p>
        </div>

        {/* Wind compass */}
        <div className="weather-card p-4 bg-gradient-to-br from-gray-800/80 to-gray-900/60">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-200">Wind</span>
          </div>
          <div className="mt-2 flex items-center justify-center">
            <WindCompass speed={data.current.windSpeed} direction={data.current.windDirection} />
          </div>
        </div>

        {/* Sun (keep) */}
        <div className="weather-card p-4 bg-gradient-to-br from-gray-800/80 to-gray-900/60">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-200">Sun</span>
            <Sun className="w-4 h-4 text-yellow-300" />
          </div>
          <div className="mt-3 text-sm text-gray-200">
            <div>Feels like: {feelsLike}°</div>
          </div>
          <p className="mt-2 text-xs text-gray-400">Clear intervals expected.</p>
        </div>
        {/* Additional cards trimmed per requirements. Keep UI clean and focused. */}

        {/* Sunrise/Sunset */}
        <div className="weather-card p-4 bg-gradient-to-br from-gray-800/80 to-gray-900/60">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-200">Sunrise & Sunset</span>
            <Sun className="w-4 h-4 text-yellow-300" />
          </div>
          <div className="mt-3 text-sm text-gray-200">
            <div>Sunrise: {sunrise ? formatTimePH(sunrise) : '—'}</div>
            <div>Sunset: {sunset ? formatTimePH(sunset) : '—'}</div>
          </div>
          <p className="mt-2 text-xs text-gray-400">~12 hours daylight.</p>
        </div>
      </div>
    </section>
  );
};

export default WeatherDetailsGrid;


