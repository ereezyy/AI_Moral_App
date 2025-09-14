import { useState, useEffect, useCallback } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
}

export function useTheme() {
  const [themeState, setThemeState] = useState<ThemeState>({
    theme: 'system',
    resolvedTheme: 'light'
  });

  // Get system preference
  const getSystemTheme = useCallback((): 'light' | 'dark' => {
    if (typeof window === 'undefined') return 'light';
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }, []);

  // Resolve theme based on current setting
  const resolveTheme = useCallback((theme: Theme): 'light' | 'dark' => {
    return theme === 'system' ? getSystemTheme() : theme;
  }, [getSystemTheme]);

  // Apply theme to document
  const applyTheme = useCallback((resolvedTheme: 'light' | 'dark') => {
    const root = document.documentElement;
    
    // Remove existing theme classes
    root.classList.remove('light', 'dark');
    
    // Add new theme class
    root.classList.add(resolvedTheme);
    
    // Update data attribute for CSS targeting
    root.setAttribute('data-theme', resolvedTheme);
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute(
        'content', 
        resolvedTheme === 'dark' ? '#1f2937' : '#ffffff'
      );
    }
  }, []);

  // Set theme
  const setTheme = useCallback((newTheme: Theme) => {
    const resolved = resolveTheme(newTheme);
    
    setThemeState({
      theme: newTheme,
      resolvedTheme: resolved
    });
    
    applyTheme(resolved);
    
    // Persist to localStorage
    try {
      localStorage.setItem('theme-preference', newTheme);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
    }
  }, [resolveTheme, applyTheme]);

  // Toggle between light/dark (skips system)
  const toggleTheme = useCallback(() => {
    const newTheme = themeState.resolvedTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  }, [themeState.resolvedTheme, setTheme]);

  // Initialize theme on mount
  useEffect(() => {
    let savedTheme: Theme = 'system';
    
    // Load saved preference
    try {
      const saved = localStorage.getItem('theme-preference') as Theme;
      if (saved && ['light', 'dark', 'system'].includes(saved)) {
        savedTheme = saved;
      }
    } catch (error) {
      console.warn('Failed to load theme preference:', error);
    }
    
    const resolved = resolveTheme(savedTheme);
    
    setThemeState({
      theme: savedTheme,
      resolvedTheme: resolved
    });
    
    applyTheme(resolved);
  }, [resolveTheme, applyTheme]);

  // Listen for system theme changes
  useEffect(() => {
    if (themeState.theme !== 'system') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      const newResolved = e.matches ? 'dark' : 'light';
      setThemeState(prev => ({
        ...prev,
        resolvedTheme: newResolved
      }));
      applyTheme(newResolved);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [themeState.theme, applyTheme]);

  return {
    theme: themeState.theme,
    resolvedTheme: themeState.resolvedTheme,
    setTheme,
    toggleTheme,
    systemTheme: getSystemTheme()
  };
}