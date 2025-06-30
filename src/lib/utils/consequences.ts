import type { SituationalContext } from '@/types/analysis';

export function getShortTermConsequences(
  context: SituationalContext, 
  ethicalScore: number
): string[] {
  const consequences = [];

  if (context.socialContext.numberOfPeople > 1) {
    consequences.push('immediate_social_dynamics');
  }

  if (ethicalScore < 0.6) {
    consequences.push('potential_trust_erosion');
  }

  if (context.location.riskLevel > 0.5) {
    consequences.push('immediate_safety_concerns');
  }

  return consequences;
}

export function getLongTermConsequences(
  context: SituationalContext,
  principles: { principle: string; relevance: number }[]
): string[] {
  const consequences = [];
  const highestPrinciple = principles.reduce((a, b) => 
    a.relevance > b.relevance ? a : b
  );

  consequences.push(`${highestPrinciple.principle}_development`);

  if (context.socialContext.socialPressure > 0.5) {
    consequences.push('relationship_pattern_formation');
  }

  if (context.location.type === 'workplace') {
    consequences.push('professional_reputation_impact');
  }

  return consequences;
}