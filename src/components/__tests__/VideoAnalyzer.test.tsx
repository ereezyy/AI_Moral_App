import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '../lib/utils/testing/test-utils';
import { VideoAnalyzer } from '../VideoAnalyzer';

describe('VideoAnalyzer', () => {
  const mockOnAnalysis = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders video element', () => {
    render(<VideoAnalyzer onAnalysis={mockOnAnalysis} />);
    
    const videoElement = screen.getByRole('video');
    expect(videoElement).toBeInTheDocument();
  });

  it('shows error message when camera access fails', async () => {
    vi.spyOn(navigator.mediaDevices, 'getUserMedia')
      .mockRejectedValueOnce(new Error('Camera access denied'));

    render(<VideoAnalyzer onAnalysis={mockOnAnalysis} />);
    
    const errorMessage = await screen.findByText('Failed to access camera');
    expect(errorMessage).toBeInTheDocument();
  });
});