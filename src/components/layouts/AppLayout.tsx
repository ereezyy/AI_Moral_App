import React, { useState } from 'react';
import { MainNavigation } from '../navigation/MainNavigation';
import { PageHeader } from '../navigation/PageHeader';
import { QuickActions } from '../navigation/QuickActions';
import { ThemeToggle } from '../ThemeToggle';
import type { NavigationSection, BreadcrumbItem } from '../../types/navigation';

interface AppLayoutProps {
  children: React.ReactNode;
  currentSection: NavigationSection;
  onSectionChange: (section: NavigationSection) => void;
  pageTitle: string;
  pageSubtitle?: string;
  pageIcon?: React.ReactNode;
  breadcrumbs?: BreadcrumbItem[];
  headerActions?: React.ReactNode;
  showQuickActions?: boolean;
}

export function AppLayout({
  children,
  currentSection,
  onSectionChange,
  pageTitle,
  pageSubtitle,
  pageIcon,
  breadcrumbs,
  headerActions,
  showQuickActions = false
}: AppLayoutProps) {
  const handleQuickAction = (actionId: string) => {
    onSectionChange(actionId as NavigationSection);
  };

  return (
    <div className="min-h-screen bg-background transition-colors duration-300">
      <div className="flex">
        {/* Sidebar Navigation */}
        <MainNavigation 
          currentSection={currentSection}
          onSectionChange={onSectionChange}
        />

        {/* Main Content Area */}
        <div className="flex-1 lg:ml-0 min-h-screen">
          {/* Top Header */}
          <header className="bg-background border-b border-border shadow-theme-sm lg:ml-0">
            <div className="px-4 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 lg:hidden">
                  {/* Mobile spacing for hamburger menu */}
                  <div className="w-10"></div>
                </div>
                
                <div className="hidden lg:block">
                  <h1 className="text-xl font-bold text-foreground">MoralAI Guide</h1>
                </div>
                
                <div className="flex items-center gap-3">
                  <ThemeToggle />
                  {headerActions}
                </div>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="px-4 lg:px-8 py-6 pb-20 lg:pb-6">
            {/* Page Header */}
            <PageHeader
              title={pageTitle}
              subtitle={pageSubtitle}
              icon={pageIcon}
              breadcrumbs={breadcrumbs}
              actions={headerActions}
            />

            {/* Quick Actions (Overview Page Only) */}
            {showQuickActions && (
              <div className="mb-6">
                <QuickActions onAction={handleQuickAction} />
              </div>
            )}

            {/* Main Content */}
            <div className="space-y-6">
              {children}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}