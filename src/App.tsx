import React, { useState, useCallback } from 'react';
import { Brain, Video, MessageSquare, TrendingUp, User, Settings } from 'lucide-react';
import { AppLayout } from './components/layouts/AppLayout';
import { OverviewSection, AnalysisSection, CoachingSection, InsightsSection, ProfileSection } from './components/sections';
import { ErrorBoundaryProvider } from './lib/providers';
import { ThemeProvider } from './components/ThemeProvider';
import type { NavigationSection, BreadcrumbItem } from './types/navigation';
import type { VideoAnalysis, AudioAnalysis } from './types/analysis';

function App() {
  const [currentSection, setCurrentSection] = useState<NavigationSection>('overview');
  const [videoAnalysis, setVideoAnalysis] = useState<VideoAnalysis | null>(null);
  const [audioAnalysis, setAudioAnalysis] = useState<AudioAnalysis | null>(null);

  const handleVideoAnalysis = useCallback((analysis: VideoAnalysis) => {
    setVideoAnalysis(analysis);
  }, []);

  const handleAudioAnalysis = useCallback((analysis: AudioAnalysis) => {
    setAudioAnalysis(analysis);
  }, []);

  const getPageConfig = () => {
    switch (currentSection) {
      case 'overview':
        return {
          title: 'Overview',
          subtitle: 'Your daily dashboard and quick actions',
          icon: <Brain className="w-6 h-6 text-primary" />,
          showQuickActions: true
        };
      case 'analysis':
        return {
          title: 'Live Analysis',
          subtitle: 'Real-time video and audio monitoring',
          icon: <Video className="w-6 h-6 text-primary" />,
          breadcrumbs: [
            { label: 'Overview', path: '/overview' },
            { label: 'Live Analysis', current: true }
          ] as BreadcrumbItem[]
        };
      case 'coaching':
        return {
          title: 'AI Life Partner',
          subtitle: 'Conversational guidance and coaching',
          icon: <MessageSquare className="w-6 h-6 text-primary" />,
          breadcrumbs: [
            { label: 'Overview', path: '/overview' },
            { label: 'AI Partner', current: true }
          ] as BreadcrumbItem[]
        };
      case 'insights':
        return {
          title: 'Advanced Insights',
          subtitle: 'Predictive analytics and consciousness analysis',
          icon: <TrendingUp className="w-6 h-6 text-primary" />,
          breadcrumbs: [
            { label: 'Overview', path: '/overview' },
            { label: 'Insights', current: true }
          ] as BreadcrumbItem[]
        };
      case 'profile':
        return {
          title: 'Personal Profile',
          subtitle: 'Psychological analysis and activity tracking',
          icon: <User className="w-6 h-6 text-primary" />,
          breadcrumbs: [
            { label: 'Overview', path: '/overview' },
            { label: 'Profile', current: true }
          ] as BreadcrumbItem[]
        };
      case 'settings':
        return {
          title: 'Settings',
          subtitle: 'Preferences and configuration',
          icon: <Settings className="w-6 h-6 text-primary" />,
          breadcrumbs: [
            { label: 'Overview', path: '/overview' },
            { label: 'Settings', current: true }
          ] as BreadcrumbItem[]
        };
      default:
        return {
          title: 'MoralAI Guide',
          subtitle: 'AI-powered ethical guidance',
          icon: <Brain className="w-6 h-6 text-primary" />
        };
    }
  };

  const renderCurrentSection = () => {
    switch (currentSection) {
      case 'overview':
        return <OverviewSection onNavigate={setCurrentSection} />;
      case 'analysis':
        return (
          <AnalysisSection 
            onVideoAnalysis={handleVideoAnalysis}
            onAudioAnalysis={handleAudioAnalysis}
          />
        );
      case 'coaching':
        return (
          <CoachingSection 
            videoAnalysis={videoAnalysis}
            audioAnalysis={audioAnalysis}
          />
        );
      case 'insights':
        return (
          <InsightsSection 
            videoAnalysis={videoAnalysis}
            audioAnalysis={audioAnalysis}
          />
        );
      case 'profile':
        return (
          <ProfileSection 
            videoAnalysis={videoAnalysis}
            audioAnalysis={audioAnalysis}
          />
        );
      case 'settings':
        return (
          <div className="bg-background rounded-lg border border-border p-8 text-center">
            <Settings className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Settings</h3>
            <p className="text-muted-foreground">Configuration options coming soon...</p>
          </div>
        );
      default:
        return <OverviewSection onNavigate={setCurrentSection} />;
    }
  };

  const pageConfig = getPageConfig();

  return (
    <ThemeProvider>
      <ErrorBoundaryProvider>
        <AppLayout
          currentSection={currentSection}
          onSectionChange={setCurrentSection}
          pageTitle={pageConfig.title}
          pageSubtitle={pageConfig.subtitle}
          pageIcon={pageConfig.icon}
          breadcrumbs={pageConfig.breadcrumbs}
          showQuickActions={pageConfig.showQuickActions}
        >
          {renderCurrentSection()}
        </AppLayout>
      </ErrorBoundaryProvider>
    </ThemeProvider>
  );
}

export default App;