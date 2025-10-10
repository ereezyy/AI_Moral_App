import React from 'react';
import { Home, Activity, Brain, TrendingUp } from 'lucide-react';
import { PerformanceMetrics } from '../PerformanceMetrics';
import { EnhancedRealtimeAlerts } from '../EnhancedRealtimeAlerts';
import { QuickActions } from '../navigation/QuickActions';
import { AnalyticsCharts } from '../AnalyticsCharts';
import { ConversationHistory } from '../ConversationHistory';
import { useStore } from '../../store/useStore';
import type { NavigationSection } from '../../types/navigation';

interface OverviewSectionProps {
  onNavigate: (section: NavigationSection) => void;
}

export function OverviewSection({ onNavigate }: OverviewSectionProps) {
  const { stats, dailyGoals } = useStore();

  const handleQuickAction = (actionId: string) => {
    onNavigate(actionId as NavigationSection);
  };

  return (
    <div className="space-y-6">
      {/* Daily Goals Overview */}
      <div className="bg-background rounded-lg border border-border shadow-theme-sm p-6">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Today's Goals</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.entries(dailyGoals).map(([key, value]) => (
            <div key={key} className="p-4 bg-muted rounded-lg border border-border">
              <div className="text-sm text-muted-foreground capitalize">
                {key.replace(/([A-Z])/g, ' $1')}
              </div>
              <div className="text-2xl font-bold text-primary">{value}</div>
              <div className="text-xs text-muted-foreground">minutes</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <QuickActions onAction={handleQuickAction} />

      {/* Analytics Charts */}
      <AnalyticsCharts />

      {/* Conversation History */}
      <ConversationHistory onLoadConversation={(id) => onNavigate('coaching')} />

      {/* Performance Metrics */}
      <PerformanceMetrics stats={stats} />

      {/* Real-time Alerts */}
      <EnhancedRealtimeAlerts />

      {/* Welcome Message */}
      <div className="bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg border border-primary/20 p-6">
        <div className="flex items-center gap-3 mb-3">
          <Brain className="w-8 h-8 text-primary" />
          <div>
            <h3 className="text-lg font-semibold text-foreground">Welcome to Your AI Life Companion</h3>
            <p className="text-muted-foreground">Get personalized guidance for life's decisions and unlock your growth potential</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="p-3 bg-background/60 rounded-md border border-border/50">
            <Brain className="w-6 h-6 text-primary mb-2" />
            <h4 className="font-medium text-foreground">Smart Analysis</h4>
            <p className="text-xs text-muted-foreground">Understands your emotions through camera and voice</p>
          </div>
          <div className="p-3 bg-background/60 rounded-md border border-border/50">
            <TrendingUp className="w-6 h-6 text-info mb-2" />
            <h4 className="font-medium text-foreground">Smart Predictions</h4>
            <p className="text-xs text-muted-foreground">Learns your patterns to predict what helps you most</p>
          </div>
          <div className="p-3 bg-background/60 rounded-md border border-border/50">
            <Activity className="w-6 h-6 text-success mb-2" />
            <h4 className="font-medium text-foreground">Personal Growth</h4>
            <p className="text-xs text-muted-foreground">Personalized coaching that grows with you</p>
          </div>
        </div>
      </div>
    </div>
  );
}