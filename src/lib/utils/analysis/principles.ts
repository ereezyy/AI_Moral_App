import { SituationalContext, EmotionalState } from '@/types';
import { ETHICAL_PRINCIPLES } from '@/lib/constants/ethical-principles';

export function analyzeEthicalPrinciples(
  context: SituationalContext,
  emotional: EmotionalState
) {
  return ETHICAL_PRINCIPLES.map(({ id, weight }) => ({
    principle: id,
    relevance: calculatePrincipleRelevance(id, context, emotional, weight)
  }));
}

function calculatePrincipleRelevance(
  principle: string,
  context: SituationalContext,
  emotional: EmotionalState,
  baseWeight: number
): number {
  const contextFactor = getContextualFactor(principle, context);
  const emotionalFactor = getEmotionalFactor(principle, emotional);
  
  return Math.min(1, baseWeight * contextFactor * emotionalFactor);
}

function getContextualFactor(principle: string, context: SituationalContext): number {
  const factors = {
    autonomy: 1 - (context.socialContext.socialPressure * 0.5),
    justice: context.socialContext.numberOfPeople > 1 ? 1.2 : 0.8,
    care: context.location.riskLevel > 0.5 ? 1.3 : 1,
    utility: context.socialContext.numberOfPeople > 2 ? 1.4 : 1
  };

  return factors[principle as keyof typeof factors] || 1;
}

function getEmotionalFactor(principle: string, emotional: EmotionalState): number {
  const factors = {
    care: emotional.joy > 0.5 ? 1.3 : 1,
    justice: emotional.anger > 0.5 ? 1.2 : 1,
    beneficence: emotional.sadness > 0.5 ? 1.2 : 1,
    non_maleficence: emotional.fear > 0.5 ? 0.7 : 1
  };

  return factors[principle as keyof typeof factors] || 1;
}