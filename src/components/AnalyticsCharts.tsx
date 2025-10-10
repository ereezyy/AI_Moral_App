import React, { useEffect, useState } from 'react';
import { TrendingUp, MessageSquare, Brain, Activity } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface AnalyticsData {
  date: string;
  messages_sent: number;
  decisions_made: number;
  avg_sentiment: number;
  avg_ethical_score: number;
}

export function AnalyticsCharts() {
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const userId = localStorage.getItem('demo_user_id');
      if (!userId) {
        setLoading(false);
        return;
      }

      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from('user_analytics')
        .select('*')
        .eq('user_id', userId)
        .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
        .order('date', { ascending: true })
        .execute();

      if (error) throw error;

      setAnalytics(data || []);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  const getMaxValue = (key: keyof AnalyticsData) => {
    return Math.max(...analytics.map(a => Number(a[key]) || 0), 1);
  };

  const totalMessages = analytics.reduce((sum, a) => sum + a.messages_sent, 0);
  const totalDecisions = analytics.reduce((sum, a) => sum + a.decisions_made, 0);
  const avgSentiment = analytics.length > 0
    ? analytics.reduce((sum, a) => sum + a.avg_sentiment, 0) / analytics.length
    : 0;

  if (loading) {
    return (
      <div className="bg-background rounded-lg shadow-theme-lg p-6 border border-border">
        <div className="flex items-center justify-center h-64">
          <Activity className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  if (analytics.length === 0) {
    return (
      <div className="bg-background rounded-lg shadow-theme-lg p-6 border border-border">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-foreground">Activity Analytics</h2>
        </div>
        <div className="text-center py-12">
          <Brain className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Start chatting to see your analytics</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background rounded-lg shadow-theme-lg p-6 border border-border">
      <div className="flex items-center gap-2 mb-6">
        <TrendingUp className="w-6 h-6 text-primary" />
        <h2 className="text-xl font-semibold text-foreground">Activity Analytics</h2>
        <span className="text-sm text-muted-foreground ml-auto">Last 30 days</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
          <div className="flex items-center gap-2 mb-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <span className="text-sm text-muted-foreground">Total Messages</span>
          </div>
          <div className="text-3xl font-bold text-foreground">{totalMessages}</div>
        </div>

        <div className="p-4 bg-info/10 rounded-lg border border-info/20">
          <div className="flex items-center gap-2 mb-2">
            <Brain className="w-5 h-5 text-info" />
            <span className="text-sm text-muted-foreground">Decisions Made</span>
          </div>
          <div className="text-3xl font-bold text-foreground">{totalDecisions}</div>
        </div>

        <div className="p-4 bg-success/10 rounded-lg border border-success/20">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-success" />
            <span className="text-sm text-muted-foreground">Avg Sentiment</span>
          </div>
          <div className="text-3xl font-bold text-foreground">
            {(avgSentiment * 100).toFixed(0)}%
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-sm font-medium text-foreground mb-3">Messages Per Day</h3>
          <div className="space-y-2">
            {analytics.map((data, index) => {
              const maxMessages = getMaxValue('messages_sent');
              const percentage = (data.messages_sent / maxMessages) * 100;

              return (
                <div key={index} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-20">
                    {new Date(data.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                  <div className="flex-1 h-8 bg-muted rounded-md overflow-hidden relative">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: `${percentage}%` }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-foreground">
                      {data.messages_sent}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium text-foreground mb-3">Sentiment Trend</h3>
          <div className="h-32 flex items-end justify-between gap-1">
            {analytics.map((data, index) => {
              const height = data.avg_sentiment * 100;
              const color = data.avg_sentiment > 0.7 ? 'bg-success' :
                           data.avg_sentiment > 0.4 ? 'bg-warning' : 'bg-error';

              return (
                <div key={index} className="flex-1 flex flex-col items-center gap-1">
                  <div
                    className={`w-full ${color} rounded-t transition-all duration-300`}
                    style={{ height: `${height}%` }}
                    title={`${(data.avg_sentiment * 100).toFixed(0)}%`}
                  />
                  <span className="text-xs text-muted-foreground">
                    {new Date(data.date).getDate()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
