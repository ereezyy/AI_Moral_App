import React from 'react';
import { motion } from 'framer-motion';

interface Tab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  badge?: string | number;
  disabled?: boolean;
}

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  size?: 'sm' | 'md' | 'lg';
}

export function TabNavigation({ 
  tabs, 
  activeTab, 
  onTabChange, 
  variant = 'underline',
  size = 'md' 
}: TabNavigationProps) {
  const sizeClasses = {
    sm: 'text-sm py-2 px-3',
    md: 'text-sm py-3 px-4', 
    lg: 'text-base py-4 px-6'
  };

  const getTabStyles = (tab: Tab, isActive: boolean) => {
    const baseClasses = `${sizeClasses[size]} font-medium transition-all duration-200 flex items-center gap-2 relative`;
    
    if (tab.disabled) {
      return `${baseClasses} text-muted-foreground/50 cursor-not-allowed`;
    }

    switch (variant) {
      case 'pills':
        return isActive
          ? `${baseClasses} bg-primary text-primary-foreground rounded-lg shadow-sm`
          : `${baseClasses} text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg`;
      
      case 'underline':
        return isActive
          ? `${baseClasses} text-primary border-b-2 border-primary`
          : `${baseClasses} text-muted-foreground hover:text-foreground border-b-2 border-transparent hover:border-border`;
      
      default:
        return isActive
          ? `${baseClasses} text-primary bg-primary/10 rounded-md`
          : `${baseClasses} text-muted-foreground hover:text-foreground hover:bg-muted rounded-md`;
    }
  };

  return (
    <div className={`flex ${variant === 'underline' ? 'border-b border-border' : ''} overflow-x-auto`}>
      <div className="flex space-x-1 min-w-full">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && onTabChange(tab.id)}
              className={getTabStyles(tab, isActive)}
              disabled={tab.disabled}
              aria-selected={isActive}
              role="tab"
            >
              {tab.icon}
              <span className="whitespace-nowrap">{tab.label}</span>
              {tab.badge && (
                <span className={`px-2 py-0.5 text-xs rounded-full ${
                  isActive 
                    ? 'bg-primary-foreground/20 text-primary-foreground' 
                    : 'bg-muted text-muted-foreground'
                }`}>
                  {tab.badge}
                </span>
              )}
              
              {/* Active indicator for underline variant */}
              {variant === 'underline' && isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
                  initial={false}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}