import type { 
  EmotionalState, 
  SituationalContext,
  MoralAnalysis
} from '../types';

export function validateEmotionalState(state: EmotionalState): boolean {
  const requiredEmotions = ['joy', 'sadness', 'anger', 'fear', 'surprise', 'neutral'];
  const hasAllEmotions = requiredEmotions.every(emotion => 
    typeof state[emotion as keyof EmotionalState] === 'number'
  );
  
  const valuesInRange = Object.values(state).every(value => 
    value >= 0 && value <= 1
  );

  return hasAllEmotions && valuesInRange;
}

export function validateSituationalContext(context: SituationalContext): boolean {
  const { location, timeContext, socialContext } = context;

  const validLocation = location && 
    typeof location.type === 'string' &&
    typeof location.description === 'string' &&
    typeof location.riskLevel === 'number' &&
    location.riskLevel >= 0 &&
    location.riskLevel <= 1;

  const validTimeContext = timeContext &&
    typeof timeContext.timeOfDay === 'string' &&
    ['weekday', 'weekend'].includes(timeContext.dayType) &&
    typeof timeContext.season === 'string';

  const validSocialContext = socialContext &&
    typeof socialContext.numberOfPeople === 'number' &&
    Array.isArray(socialContext.relationshipTypes) &&
    typeof socialContext.socialPressure === 'number' &&
    socialContext.socialPressure >= 0 &&
    socialContext.socialPressure <= 1;

  return validLocation && validTimeContext && validSocialContext;
}

export function validateMoralAnalysis(analysis: MoralAnalysis): boolean {
  const validEthicalAlignment = typeof analysis.ethicalAlignment === 'number' &&
    analysis.ethicalAlignment >= 0 &&
    analysis.ethicalAlignment <= 1;

  const validConflictingValues = Array.isArray(analysis.conflictingValues) &&
    analysis.conflictingValues.every(value => typeof value === 'string');

  const validConsequences = analysis.potentialConsequences &&
    Array.isArray(analysis.potentialConsequences.shortTerm) &&
    Array.isArray(analysis.potentialConsequences.longTerm);

  const validRecommendations = Array.isArray(analysis.recommendedActions) &&
    analysis.recommendedActions.every(action => typeof action === 'string');

  const validPrinciples = Array.isArray(analysis.moralPrinciples) &&
    analysis.moralPrinciples.every(p => 
      typeof p.principle === 'string' &&
      typeof p.relevance === 'number' &&
      p.relevance >= 0 &&
      p.relevance <= 1
    );

  return validEthicalAlignment && 
    validConflictingValues && 
    validConsequences && 
    validRecommendations && 
    validPrinciples;
}