import type { EmotionalState } from '../../types';

export function analyzeEmotionalState(emotional: EmotionalState) {
  const dominantEmotion = findDominantEmotion(emotional);
  const emotionalBalance = calculateEmotionalBalance(emotional);
  const stabilityScore = assessEmotionalStability(emotional);

  return {
    dominant: dominantEmotion,
    balance: emotionalBalance,
    stability: stabilityScore,
    recommendations: generateEmotionalRecommendations(emotional, stabilityScore)
  };
}

function findDominantEmotion(emotional: EmotionalState): {
  emotion: keyof EmotionalState;
  intensity: number;
} {
  return Object.entries(emotional).reduce(
    (max, [emotion, value]) => 
      value > max.intensity 
        ? { emotion: emotion as keyof EmotionalState, intensity: value }
        : max,
    { emotion: 'neutral' as keyof EmotionalState, intensity: -1 }
  );
}

function calculateEmotionalBalance(emotional: EmotionalState): number {
  const positiveEmotions = ['joy', 'surprise'];
  const negativeEmotions = ['sadness', 'anger', 'fear'];

  const positiveScore = positiveEmotions.reduce(
    (acc, emotion) => acc + (emotional[emotion as keyof EmotionalState] || 0),
    0
  );

  const negativeScore = negativeEmotions.reduce(
    (acc, emotion) => acc + (emotional[emotion as keyof EmotionalState] || 0),
    0
  );

  return (positiveScore - negativeScore + 1) / 2;
}

function assessEmotionalStability(emotional: EmotionalState): number {
  const neutralWeight = 0.4;
  const varianceWeight = 0.6;

  const neutralScore = emotional.neutral;
  const emotionalVariance = calculateEmotionalVariance(emotional);

  return (neutralScore * neutralWeight) + 
    ((1 - emotionalVariance) * varianceWeight);
}

function calculateEmotionalVariance(emotional: EmotionalState): number {
  const values = Object.values(emotional);
  const mean = values.reduce((acc, val) => acc + val, 0) / values.length;
  
  const variance = values.reduce(
    (acc, val) => acc + Math.pow(val - mean, 2),
    0
  ) / values.length;

  return Math.min(1, variance * 4);
}

function generateEmotionalRecommendations(
  emotional: EmotionalState,
  stabilityScore: number
): string[] {
  const recommendations = [];

  if (emotional.anger > 0.6) {
    recommendations.push('Take time to calm down before making decisions');
  }

  if (emotional.fear > 0.5) {
    recommendations.push('Address underlying concerns and anxieties');
  }

  if (stabilityScore < 0.4) {
    recommendations.push('Consider emotional regulation techniques');
  }

  return recommendations;
}