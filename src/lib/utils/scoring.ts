import type { EmotionalState, SituationalContext } from '@/types/analysis';

export function calculateEmotionalScore(emotional: EmotionalState): number {
  const weights = {
    joy: 0.2,
    sadness: -0.1,
    anger: -0.2,
    fear: -0.1,
    surprise: 0.1,
    neutral: 0.1
  };

  return Object.entries(emotional).reduce((score, [emotion, value]) => {
    return score + (value * (weights[emotion as keyof typeof weights] || 0));
  }, 0.5);
}

export function calculateBehavioralScore(behavioral: Float32Array): number {
  return Array.from(behavioral).reduce((acc, val) => acc + val, 0) / behavioral.length;
}

export function calculateContextScore(context: SituationalContext): number {
  const socialPressureImpact = 1 - (context.socialContext.socialPressure * 0.5);
  const riskAdjustment = 1 - (context.location.riskLevel * 0.3);
  
  return (socialPressureImpact + riskAdjustment) / 2;
}

export function calculateEnvironmentalScore(factors: string[]): number {
  const positiveFactors = ['well-lit', 'open-space', 'professional-setting'];
  const negativeFactors = ['crowded', 'noisy', 'high-stress'];

  const score = factors.reduce((acc, factor) => {
    if (positiveFactors.includes(factor)) return acc + 0.2;
    if (negativeFactors.includes(factor)) return acc - 0.1;
    return acc;
  }, 0.5);

  return Math.max(0, Math.min(1, score));
}