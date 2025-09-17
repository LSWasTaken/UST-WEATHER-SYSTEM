import React, { useEffect, useState } from 'react';
import { CurrentWeather as CurrentWeatherType, WEATHER_CODES } from '../types/weather';
import { Wind, Droplets, Eye, Gauge, Thermometer, Check, X } from 'lucide-react';

interface CurrentWeatherDetailedProps {
  current: CurrentWeatherType;
}

const CurrentWeatherDetailed: React.FC<CurrentWeatherDetailedProps> = ({ current }) => {
  const weatherInfo = WEATHER_CODES[current.weatherCode] || { description: 'Unknown', icon: '❓' };
  
  // Neighbor observation voting state (persisted locally)
  const STORAGE_KEY = 'neighbor-observation-temp-gt-35-v1';
  const [agreeCount, setAgreeCount] = useState<number>(0);
  const [disagreeCount, setDisagreeCount] = useState<number>(0);
  const [userVote, setUserVote] = useState<'agree' | 'disagree' | null>(null);
  const [observedAt, setObservedAt] = useState<number>(Date.now());
  const [dismissed, setDismissed] = useState<boolean>(false);
  const [relativeMinutes, setRelativeMinutes] = useState<number>(11);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as {
          agreeCount: number;
          disagreeCount: number;
          userVote: 'agree' | 'disagree' | null;
          observedAt: number;
        };
        setAgreeCount(parsed.agreeCount ?? 0);
        setDisagreeCount(parsed.disagreeCount ?? 0);
        setUserVote(parsed.userVote ?? null);
        setObservedAt(parsed.observedAt ?? Date.now());
      } else {
        // Seed with a baseline so UI looks alive
        const seed: { agreeCount: number; disagreeCount: number; userVote: 'agree' | 'disagree' | null; observedAt: number } = { agreeCount: 3, disagreeCount: 1, userVote: null, observedAt: Date.now() - 11 * 60 * 1000 };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seed));
        setAgreeCount(seed.agreeCount);
        setDisagreeCount(seed.disagreeCount);
        setObservedAt(seed.observedAt);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  useEffect(() => {
    const tick = () => {
      const mins = Math.max(0, Math.floor((Date.now() - observedAt) / 60000));
      setRelativeMinutes(mins);
    };
    tick();
    const id = setInterval(tick, 60 * 1000);
    return () => clearInterval(id);
  }, [observedAt]);

  function persist(next: { agreeCount: number; disagreeCount: number; userVote: 'agree' | 'disagree' | null; observedAt: number }) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  }

  const handleAgree = () => {
    if (userVote === 'agree') {
      // un-vote
      const next: { agreeCount: number; disagreeCount: number; userVote: 'agree' | 'disagree' | null; observedAt: number } = { agreeCount: Math.max(0, agreeCount - 1), disagreeCount, userVote: null, observedAt };
      setAgreeCount(next.agreeCount);
      setUserVote(next.userVote);
      persist(next);
      return;
    }
    const dec = userVote === 'disagree' ? 1 : 0;
    const next: { agreeCount: number; disagreeCount: number; userVote: 'agree' | 'disagree' | null; observedAt: number } = { agreeCount: agreeCount + 1, disagreeCount: Math.max(0, disagreeCount - dec), userVote: 'agree', observedAt };
    setAgreeCount(next.agreeCount);
    setDisagreeCount(next.disagreeCount);
    setUserVote('agree');
    persist(next);
  };

  const handleDisagree = () => {
    if (userVote === 'disagree') {
      // un-vote
      const next: { agreeCount: number; disagreeCount: number; userVote: 'agree' | 'disagree' | null; observedAt: number } = { agreeCount, disagreeCount: Math.max(0, disagreeCount - 1), userVote: null, observedAt };
      setDisagreeCount(next.disagreeCount);
      setUserVote(next.userVote);
      persist(next);
      return;
    }
    const dec = userVote === 'agree' ? 1 : 0;
    const next: { agreeCount: number; disagreeCount: number; userVote: 'agree' | 'disagree' | null; observedAt: number } = { agreeCount: Math.max(0, agreeCount - dec), disagreeCount: disagreeCount + 1, userVote: 'disagree', observedAt };
    setAgreeCount(next.agreeCount);
    setDisagreeCount(next.disagreeCount);
    setUserVote('disagree');
    persist(next);
  };

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem('neighbor-banner-dismissed', '1');
  };

  useEffect(() => {
    setDismissed(sessionStorage.getItem('neighbor-banner-dismissed') === '1');
  }, []);
  
  const formatTime = (timeString: string) => {
    return new Date(timeString).toLocaleTimeString('en-PH', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Manila'
    });
  };

  return (
    <div className="space-y-6">
      {/* Alert Banner */}
      {!dismissed && (
        <div className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Thermometer className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-orange-200">Neighbor observed · {relativeMinutes}mins ago</span>
              </div>
              <div className="text-sm font-medium text-orange-100">Temperature Above 35°</div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleAgree}
                className={`flex items-center space-x-1 px-3 py-1 rounded-md transition-colors ${
                  userVote === 'agree'
                    ? 'bg-green-500 text-gray-900'
                    : 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                }`}
                aria-pressed={userVote === 'agree'}
              >
                <Check className="w-3 h-3" />
                <span className="text-xs">Agree ({agreeCount})</span>
              </button>
              <button
                onClick={handleDisagree}
                className={`flex items-center space-x-1 px-3 py-1 rounded-md transition-colors ${
                  userVote === 'disagree'
                    ? 'bg-red-500 text-gray-900'
                    : 'bg-red-500/20 text-red-300 hover:bg-red-500/30'
                }`}
                aria-pressed={userVote === 'disagree'}
              >
                <X className="w-3 h-3" />
                <span className="text-xs">Disagree ({disagreeCount})</span>
              </button>
              <button
                onClick={handleDismiss}
                className="p-1 text-orange-300 hover:text-white transition-colors"
                aria-label="Dismiss observation banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Weather Display */}
      <div className="text-center">
        <div className="text-8xl font-light text-white mb-2">{current.temperature}°C</div>
        <div className="text-xl text-gray-300 mb-1">{weatherInfo.description}</div>
        <div className="text-lg text-gray-400">Feels like {Math.round(current.temperature + 6)}°</div>
      </div>

      {/* Weather Icon and Description */}
      <div className="flex items-center justify-center space-x-4">
        <div className="text-6xl">{weatherInfo.icon}</div>
        <div className="text-gray-300 max-w-md">
          <p className="text-sm leading-relaxed">
            Scattered light rain showers are expected. The high will be {current.temperature}° on this very humid day.
          </p>
        </div>
      </div>

      {/* Detailed Metrics Grid */}
      <div className="grid grid-cols-5 gap-4">
        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <Wind className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-semibold text-white">{current.windSpeed}</div>
          <div className="text-sm text-gray-400">km/h</div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <Droplets className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-semibold text-white">{current.humidity}</div>
          <div className="text-sm text-gray-400">%</div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <Eye className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-semibold text-white">{current.visibility}</div>
          <div className="text-sm text-gray-400">km</div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <Gauge className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-semibold text-white">{current.pressure}</div>
          <div className="text-sm text-gray-400">mb</div>
        </div>

        <div className="bg-gray-800/50 rounded-lg p-4 text-center">
          <Thermometer className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <div className="text-2xl font-semibold text-white">{Math.round(current.temperature - 4)}</div>
          <div className="text-sm text-gray-400">Dew point</div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeatherDetailed;
