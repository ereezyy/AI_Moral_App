import { describe, it, expect, vi } from 'vitest';
import { moralService } from '../moralService';
import { 
  mockEmotionalState, 
  mockSituationalContext 
} from '../../utils/testing/test-utils';

describe('MoralService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize successfully', async () => {
    const result = await moralService.initialize();
    expect(result).toBe(true);
  });

  it('should analyze moral context', async () => {
    const audioAnalysis = {
      sentiment: 0.7,
      toxicity: 0.1,
      emotionalTone: mockEmotionalState,
      volume: 0.8,
      clarity: 0.9
    };

    const videoAnalysis = {
      facialExpression: mockEmotionalState,
      attentiveness: 0.8,
      environmentalContext: ['indoor', 'well-lit']
    };

    const analysis = await moralService.analyzeMoralContext(
      audioAnalysis,
      videoAnalysis,
      mockSituationalContext,
      'Test input'
    );

    expect(analysis.ethicalAlignment).toBeGreaterThan(0);
    expect(analysis.ethicalAlignment).toBeLessThanOrEqual(1);
    expect(analysis.conflictingValues).toBeInstanceOf(Array);
    expect(analysis.recommendedActions).toBeInstanceOf(Array);
  });
});