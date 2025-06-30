import { describe, it, expect } from 'vitest';
import { 
  getShortTermConsequences,
  getLongTermConsequences
} from '../consequences';
import type { SituationalContext } from '../../types';

describe('Consequences Utils', () => {
  const mockContext: SituationalContext = {
    location: {
      type: 'workplace',
      description: 'office',
      riskLevel: 0.6
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

  describe('getShortTermConsequences', () => {
    it('should identify immediate consequences', () => {
      const consequences = getShortTermConsequences(mockContext, 0.5);
      expect(consequences).toBeInstanceOf(Array);
      expect(consequences).toContain('immediate_social_dynamics');
      expect(consequences).toContain('immediate_safety_concerns');
    });
  });

  describe('getLongTermConsequences', () => {
    it('should identify long-term consequences', () => {
      const principles = [
        { principle: 'autonomy', relevance: 0.8 },
        { principle: 'justice', relevance: 0.9 }
      ];
      
      const consequences = getLongTermConsequences(mockContext, principles);
      expect(consequences).toBeInstanceOf(Array);
      expect(consequences).toContain('justice_development');
      expect(consequences).toContain('relationship_pattern_formation');
      expect(consequences).toContain('professional_reputation_impact');
    });
  });
});