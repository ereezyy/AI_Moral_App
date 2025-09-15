import React, { useState } from 'react';
import { 
  Home, Brain, Video, Mic, MessageSquare, TrendingUp, 
  User, Target, Sparkles, BarChart3, Settings, Menu, X 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { NavigationItem, NavigationSection } from '../../types/navigation';

interface MainNavigationProps {
  currentSection: NavigationSection;
  onSectionChange: (section: NavigationSection) => void;
}

export function MainNavigation({ currentSection, onSectionChange }: MainNavigationProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigationItems: NavigationItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: Home,
      path: '/overview',
      description: 'Your daily dashboard'
    },
    {
      id: 'analysis',
      label: 'Live Monitor',
      icon: Brain,
      path: '/analysis',
      description: 'Real-time emotional analysis',
      children: [
        { id: 'video', label: 'Camera View', icon: Video, path: '/analysis/video' },
        { id: 'audio', label: 'Voice Monitor', icon: Mic, path: '/analysis/audio' }
      ]
    },
    {
      id: 'coaching',
      label: 'AI Partner',
      icon: MessageSquare,
      path: '/coaching',
      description: 'Chat with your AI companion',
      badge: 'Live'
    },
    {
      id: 'insights',
      label: 'Insights',
      icon: TrendingUp,
      path: '/insights',
      description: 'Your patterns and predictions',
      children: [
        { id: 'predictive', label: 'Predictions', icon: TrendingUp, path: '/insights/predictive' },
        { id: 'multidimensional', label: 'Deep Analysis', icon: Sparkles, path: '/insights/consciousness' }
      ]
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      path: '/profile',
      description: 'Your personality and growth'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      path: '/settings',
      description: 'App preferences'
    }
  ];

  const handleNavigation = (item: NavigationItem) => {
    onSectionChange(item.id as NavigationSection);
    setIsMobileMenuOpen(false);
  };

  const currentItem = navigationItems.find(item => item.id === currentSection);

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex bg-background border-r border-border h-screen w-64 flex-col shadow-theme-sm">
        {/* Logo Section */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Brain className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground">MoralAI Guide</h1>
              <p className="text-xs text-muted-foreground">Your AI Life Companion</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex-1 overflow-y-auto py-4">
          <div className="space-y-1 px-3">
            {navigationItems.map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => handleNavigation(item)}
                  className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-all duration-200 group ${
                    currentSection === item.id
                      ? 'bg-primary text-primary-foreground shadow-sm'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${
                    currentSection === item.id ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">{item.label}</span>
                      {item.badge && (
                        <span className="px-2 py-0.5 text-xs bg-success text-white rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-xs opacity-75 mt-0.5">{item.description}</p>
                  </div>
                </button>

                {/* Sub-navigation */}
                {item.children && currentSection === item.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="ml-6 mt-2 space-y-1"
                  >
                    {item.children.map((child) => (
                      <button
                        key={child.id}
                        onClick={() => handleNavigation(child)}
                        className="w-full flex items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-md transition-colors"
                      >
                        <child.icon className="w-4 h-4" />
                        {child.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="text-xs text-muted-foreground text-center">
            <p>AI-Powered Ethical Guidance</p>
            <p className="mt-1 opacity-75">v2.0.0</p>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Toggle */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-background border border-border rounded-lg shadow-theme-md"
      >
        {isMobileMenuOpen ? (
          <X className="w-6 h-6 text-foreground" />
        ) : (
          <Menu className="w-6 h-6 text-foreground" />
        )}
      </button>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />
            <motion.nav
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="lg:hidden fixed left-0 top-0 h-screen w-80 bg-background border-r border-border shadow-theme-xl z-50 flex flex-col"
            >
              {/* Mobile Logo */}
              <div className="p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                    <Brain className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div>
                    <h1 className="text-lg font-bold text-foreground">MoralAI Guide</h1>
                    <p className="text-xs text-muted-foreground">AI Life Companion</p>
                  </div>
                </div>
              </div>

              {/* Mobile Navigation Items */}
              <div className="flex-1 overflow-y-auto py-4">
                <div className="space-y-2 px-4">
                  {navigationItems.map((item) => (
                    <div key={item.id}>
                      <button
                        onClick={() => handleNavigation(item)}
                        className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl text-left transition-all ${
                          currentSection === item.id
                            ? 'bg-primary text-primary-foreground'
                            : 'text-foreground hover:bg-muted'
                        }`}
                      >
                        <item.icon className="w-6 h-6" />
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{item.label}</span>
                            {item.badge && (
                              <span className="px-2 py-1 text-xs bg-success text-white rounded-full">
                                {item.badge}
                              </span>
                            )}
                          </div>
                          <p className="text-xs opacity-75 mt-1">{item.description}</p>
                        </div>
                      </button>

                      {/* Mobile Sub-navigation */}
                      {item.children && currentSection === item.id && (
                        <div className="ml-6 mt-2 space-y-1">
                          {item.children.map((child) => (
                            <button
                              key={child.id}
                              onClick={() => handleNavigation(child)}
                              className="w-full flex items-center gap-3 px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                            >
                              <child.icon className="w-4 h-4" />
                              {child.label}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>

      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-30">
        <div className="flex items-center justify-around py-2">
          {navigationItems.slice(0, 5).map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavigation(item)}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                currentSection === item.id
                  ? 'text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
              {item.badge && (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-success rounded-full"></div>
              )}
            </button>
          ))}
        </div>
      </nav>
    </>
  );
}