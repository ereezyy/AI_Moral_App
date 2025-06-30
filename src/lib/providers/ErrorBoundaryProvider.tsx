import React from 'react';
import { ErrorBoundary } from '../utils/error';

interface Props {
  children: React.ReactNode;
}

export function ErrorBoundaryProvider({ children }: Props) {
  return (
    <ErrorBoundary
      fallback={
        <div className="p-4 bg-red-50 text-red-700 rounded-lg">
          <h2 className="text-lg font-semibold mb-2">Something went wrong</h2>
          <p className="text-sm">Please try refreshing the page</p>
        </div>
      }
    >
      {children}
    </ErrorBoundary>
  );
}