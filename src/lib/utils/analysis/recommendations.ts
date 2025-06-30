import { SituationalContext, EmotionalState } from '@/types';

export function generateRecommendations(
  ethicalScore: number,
  principles: Array<{ principle: string; relevance: number }>,
  context: SituationalContext,
  emotional: EmotionalState,
  riskLevel: number,
  emotionalStability: number
): string[] {
  const recommendations = [];

  if (ethicalScore < 0.6) {
    recommendations.push('Reassess decision considering ethical principles');
  }

  if (emotionalStability < 0.5) {
    recommendations.push('Take time to process emotions before acting');
  }

  if (riskLevel > 0.6) {
    recommendations.push('Consider safer alternatives');
  }

  principles
    .filter(p => p.relevance > 0.7)
    .forEach(p => {
      recommendations.push(
        `Align action with ${p.principle.replace('_', ' ')} principle`
      );
    });

  return recommendations;
}