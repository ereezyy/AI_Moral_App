import React from 'react';
import { Zap, Brain, Heart, Target, MessageSquare, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  color: string;
  action: () => void;
}

interface QuickActionsProps {
  onAction: (actionId: string) => void;
}

export function QuickActions({ onAction }: QuickActionsProps) {
  const quickActions: QuickAction[] = [
    {
      id: 'start-chat',
      label: 'Chat with AI',
      icon: MessageSquare,
      description: 'Start conversation with your AI life partner',
      color: 'bg-indigo-500 text-white',
      action: () => onAction('coaching')
    },
    {
      id: 'analyze-emotion',
      label: 'Check Emotions',
      icon: Heart,
      description: 'Analyze current emotional state',
      color: 'bg-purple-500 text-white',
      action: () => onAction('analysis')
    },
    {
      id: 'view-insights',
      label: 'View Insights',
      icon: TrendingUp,
      description: 'See predictive patterns and trends',
      color: 'bg-blue-500 text-white',
      action: () => onAction('insights')
    },
    {
      id: 'coaching-session',
      label: 'Coaching',
      icon: Target,
      description: 'Start personalized coaching session',
      color: 'bg-green-500 text-white',
      action: () => onAction('coaching')
    }
  ];

  return (
    <div className="bg-background rounded-lg border border-border p-6 shadow-theme-sm">
      <div className="flex items-center gap-2 mb-4">
        <Zap className="w-5 h-5 text-primary" />
        <h2 className="text-lg font-semibold text-foreground">Quick Actions</h2>
      </div>
      
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {quickActions.map((action, index) => (
          <motion.button
            key={action.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={action.action}
            className={`p-4 rounded-xl ${action.color} shadow-theme-sm hover:shadow-theme-md transition-all duration-200 transform hover:scale-105 group`}
          >
            <action.icon className="w-6 h-6 mb-2 mx-auto" />
            <div className="text-sm font-medium mb-1">{action.label}</div>
            <div className="text-xs opacity-90">{action.description}</div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}