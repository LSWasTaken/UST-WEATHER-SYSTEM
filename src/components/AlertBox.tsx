import React from 'react';
import { AlertLevel } from '../types/weather';
import { AlertTriangle, CheckCircle, Info } from 'lucide-react';

interface AlertBoxProps {
  alert: AlertLevel;
}

const AlertBox: React.FC<AlertBoxProps> = ({ alert }) => {
  const getAlertStyles = (level: AlertLevel['level']) => {
    switch (level) {
      case 'safe':
        return {
          container: 'alert-safe',
          icon: <CheckCircle className="w-6 h-6 text-green-600" />,
          title: 'Safe Conditions',
          titleColor: 'text-green-800'
        };
      case 'warning':
        return {
          container: 'alert-warning',
          icon: <Info className="w-6 h-6 text-yellow-600" />,
          title: 'Weather Advisory',
          titleColor: 'text-yellow-800'
        };
      case 'danger':
        return {
          container: 'alert-danger',
          icon: <AlertTriangle className="w-6 h-6 text-red-600" />,
          title: 'Weather Alert',
          titleColor: 'text-red-800'
        };
      default:
        return {
          container: 'alert-safe',
          icon: <CheckCircle className="w-6 h-6 text-green-600" />,
          title: 'Safe Conditions',
          titleColor: 'text-green-800'
        };
    }
  };

  const styles = getAlertStyles(alert.level);

  return (
    <div className={`alert-box ${styles.container} mb-6`}>
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {styles.icon}
        </div>
        <div className="flex-1">
          <h3 className={`font-semibold text-lg ${styles.titleColor} mb-2`}>
            {styles.title}
          </h3>
          <p className="text-sm leading-relaxed">
            {alert.message}
          </p>
          <div className="mt-2 text-2xl">
            {alert.icon}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertBox;
