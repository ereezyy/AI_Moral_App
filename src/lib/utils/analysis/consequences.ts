import { SituationalContext } from '@/types';

export function getShortTermConsequences(
  context: SituationalContext,
  ethicalScore: number,
  riskLevel: number,
  socialComplexity: number
): string[] {
  const consequences = [];

  if (riskLevel > 0.5) {
    consequences.push('immediate_safety_concerns');
  }

  if (socialComplexity > 0.6) {
    consequences.push('immediate_social_dynamics');
  }

  if (ethicalScore < 0.6) {
    consequences.push('potential_trust_erosion');
  }

  return consequences;
}

export function getLongTermConsequences(
  context: SituationalContext,
  principles: Array<{ principle: string; relevance: number }>,
  environmentalScore: number
): string[] {
  const consequences = [];
  const highestPrinciple = principles.reduce((a, b) => 
    a.relevance > b.relevance ? a : b
  );

  consequences.push(`${highestPrinciple.principle}_development`);

  if (context.socialContext.socialPressure > 0.5) {
    consequences.push('relationship_pattern_formation');
  }

  if (environmentalScore < 0.5) {
    consequences.push('environmental_impact');
  }

  return consequences;
}