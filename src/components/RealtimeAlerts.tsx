import React, { useEffect, useState } from 'react';
import { Bell, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Alert {
  id: string;
  type: 'warning' | 'info' | 'success' | 'ethical';
  title: string;
  message: string;
  timestamp: number;
  actionable?: boolean;
}

const MEANINGFUL_ALERTS = [
  {
    type: 'ethical' as const,
    title: 'Important Choice Ahead',
    message: 'This decision could have lasting effects. Let\'s think it through.',
    actionable: true
  },
  {
    type: 'info' as const,
    title: 'Mood Shift Noticed',
    message: 'You seem more balanced now. Great progress!',
    actionable: false
  },
  {
    type: 'warning' as const,
    title: 'Stress Alert',
    message: 'You seem stressed. Maybe take a quick break?',
    actionable: true
  },
  {
    type: 'success' as const,
    title: 'Great Pattern!',
    message: 'You\'re making thoughtful choices consistently',
    actionable: false
  },
  {
    type: 'ethical' as const,
    title: 'Values Clash',
    message: 'Your personal and work values might be conflicting here',
    actionable: true
  },
  {
    type: 'info' as const,
    title: 'Environment Changed',
    message: 'I notice you\'re in a different setting now',
    actionable: false
  }
];

export function RealtimeAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    // Much less frequent, more meaningful alerts
    const interval = setInterval(() => {
      // Only 15% chance of generating an alert (vs 70% before)
      const shouldAddAlert = Math.random() > 0.85;
      
      if (shouldAddAlert && alerts.length < 3) { // Max 3 alerts
        const randomAlert = MEANINGFUL_ALERTS[Math.floor(Math.random() * MEANINGFUL_ALERTS.length)];
        
        const newAlert: Alert = {
          id: Math.random().toString(36).substr(2, 9),
          ...randomAlert,
          timestamp: Date.now(),
        };
        
        setAlerts(prev => [newAlert, ...prev]);
        
        // Auto-dismiss non-actionable alerts after 8 seconds
        if (!randomAlert.actionable) {
          setTimeout(() => {
            setAlerts(prev => prev.filter(alert => alert.id !== newAlert.id));
          }, 8000);
        }
      }
    }, 12000); // Every 12 seconds instead of 5

    return () => clearInterval(interval);
  }, [alerts.length]);

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
  };

  const getAlertIcon = (type: Alert['type']) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'ethical':
        return <Bell className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getAlertStyle = (type: Alert['type']) => {
    switch (type) {
      case 'warning':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'success':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'ethical':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-semibold">Contextual Insights</h2>
        {alerts.length > 0 && (
          <span className="bg-indigo-100 text-indigo-600 text-xs px-2 py-1 rounded-full">
            {alerts.length} active
          </span>
        )}
      </div>

      <AnimatePresence>
        {alerts.map(alert => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.95 }}
            className={`mb-3 p-4 rounded-lg border flex items-start gap-3 ${getAlertStyle(alert.type)}`}
          >
            <div className="mt-0.5">
              {getAlertIcon(alert.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm mb-1">{alert.title}</div>
              <p className="text-sm opacity-90">{alert.message}</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-xs opacity-75">
                  {new Date(alert.timestamp).toLocaleTimeString()}
                </p>
                {alert.actionable && (
                  <span className="text-xs bg-white bg-opacity-50 px-2 py-1 rounded">
                    Actionable
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => dismissAlert(alert.id)}
              className="p-1 hover:bg-black hover:bg-opacity-10 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      {alerts.length === 0 && (
        <div className="text-gray-500 text-center py-8">
          <Bell className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">No active insights</p>
          <p className="text-xs opacity-75 mt-1">
            AI monitoring for ethical considerations and decision points
          </p>
        </div>
      )}
    </div>
  );
}