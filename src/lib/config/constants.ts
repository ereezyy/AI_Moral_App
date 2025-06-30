export const APP_CONFIG = {
  maxLogEntries: 1000,
  audioAnalysis: {
    fftSize: 2048,
    minDecibels: -90,
    maxDecibels: -10,
    smoothingTimeConstant: 0.85
  },
  videoAnalysis: {
    frameRate: 30,
    width: 640,
    height: 480
  },
  moralAnalysis: {
    toxicityThreshold: 0.7,
    confidenceThreshold: 0.8,
    updateInterval: 1000
  }
} as const;

export const ENVIRONMENT = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  apiUrl: import.meta.env.VITE_API_URL
} as const;