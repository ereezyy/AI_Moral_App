import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { Breadcrumbs } from './Breadcrumbs';
import type { BreadcrumbItem } from '../../types/navigation';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  onBack?: () => void;
  onBreadcrumbNavigate?: (path: string) => void;
}

export function PageHeader({ 
  title, 
  subtitle, 
  icon, 
  breadcrumbs, 
  actions, 
  onBack,
  onBreadcrumbNavigate 
}: PageHeaderProps) {
  return (
    <div className="mb-6">
      {breadcrumbs && (
        <Breadcrumbs items={breadcrumbs} onNavigate={onBreadcrumbNavigate} />
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 hover:bg-muted rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-muted-foreground" />
            </button>
          )}
          
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                {icon}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-foreground">{title}</h1>
              {subtitle && (
                <p className="text-muted-foreground mt-1">{subtitle}</p>
              )}
            </div>
          </div>
        </div>
        
        {actions && (
          <div className="flex items-center gap-2">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}