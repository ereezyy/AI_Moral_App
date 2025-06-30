import { describe, it, expect } from 'vitest';
import { generateContextAwareRecommendations } from '../recommendations';
import type { SituationalContext, EmotionalState } from '../../types';

describe('Recommendations Utils', () => {
  const mockContext: SituationalContext = {
    location: {
      type: 'workplace',
      description: 'office',
      riskLevel: 0.3
    },
    timeContext: {
      timeOfDay: 'morning',
      dayType: 'weekday',
      season: 'spring'
    },
    socialContext: {
      numberOfPeople: 3,
      relationshipTypes: ['colleague'],
      socialPressure: 0.7
    }
  };

  const mockEmotional: EmotionalState = {
    joy: 0.3,
    sadness: 0.2,
    anger: 0.5,
    fear: 0.4,
    surprise: 0.1,
    neutral: 0.2
  };

  it('should generate appropriate recommendations', () => {
    const recommendations = generateContextAwareRecommendations(
      0.5,
      [{ principle: 'autonomy', relevance: 0.8 }],
      { shortTerm: ['immediate_impact'], longTerm: ['reputation_effect'] },
      mockContext,
      mockEmotional
    );

    expect(recommendations).toBeInstanceOf(Array);
    expect(recommendations.length).toBeGreaterThan(0);
    expect(recommendations).toContain('Reassess decision considering ethical principles');
    expect(recommendations).toContain('Take time to process emotions before acting');
    expect(recommendations).toContain('Consider seeking external perspective');
  });
});