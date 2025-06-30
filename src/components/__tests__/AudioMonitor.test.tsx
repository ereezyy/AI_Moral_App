import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '../lib/utils/testing/test-utils';
import { AudioMonitor } from '../AudioMonitor';
import { useAudioMonitoring } from '../lib/hooks/useAudioMonitoring';

vi.mock('../lib/hooks/useAudioMonitoring');

describe('AudioMonitor', () => {
  beforeEach(() => {
    vi.mocked(useAudioMonitoring).mockReturnValue({
      isMonitoring: false,
      error: null,
      currentAnalysis: null,
      startMonitoring: vi.fn(),
      stopMonitoring: vi.fn()
    });
  });

  it('renders start monitoring button when not monitoring', () => {
    render(<AudioMonitor />);
    
    const startButton = screen.getByText('Start Monitoring');
    expect(startButton).toBeInTheDocument();
  });

  it('shows error message when error occurs', () => {
    vi.mocked(useAudioMonitoring).mockReturnValue({
      isMonitoring: false,
      error: 'Failed to access microphone',
      currentAnalysis: null,
      startMonitoring: vi.fn(),
      stopMonitoring: vi.fn()
    });

    render(<AudioMonitor />);
    
    const errorMessage = screen.getByText('Failed to access microphone');
    expect(errorMessage).toBeInTheDocument();
  });

  it('displays audio analysis when monitoring', () => {
    vi.mocked(useAudioMonitoring).mockReturnValue({
      isMonitoring: true,
      error: null,
      currentAnalysis: {
        volume: 0.8,
        clarity: 0.9,
        sentiment: 0.7,
        toxicity: 0.1,
        emotionalTone: {
          joy: 0.6,
          sadness: 0.1,
          anger: 0.1,
          fear: 0.1,
          surprise: 0.2,
          neutral: 0.3
        }
      },
      startMonitoring: vi.fn(),
      stopMonitoring: vi.fn()
    });

    render(<AudioMonitor />);
    
    expect(screen.getByText('80%')).toBeInTheDocument(); // Volume
    expect(screen.getByText('90%')).toBeInTheDocument(); // Clarity
  });
});