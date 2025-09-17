import React, { useState, useEffect } from 'react';
import { X, Bell } from 'lucide-react';

interface NotificationBannerProps {
  message: string | null;
  type: 'info' | 'warning' | 'danger';
  leftOffsetPx?: number;
  topOffsetPx?: number;
}

const NotificationBanner: React.FC<NotificationBannerProps> = ({ message, type, leftOffsetPx = 16, topOffsetPx = 16 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (message && !isDismissed) {
      setIsVisible(true);
      
      // Auto-hide after 10 seconds
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 10000);

      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [message, isDismissed]);

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
  };

  if (!message || !isVisible) {
    return null;
  }

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return 'bg-red-500 text-white border-red-600';
      case 'warning':
        return 'bg-yellow-500 text-white border-yellow-600';
      default:
        return 'bg-blue-500 text-white border-blue-600';
    }
  };

  return (
    <div className={`${getTypeStyles()} rounded-lg shadow-lg border-2`} style={{ position: 'fixed', top: topOffsetPx, left: leftOffsetPx, right: 16, zIndex: 60 }}>
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-3">
          <Bell className="w-5 h-5 flex-shrink-0" />
          <p className="font-medium text-sm md:text-base">
            {message}
          </p>
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 ml-4 p-1 rounded-full hover:bg-black/20 transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default NotificationBanner;
