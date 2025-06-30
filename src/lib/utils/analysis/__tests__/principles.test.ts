import { describe, it, expect } from 'vitest';
import { analyzeEthicalPrinciples } from '../principles';
import { mockEmotionalState, mockSituationalContext } from '../../testing/test-utils';

describe('Ethical Principles Analysis', () => {
  it('should analyze principles based on context and emotions', () => {
    const principles = analyzeEthicalPrinciples(
      mockSituationalContext,
      mockEmotionalState
    );

    expect(principles).toBeInstanceOf(Array);
    expect(principles.length).toBeGreaterThan(0);
    principles.forEach(p => {
      expect(p).toHaveProperty('principle');
      expect(p).toHaveProperty('relevance');
      expect(p.relevance).toBeGreaterThan(0);
      expect(p.relevance).toBeLessThanOrEqual(1);
    });
  });
});