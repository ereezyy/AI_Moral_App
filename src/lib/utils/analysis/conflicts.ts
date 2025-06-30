import { SituationalContext } from '@/types';

export function identifyConflicts(
  context: SituationalContext,
  principles: Array<{ principle: string; relevance: number }>,
  riskLevel: number,
  socialComplexity: number
): string[] {
  const conflicts = [];

  if (riskLevel > 0.6) {
    conflicts.push('safety_vs_opportunity');
  }

  if (socialComplexity > 0.7) {
    conflicts.push('individual_autonomy_vs_social_harmony');
  }

  const highRelevancePrinciples = principles
    .filter(p => p.relevance > 0.7)
    .sort((a, b) => b.relevance - a.relevance);

  if (highRelevancePrinciples.length >= 2) {
    conflicts.push(
      `${highRelevancePrinciples[0].principle}_vs_${highRelevancePrinciples[1].principle}`
    );
  }

  return conflicts;
}