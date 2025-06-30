import type { SituationalContext, EmotionalState } from '@/types/analysis';
import { ETHICAL_PRINCIPLES } from '../constants/ethical-principles';

export function getContextualFactor(principle: string, context: SituationalContext): number {
  const factors = {
    autonomy: 1 - (context.socialContext.socialPressure * 0.5),
    justice: context.socialContext.numberOfPeople > 1 ? 1.2 : 0.8,
    care: context.location.riskLevel > 0.5 ? 1.3 : 1,
    utility: context.socialContext.numberOfPeople > 2 ? 1.4 : 1
  };

  return factors[principle as keyof typeof factors] || 1;
}

export function getEmotionalFactor(principle: string, emotional: EmotionalState): number {
  const factors = {
    care: 1 + (emotional.joy * 0.3),
    justice: 1 + (emotional.anger * 0.2),
    beneficence: 1 + (emotional.sadness * 0.2),
    non_maleficence: 1 - (emotional.fear * 0.3)
  };

  return factors[principle as keyof typeof factors] || 1;
}

export function calculatePrincipleRelevance(
  principle: string,
  context: SituationalContext,
  emotional: EmotionalState,
  baseWeight: number
): number {
  const contextualFactor = getContextualFactor(principle, context);
  const emotionalFactor = getEmotionalFactor(principle, emotional);
  
  return Math.min(1, baseWeight * contextualFactor * emotionalFactor);
}

export function analyzeEthicalPrinciples(
  context: SituationalContext,
  emotional: EmotionalState
) {
  return ETHICAL_PRINCIPLES.map(({ id, weight }) => ({
    principle: id,
    relevance: calculatePrincipleRelevance(id, context, emotional, weight)
  }));
}