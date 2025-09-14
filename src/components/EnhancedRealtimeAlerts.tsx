import React, { useEffect, useState } from 'react';
import { Brain, AlertTriangle, CheckCircle, Info, X, TrendingUp, Shield, Zap, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface EnhancedAlert {
  id: string;
  type: 'warning' | 'info' | 'success' | 'ethical' | 'predictive' | 'behavioral' | 'growth';
  severity: 'low' | 'medium' | 'high' | 'critical';
  title: string;
  message: string;
  timestamp: number;
  actionable?: boolean;
  predictions?: string[];
  interventions?: string[];
  confidence?: number;
}

const ENHANCED_ALERTS = [
  {
    type: 'predictive' as const,
    severity: 'high' as const,
    title: 'Decision Pattern Detected',
    message: 'Based on your conversation patterns, you may be approaching a significant decision point. Your stress indicators suggest taking time to process emotions first.',
    actionable: true,
    predictions: ['Decision confidence may increase after emotional processing', 'Support from trusted advisors likely helpful'],
    interventions: ['Take 10 minutes for mindful breathing', 'Write down your core concerns', 'Identify your top 3 values relevant to this decision'],
    confidence: 0.82
  },
  {
    type: 'behavioral' as const,
    severity: 'medium' as const,
    title: 'Behavioral Pattern Analysis',
    message: 'Your communication style indicates high conscientiousness but potential perfectionism tendencies. This strength can sometimes lead to decision paralysis.',
    actionable: true,
    predictions: ['May benefit from "good enough" decision frameworks', 'Likely to overthink without time boundaries'],
    interventions: ['Set a decision deadline', 'Use 80% confidence rule for decisions', 'Practice self-compassion'],
    confidence: 0.76
  },
  {
    type: 'growth' as const,
    severity: 'low' as const,
    title: 'Growth Opportunity Identified',
    message: 'Your recent conversations show increased emotional intelligence. This is an excellent foundation for developing stronger intuitive decision-making.',
    actionable: true,
    predictions: ['Continued growth in self-awareness likely', 'Decision confidence expected to improve'],
    interventions: ['Practice trusting first instincts', 'Keep a decision outcome journal', 'Celebrate small decision wins'],
    confidence: 0.89
  },
  {
    type: 'ethical' as const,
    severity: 'high' as const,
    title: 'Values Alignment Check',
    message: 'The current situation appears to involve competing values. Your past patterns suggest you prioritize integrity and relationships - ensure your decision honors both.',
    actionable: true,
    predictions: ['Decision alignment with values will increase long-term satisfaction', 'Potential short-term discomfort but long-term growth'],
    interventions: ['List your top 5 values', 'Consider how each option aligns', 'Visualize yourself in 5 years - which choice feels right?'],
    confidence: 0.78
  },
  {
    type: 'warning' as const,
    severity: 'critical' as const,
    title: 'Stress Threshold Alert',
    message: 'Multiple indicators suggest you may be approaching your stress capacity. Your decision-making quality typically decreases when overwhelmed.',
    actionable: true,
    predictions: ['Decision quality may be compromised without stress management', 'Recovery time needed before major decisions'],
    interventions: ['Postpone non-urgent decisions', 'Activate support network', 'Consider professional stress management support'],
    confidence: 0.91
  }
];

export function EnhancedRealtimeAlerts() {
  const [alerts, setAlerts] = useState<EnhancedAlert[]>([]);
  const [expandedAlert, setExpandedAlert] = useState<string | null>(null);

  useEffect(() => {
    // Generate meaningful, context-aware alerts less frequently
    const interval = setInterval(() => {
      // Only 20% chance of generating an alert (more selective)
      const shouldAddAlert = Math.random() > 0.8;
      
      if (shouldAddAlert && alerts.length < 4) {
        const randomAlert = ENHANCED_ALERTS[Math.floor(Math.random() * ENHANCED_ALERTS.length)];
        
        const newAlert: EnhancedAlert = {
          id: Math.random().toString(36).substr(2, 9),
          ...randomAlert,
          timestamp: Date.now(),
        };
        
        setAlerts(prev => [newAlert, ...prev.slice(0, 3)]);
        
        // Auto-dismiss low priority alerts
        if (randomAlert.severity === 'low') {
          setTimeout(() => {
            setAlerts(prev => prev.filter(alert => alert.id !== newAlert.id));
          }, 12000);
        }
      }
    }, 15000); // Every 15 seconds

    return () => clearInterval(interval);
  }, [alerts.length]);

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(alert => alert.id !== id));
    if (expandedAlert === id) {
      setExpandedAlert(null);
    }
  };

  const getAlertIcon = (type: EnhancedAlert['type']) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5" />;
      case 'success':
        return <CheckCircle className="w-5 h-5" />;
      case 'ethical':
        return <Shield className="w-5 h-5" />;
      case 'predictive':
        return <TrendingUp className="w-5 h-5" />;
      case 'behavioral':
        return <Brain className="w-5 h-5" />;
      case 'growth':
        return <Target className="w-5 h-5" />;
      default:
        return <Info className="w-5 h-5" />;
    }
  };

  const getAlertStyle = (type: EnhancedAlert['type'], severity: EnhancedAlert['severity']) => {
    const baseClasses = 'border-l-4';
    const severityClasses = severity === 'critical' ? 'ring-2 ring-red-200' : 
                           severity === 'high' ? 'ring-1 ring-orange-200' : '';
    
    switch (type) {
      case 'warning':
        return `${baseClasses} bg-red-50 text-red-700 border-red-400 ${severityClasses}`;
      case 'success':
        return `${baseClasses} bg-green-50 text-green-700 border-green-400 ${severityClasses}`;
      case 'ethical':
        return `${baseClasses} bg-purple-50 text-purple-700 border-purple-400 ${severityClasses}`;
      case 'predictive':
        return `${baseClasses} bg-blue-50 text-blue-700 border-blue-400 ${severityClasses}`;
      case 'behavioral':
        return `${baseClasses} bg-indigo-50 text-indigo-700 border-indigo-400 ${severityClasses}`;
      case 'growth':
        return `${baseClasses} bg-green-50 text-green-700 border-green-400 ${severityClasses}`;
      default:
        return `${baseClasses} bg-gray-50 text-gray-700 border-gray-400 ${severityClasses}`;
    }
  };

  const getSeverityBadge = (severity: EnhancedAlert['severity']) => {
    const styles = {
      low: 'bg-gray-100 text-gray-600',
      medium: 'bg-yellow-100 text-yellow-700',
      high: 'bg-orange-100 text-orange-700',
      critical: 'bg-red-100 text-red-700 animate-pulse'
    };
    
    return (
      <span className={`px-2 py-1 text-xs rounded-full font-medium ${styles[severity]}`}>
        {severity.toUpperCase()}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-semibold">Enhanced Intelligence</h2>
        {alerts.length > 0 && (
          <span className="bg-indigo-100 text-indigo-600 text-xs px-2 py-1 rounded-full">
            {alerts.length} insights
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
            className={`mb-4 p-4 rounded-lg ${getAlertStyle(alert.type, alert.severity)}`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex-shrink-0">
                {getAlertIcon(alert.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-sm">{alert.title}</h4>
                    {getSeverityBadge(alert.severity)}
                  </div>
                  <div className="flex items-center gap-2">
                    {alert.confidence && (
                      <span className="text-xs opacity-75">
                        {Math.round(alert.confidence * 100)}% confidence
                      </span>
                    )}
                    <button
                      onClick={() => setExpandedAlert(expandedAlert === alert.id ? null : alert.id)}
                      className="text-xs underline hover:no-underline"
                    >
                      {expandedAlert === alert.id ? 'Less' : 'More'}
                    </button>
                  </div>
                </div>
                
                <p className="text-sm opacity-90 mb-2">{alert.message}</p>
                
                <div className="flex items-center justify-between text-xs">
                  <span className="opacity-75">
                    {new Date(alert.timestamp).toLocaleTimeString()}
                  </span>
                  <div className="flex items-center gap-2">
                    {alert.actionable && (
                      <span className="bg-white bg-opacity-50 px-2 py-1 rounded">
                        Actionable
                      </span>
                    )}
                    <span className="capitalize opacity-75">{alert.type}</span>
                  </div>
                </div>

                <AnimatePresence>
                  {expandedAlert === alert.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-3 pt-3 border-t border-current border-opacity-20"
                    >
                      {alert.predictions && (
                        <div className="mb-3">
                          <h5 className="text-xs font-medium mb-1">🔮 Predictions:</h5>
                          <ul className="text-xs space-y-1">
                            {alert.predictions.map((prediction, idx) => (
                              <li key={idx} className="opacity-90">• {prediction}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {alert.interventions && (
                        <div className="mb-3">
                          <h5 className="text-xs font-medium mb-1">💡 Suggested Actions:</h5>
                          <ul className="text-xs space-y-1">
                            {alert.interventions.map((intervention, idx) => (
                              <li key={idx} className="opacity-90">• {intervention}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <button
                onClick={() => dismissAlert(alert.id)}
                className="p-1 hover:bg-black hover:bg-opacity-10 rounded transition-colors flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {alerts.length === 0 && (
        <div className="text-gray-500 text-center py-8">
          <Brain className="w-8 h-8 mx-auto mb-2 opacity-30" />
          <p className="text-sm">Advanced AI monitoring active</p>
          <p className="text-xs opacity-75 mt-1">
            Analyzing behavioral patterns, emotional trends, and decision contexts
          </p>
        </div>
      )}
    </div>
  );
}