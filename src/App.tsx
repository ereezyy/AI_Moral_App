import React from 'react';
import { Brain } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { ErrorBoundaryProvider } from './lib/providers';
import { ThemeProvider } from './components/ThemeProvider';
import { ThemeToggle } from './components/ThemeToggle';

function App() {
  return (
    <ThemeProvider>
      <ErrorBoundaryProvider>
        <div className="min-h-screen bg-background transition-colors duration-300">
          <header className="bg-background border-b border-border shadow-theme-sm">
            <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Brain className="w-8 h-8 text-primary" />
                  <h1 className="text-2xl font-bold text-foreground">MoralAI Guide</h1>
                </div>
                <ThemeToggle />
              </div>
            </div>
          </header>

          <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
            <Dashboard />
          </main>

          <footer className="bg-background border-t border-border mt-12">
            <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
              <p className="text-center text-muted-foreground">
                MoralAI Guide - AI-powered ethical guidance with comprehensive life tracking
              </p>
            </div>
          </footer>
        </div>
      </ErrorBoundaryProvider>
    </ThemeProvider>
  );
}

export default App;