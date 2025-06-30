import React, { useEffect, useState } from 'react';
import { Bell, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Alert {
  id: string;
  type: 'warning' | 'info' | 'success';
  message: string;
  timestamp: number;
}

export function RealtimeAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    // Mock alerts for demonstration
    const interval = setInterval(() => {
      const shouldAddAlert = Math.random() > 0.7;
      
      if (shouldAddAlert) {
        const newAlert: Alert = {
          id: Math.random().toString(36).substr(2, 9),
          type: Math.random() > 0.5 ? 'warning' : 'info',
          message: 'Potential ethical consideration detected in current context',
          timestamp: Date.now(),
        };
        
        setAlerts(prev => [newAlert, ...prev].slice(0, 5));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Bell className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-semibold">Realtime Alerts</h2>
      </div>

      <AnimatePresence>
        {alerts.map(alert => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className={`mb-2 p-3 rounded-lg flex items-start gap-2 ${
              alert.type === 'warning' 
                ? 'bg-amber-50 text-amber-700'
                : 'bg-blue-50 text-blue-700'
            }`}
          >
            <AlertTriangle className="w-5 h-5 mt-0.5" />
            <div>
              <p>{alert.message}</p>
              <p className="text-sm opacity-75">
                {new Date(alert.timestamp).toLocaleTimeString()}
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {alerts.length === 0 && (
        <div className="text-gray-500 text-center py-4">
          No active alerts
        </div>
      )}
    </div>
  );
}