import React, { useState } from 'react';
import { Sun, Moon, Monitor, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeContext } from './ThemeProvider';

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme, toggleTheme } = useThemeContext();
  const [isOpen, setIsOpen] = useState(false);

  const themeOptions = [
    {
      value: 'light' as const,
      label: 'Light',
      icon: <Sun className="w-4 h-4" />,
      description: 'Light theme'
    },
    {
      value: 'dark' as const,
      label: 'Dark', 
      icon: <Moon className="w-4 h-4" />,
      description: 'Dark theme'
    },
    {
      value: 'system' as const,
      label: 'System',
      icon: <Monitor className="w-4 h-4" />,
      description: 'Follow system preference'
    }
  ];

  const currentOption = themeOptions.find(option => option.value === theme);

  return (
    <div className="relative">
      {/* Quick toggle button (for header/navbar) */}
      <button
        onClick={toggleTheme}
        className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        aria-label={`Switch to ${resolvedTheme === 'light' ? 'dark' : 'light'} mode`}
        title={`Currently ${resolvedTheme} mode. Click to toggle.`}
      >
        <motion.div
          initial={false}
          animate={{ 
            rotate: resolvedTheme === 'dark' ? 180 : 0,
            scale: [1, 0.8, 1]
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          {resolvedTheme === 'light' ? (
            <Sun className="w-5 h-5" />
          ) : (
            <Moon className="w-5 h-5" />
          )}
        </motion.div>
      </button>

      {/* Advanced dropdown (for settings) */}
      <div className="absolute top-full right-0 mt-2 hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Theme options"
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {currentOption?.icon}
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {currentOption?.label}
          </span>
          <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute top-full right-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-xl z-50"
            >
              <div className="p-1">
                {themeOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => {
                      setTheme(option.value);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-inset ${
                      theme === option.value
                        ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                    }`}
                    role="menuitem"
                  >
                    <span className={theme === option.value ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'}>
                      {option.icon}
                    </span>
                    <div className="flex-1 text-left">
                      <div className="font-medium">{option.label}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {option.description}
                      </div>
                    </div>
                    {theme === option.value && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-indigo-600 dark:bg-indigo-400 rounded-full"
                      />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}