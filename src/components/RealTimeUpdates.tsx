import React, { useState, useEffect } from 'react';
import { RefreshCw, Clock, Wifi, WifiOff } from 'lucide-react';

interface RealTimeUpdatesProps {
  onRefresh: () => void;
  lastUpdated: Date | null;
  loading: boolean;
}

const RealTimeUpdates: React.FC<RealTimeUpdatesProps> = ({ onRefresh, lastUpdated, loading }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [timeSinceUpdate, setTimeSinceUpdate] = useState<string>('');

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  useEffect(() => {
    if (!lastUpdated) return;

    const updateTimeSince = () => {
      const now = new Date();
      const diff = now.getTime() - lastUpdated.getTime();
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      if (minutes > 0) {
        setTimeSinceUpdate(`${minutes}m ${seconds}s ago`);
      } else {
        setTimeSinceUpdate(`${seconds}s ago`);
      }
    };

    updateTimeSince();
    const interval = setInterval(updateTimeSince, 1000);

    return () => clearInterval(interval);
  }, [lastUpdated]);

  return (
    <div className="bg-gray-800/50 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Connection Status */}
          <div className="flex items-center space-x-2">
            {isOnline ? (
              <Wifi className="w-4 h-4 text-green-400" />
            ) : (
              <WifiOff className="w-4 h-4 text-red-400" />
            )}
            <span className={`text-sm ${isOnline ? 'text-green-400' : 'text-red-400'}`}>
              {isOnline ? 'Online' : 'Offline'}
            </span>
          </div>

          {/* Last Updated */}
          {lastUpdated && (
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-gray-400" />
              <span className="text-sm text-gray-400">
                Updated {timeSinceUpdate}
              </span>
            </div>
          )}
        </div>

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={loading || !isOnline}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
            loading || !isOnline
              ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
              : 'bg-yellow-500 text-gray-900 hover:bg-yellow-400'
          }`}
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span className="text-sm font-medium">
            {loading ? 'Updating...' : 'Refresh'}
          </span>
        </button>
      </div>

      {/* Auto-refresh indicator */}
      <div className="mt-2 text-xs text-gray-500">
        Auto-refreshes every 10 minutes
      </div>
    </div>
  );
};

export default RealTimeUpdates;
