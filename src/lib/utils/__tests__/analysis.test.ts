import { describe, it, expect } from 'vitest';
import { 
  getContextualFactor,
  getEmotionalFactor,
  calculatePrincipleRelevance,
  analyzeEthicalPrinciples
} from '../analysis';
import type { SituationalContext, EmotionalState } from '../../types';

describe('Analysis Utils', () => {
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
      socialPressure: 0.4
    }
  };

  const mockEmotional: EmotionalState = {
    joy: 0.6,
    sadness: 0.2,
    anger: 0.1,
    fear: 0.1,
    surprise: 0.3,
    neutral: 0.4
  };

  describe('getContextualFactor', () => {
    it('should return correct factor for autonomy', () => {
      const factor = getContextualFactor('autonomy', mockContext);
      expect(factor).toBeGreaterThan(0);
      expect(factor).toBeLessThanOrEqual(1);
    });
  });

  describe('getEmotionalFactor', () => {
    it('should return correct factor for care', () => {
      const factor = getEmotionalFactor('care', mockEmotional);
      expect(factor).toBeGreaterThan(1);
    });
  });

  describe('calculatePrincipleRelevance', () => {
    it('should calculate correct principle relevance', () => {
      const relevance = calculatePrincipleRelevance(
        'autonomy',
        mockContext,
        mockEmotional,
        0.9
      );
      expect(relevance).toBeGreaterThan(0);
      expect(relevance).toBeLessThanOrEqual(1);
    });
  });

  describe('analyzeEthicalPrinciples', () => {
    it('should analyze all ethical principles', () => {
      const analysis = analyzeEthicalPrinciples(mockContext, mockEmotional);
      expect(analysis).toBeInstanceOf(Array);
      expect(analysis.length).toBeGreaterThan(0);
      analysis.forEach(item => {
        expect(item).toHaveProperty('principle');
        expect(item).toHaveProperty('relevance');
        expect(item.relevance).toBeGreaterThan(0);
        expect(item.relevance).toBeLessThanOrEqual(1);
      });
    });
  });
});