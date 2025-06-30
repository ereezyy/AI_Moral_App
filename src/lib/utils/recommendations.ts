import type { SituationalContext, EmotionalState } from '@/types/analysis';

export function generateContextAwareRecommendations(
  ethicalScore: number,
  principles: { principle: string; relevance: number }[],
  consequences: { shortTerm: string[]; longTerm: string[] },
  context: SituationalContext,
  emotional: EmotionalState
): string[] {
  const recommendations: string[] = [];

  // Core recommendations based on ethical score
  if (ethicalScore < 0.6) {
    recommendations.push('Reassess decision considering ethical principles');
  }

  // Emotional state recommendations
  if (emotional.anger > 0.4 || emotional.fear > 0.4) {
    recommendations.push('Take time to process emotions before acting');
  }

  // Context-specific recommendations
  if (context.socialContext.socialPressure > 0.6) {
    recommendations.push('Consider seeking external perspective');
  }

  // Principle-based recommendations
  principles
    .filter(p => p.relevance > 0.7)
    .forEach(p => {
      recommendations.push(`Align action with ${p.principle.replace('_', ' ')} principle`);
    });

  // Consequence-aware recommendations
  if (consequences.longTerm.length > 0) {
    recommendations.push('Consider long-term impact on relationships and reputation');
  }

  return recommendations;
}