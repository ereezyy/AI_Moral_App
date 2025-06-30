import { describe, it, expect } from 'vitest';
import { analyzeMoralContext } from '../moral-analysis';
import { mockEmotionalState, mockSituationalContext } from '../../testing/test-utils';

describe('Moral Analysis', () => {
  const mockAudioAnalysis = {
    sentiment: 0.7,
    toxicity: 0.1,
    emotionalTone: mockEmotionalState,
    volume: 0.8,
    clarity: 0.9
  };

  const mockVideoAnalysis = {
    facialExpression: mockEmotionalState,
    attentiveness: 0.8,
    environmentalContext: ['indoor', 'well-lit']
  };

  it('should analyze moral context comprehensively', async () => {
    const analysis = await analyzeMoralContext(
      mockAudioAnalysis,
      mockVideoAnalysis,
      mockSituationalContext,
      'Test input'
    );

    expect(analysis).toMatchObject({
      ethicalAlignment: expect.any(Number),
      conflictingValues: expect.any(Array),
      potentialConsequences: {
        shortTerm: expect.any(Array),
        longTerm: expect.any(Array)
      },
      recommendedActions: expect.any(Array),
      moralPrinciples: expect.any(Array)
    });

    expect(analysis.ethicalAlignment).toBeGreaterThan(0);
    expect(analysis.ethicalAlignment).toBeLessThanOrEqual(1);
  });

  it('should identify conflicts in high-risk situations', async () => {
    const highRiskContext = {
      ...mockSituationalContext,
      location: {
        ...mockSituationalContext.location,
        riskLevel: 0.8
      }
    };

    const analysis = await analyzeMoralContext(
      mockAudioAnalysis,
      mockVideoAnalysis,
      highRiskContext,
      'Test input'
    );

    expect(analysis.conflictingValues).toContain('safety_vs_opportunity');
  });

  it('should generate appropriate recommendations for emotional situations', async () => {
    const emotionalAnalysis = await analyzeMoralContext(
      {
        ...mockAudioAnalysis,
        emotionalTone: {
          ...mockEmotionalState,
          anger: 0.8,
          joy: 0.1
        }
      },
      mockVideoAnalysis,
      mockSituationalContext,
      'Test input'
    );

    expect(emotionalAnalysis.recommendedActions).toContain(
      'Take time to process emotions before acting'
    );
  });

  it('should analyze ethical principles correctly', async () => {
    const analysis = await analyzeMoralContext(
      mockAudioAnalysis,
      mockVideoAnalysis,
      mockSituationalContext,
      'Test input'
    );

    analysis.moralPrinciples.forEach(principle => {
      expect(principle).toHaveProperty('principle');
      expect(principle).toHaveProperty('relevance');
      expect(principle.relevance).toBeGreaterThan(0);
      expect(principle.relevance).toBeLessThanOrEqual(1);
    });
  });
});