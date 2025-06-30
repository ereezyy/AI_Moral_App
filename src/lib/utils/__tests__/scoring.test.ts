import { describe, it, expect } from 'vitest';
import { 
  calculateEmotionalScore, 
  calculateBehavioralScore,
  calculateContextScore,
  calculateEnvironmentalScore 
} from '../scoring';
import type { EmotionalState, SituationalContext } from '../../types';

describe('Scoring Utils', () => {
  describe('calculateEmotionalScore', () => {
    it('should calculate correct emotional score', () => {
      const emotional: EmotionalState = {
        joy: 0.8,
        sadness: 0.2,
        anger: 0.1,
        fear: 0.1,
        surprise: 0.3,
        neutral: 0.4
      };

      const score = calculateEmotionalScore(emotional);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(1);
    });
  });

  describe('calculateBehavioralScore', () => {
    it('should calculate correct behavioral score', () => {
      const behavioral = new Float32Array([0.5, 0.7, 0.3]);
      const score = calculateBehavioralScore(behavioral);
      expect(score).toBe(0.5);
    });
  });

  describe('calculateContextScore', () => {
    it('should calculate correct context score', () => {
      const context: SituationalContext = {
        location: {
          type: 'workplace',
          description: 'office',
          riskLevel: 0.2
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

      const score = calculateContextScore(context);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(1);
    });
  });

  describe('calculateEnvironmentalScore', () => {
    it('should calculate correct environmental score', () => {
      const factors = ['well-lit', 'crowded', 'professional-setting'];
      const score = calculateEnvironmentalScore(factors);
      expect(score).toBeGreaterThan(0);
      expect(score).toBeLessThanOrEqual(1);
    });
  });
});