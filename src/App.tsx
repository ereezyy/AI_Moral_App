import React from 'react';
import { Brain, Sparkles } from 'lucide-react';
import { Dashboard } from './components/Dashboard';
import { ErrorBoundaryProvider } from './lib/providers';

function App() {
  return (
    <ErrorBoundaryProvider>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-2">
              <Brain className="w-8 h-8 text-indigo-600" />
              <h1 className="text-2xl font-bold text-gray-900">MoralAI Guide</h1>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <Dashboard />
        </main>

        <footer className="bg-white mt-12">
          <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
            <p className="text-center text-gray-500">
              MoralAI Guide - AI-powered ethical guidance with comprehensive life tracking
            </p>
          </div>
        </footer>
      </div>
    </ErrorBoundaryProvider>
  );
}

export default App;