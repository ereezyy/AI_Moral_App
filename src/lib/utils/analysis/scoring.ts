import { EmotionalState } from '@/types';

export function calculateEthicalScore(
  contextRisk: number,
  emotionalBalance: number,
  behavioralConsistency: number
): number {
  const weights = {
    contextRisk: 0.3,
    emotionalBalance: 0.3,
    behavioralConsistency: 0.4
  };

  return (
    (1 - contextRisk) * weights.contextRisk +
    emotionalBalance * weights.emotionalBalance +
    behavioralConsistency * weights.behavioralConsistency
  );
}

export function calculateEmotionalBalance(emotional: EmotionalState): number {
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