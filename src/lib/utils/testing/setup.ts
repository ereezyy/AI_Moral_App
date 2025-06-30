import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock browser APIs
global.navigator.mediaDevices = {
  getUserMedia: vi.fn().mockResolvedValue({
    getTracks: () => [{
      stop: vi.fn()
    }]
  })
} as any;

global.navigator.geolocation = {
  getCurrentPosition: vi.fn().mockImplementation((success) => 
    success({
      coords: {
        latitude: 40.7128,
        longitude: -74.0060
      }
    })
  )
} as any;

// Mock WebGL context for TensorFlow.js
HTMLCanvasElement.prototype.getContext = vi.fn(() => ({
  getImageData: vi.fn(),
  putImageData: vi.fn(),
  drawImage: vi.fn(),
  scale: vi.fn(),
  translate: vi.fn()
})) as any;

// Mock AudioContext
global.AudioContext = vi.fn().mockImplementation(() => ({
  createAnalyser: vi.fn().mockReturnValue({
    connect: vi.fn(),
    disconnect: vi.fn(),
    frequencyBinCount: 1024,
    getByteFrequencyData: vi.fn()
  }),
  createMediaStreamSource: vi.fn().mockReturnValue({
    connect: vi.fn()
  }),
  close: vi.fn()
})) as any;