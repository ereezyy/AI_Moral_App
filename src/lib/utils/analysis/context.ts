import type { SituationalContext } from '../../types';

export function analyzeContext(context: SituationalContext) {
  const riskFactors = calculateRiskFactors(context);
  const socialDynamics = analyzeSocialDynamics(context);
  const environmentalImpact = assessEnvironmentalImpact(context);

  return {
    riskLevel: calculateOverallRisk(riskFactors),
    socialComplexity: socialDynamics.complexity,
    environmentalScore: environmentalImpact.score,
    recommendations: generateContextRecommendations(riskFactors, socialDynamics, environmentalImpact)
  };
}

function calculateRiskFactors(context: SituationalContext) {
  return {
    locationRisk: context.location.riskLevel,
    socialPressure: context.socialContext.socialPressure,
    timeBasedRisk: calculateTimeBasedRisk(context.timeContext)
  };
}

function analyzeSocialDynamics(context: SituationalContext) {
  const { numberOfPeople, relationshipTypes, socialPressure } = context.socialContext;
  
  return {
    complexity: calculateSocialComplexity(numberOfPeople, relationshipTypes),
    pressureLevel: socialPressure,
    relationshipDynamics: analyzeRelationships(relationshipTypes)
  };
}

function assessEnvironmentalImpact(context: SituationalContext) {
  return {
    score: calculateEnvironmentalScore(context),
    factors: identifyEnvironmentalFactors(context),
    constraints: determineConstraints(context)
  };
}

// Helper functions
function calculateTimeBasedRisk(timeContext: SituationalContext['timeContext']): number {
  const timeFactors = {
    night: 0.3,
    evening: 0.2,
    afternoon: 0.1,
    morning: 0.1
  };

  return timeFactors[timeContext.timeOfDay as keyof typeof timeFactors] || 0.1;
}

function calculateSocialComplexity(
  numberOfPeople: number,
  relationshipTypes: string[]
): number {
  return Math.min(1, (numberOfPeople * 0.2) + (relationshipTypes.length * 0.1));
}

function analyzeRelationships(relationshipTypes: string[]) {
  const weights = {
    family: 0.8,
    friend: 0.6,
    colleague: 0.5,
    stranger: 0.2
  };

  return relationshipTypes.reduce((acc, type) => 
    acc + (weights[type as keyof typeof weights] || 0.1), 0) / relationshipTypes.length;
}

function calculateEnvironmentalScore(context: SituationalContext): number {
  const locationFactor = context.location.type === 'public' ? 0.7 : 0.5;
  const riskAdjustment = 1 - (context.location.riskLevel * 0.5);
  
  return (locationFactor + riskAdjustment) / 2;
}

function identifyEnvironmentalFactors(context: SituationalContext): string[] {
  const factors = [];
  
  if (context.location.type === 'workplace') {
    factors.push('professional_setting');
  }
  
  if (context.socialContext.numberOfPeople > 5) {
    factors.push('crowded_environment');
  }
  
  return factors;
}

function determineConstraints(context: SituationalContext) {
  return {
    timeConstraints: context.timeContext.dayType === 'weekday',
    spatialConstraints: context.location.type === 'restricted',
    socialConstraints: context.socialContext.socialPressure > 0.6
  };
}

function calculateOverallRisk(riskFactors: ReturnType<typeof calculateRiskFactors>): number {
  const weights = {
    locationRisk: 0.4,
    socialPressure: 0.4,
    timeBasedRisk: 0.2
  };

  return Object.entries(riskFactors).reduce((acc, [key, value]) => 
    acc + (value * weights[key as keyof typeof weights]), 0);
}

function generateContextRecommendations(
  riskFactors: ReturnType<typeof calculateRiskFactors>,
  socialDynamics: ReturnType<typeof analyzeSocialDynamics>,
  environmentalImpact: ReturnType<typeof assessEnvironmentalImpact>
): string[] {
  const recommendations = [];

  if (riskFactors.locationRisk > 0.6) {
    recommendations.push('Consider changing location or timing');
  }

  if (socialDynamics.pressureLevel > 0.7) {
    recommendations.push('Evaluate social pressure impact');
  }

  if (environmentalImpact.score < 0.4) {
    recommendations.push('Assess environmental constraints');
  }

  return recommendations;
}