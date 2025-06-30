import { describe, it, expect } from 'vitest';
import { 
  validateEmotionalState,
  validateSituationalContext,
  validateMoralAnalysis
} from '../validation';
import type { 
  EmotionalState, 
  SituationalContext,
  MoralAnalysis 
} from '../../types';

describe('Validation Utils', () => {
  describe('validateEmotionalState', () => {
    it('should validate correct emotional state', () => {
      const validState: EmotionalState = {
        joy: 0.5,
        sadness: 0.2,
        anger: 0.1,
        fear: 0.1,
        surprise: 0.3,
        neutral: 0.4
      };
      expect(validateEmotionalState(validState)).toBe(true);
    });

    it('should reject invalid emotional state', () => {
      const invalidState = {
        joy: 0.5,
        sadness: 1.2, // Invalid value
        anger: 0.1
      };
      expect(validateEmotionalState(invalidState as EmotionalState)).toBe(false);
    });
  });

  describe('validateSituationalContext', () => {
    it('should validate correct situational context', () => {
      const validContext: SituationalContext = {
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
      expect(validateSituationalContext(validContext)).toBe(true);
    });

    it('should reject invalid situational context', () => {
      const invalidContext = {
        location: {
          type: 'workplace',
          riskLevel: 1.5 // Invalid value
        }
      };
      expect(validateSituationalContext(invalidContext as SituationalContext)).toBe(false);
    });
  });

  describe('validateMoralAnalysis', () => {
    it('should validate correct moral analysis', () => {
      const validAnalysis: MoralAnalysis = {
        ethicalAlignment: 0.8,
        conflictingValues: ['value1', 'value2'],
        potentialConsequences: {
          shortTerm: ['consequence1'],
          longTerm: ['consequence2']
        },
        recommendedActions: ['action1', 'action2'],
        moralPrinciples: [
          { principle: 'autonomy', relevance: 0.9 }
        ]
      };
      expect(validateMoralAnalysis(validAnalysis)).toBe(true);
    });

    it('should reject invalid moral analysis', () => {
      const invalidAnalysis = {
        ethicalAlignment: 1.5, // Invalid value
        conflictingValues: ['value1']
      };
      expect(validateMoralAnalysis(invalidAnalysis as MoralAnalysis)).toBe(false);
    });
  });
});