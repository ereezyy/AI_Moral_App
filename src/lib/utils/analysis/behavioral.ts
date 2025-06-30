export interface BehavioralPattern {
  type: string;
  frequency: number;
  intensity: number;
  context: string[];
}

export function analyzeBehavioralPatterns(
  recentPatterns: BehavioralPattern[]
) {
  const consistency = calculatePatternConsistency(recentPatterns);
  const trends = identifyBehavioralTrends(recentPatterns);
  const riskFactors = assessBehavioralRisks(recentPatterns);

  return {
    consistency,
    trends,
    riskFactors,
    recommendations: generateBehavioralRecommendations(consistency, trends, riskFactors)
  };
}

function calculatePatternConsistency(patterns: BehavioralPattern[]): number {
  if (patterns.length === 0) return 1;

  const typeFrequency = patterns.reduce((acc, pattern) => {
    acc[pattern.type] = (acc[pattern.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const maxFrequency = Math.max(...Object.values(typeFrequency));
  return maxFrequency / patterns.length;
}

function identifyBehavioralTrends(
  patterns: BehavioralPattern[]
): Array<{ type: string; trend: 'increasing' | 'decreasing' | 'stable' }> {
  const trends = [];
  const typeGroups = groupPatternsByType(patterns);

  for (const [type, groupPatterns] of Object.entries(typeGroups)) {
    const trend = calculateTrend(groupPatterns);
    trends.push({ type, trend });
  }

  return trends;
}

function groupPatternsByType(patterns: BehavioralPattern[]) {
  return patterns.reduce((acc, pattern) => {
    if (!acc[pattern.type]) {
      acc[pattern.type] = [];
    }
    acc[pattern.type].push(pattern);
    return acc;
  }, {} as Record<string, BehavioralPattern[]>);
}

function calculateTrend(
  patterns: BehavioralPattern[]
): 'increasing' | 'decreasing' | 'stable' {
  if (patterns.length < 2) return 'stable';

  const intensities = patterns.map(p => p.intensity);
  const trend = intensities.slice(1).reduce(
    (acc, curr, idx) => acc + (curr - intensities[idx]),
    0
  ) / (intensities.length - 1);

  if (trend > 0.1) return 'increasing';
  if (trend < -0.1) return 'decreasing';
  return 'stable';
}

function assessBehavioralRisks(patterns: BehavioralPattern[]) {
  return {
    impulsivity: calculateImpulsivityRisk(patterns),
    inconsistency: calculateInconsistencyRisk(patterns),
    contextualMismatch: identifyContextualMismatches(patterns)
  };
}

function calculateImpulsivityRisk(patterns: BehavioralPattern[]): number {
  return patterns.reduce(
    (acc, pattern) => acc + (pattern.intensity * 0.7 + pattern.frequency * 0.3),
    0
  ) / (patterns.length || 1);
}

function calculateInconsistencyRisk(patterns: BehavioralPattern[]): number {
  const consistency = calculatePatternConsistency(patterns);
  return 1 - consistency;
}

function identifyContextualMismatches(
  patterns: BehavioralPattern[]
): Array<{ type: string; context: string }> {
  const mismatches = [];

  for (const pattern of patterns) {
    const inappropriateContexts = pattern.context.filter(
      ctx => !isContextAppropriate(pattern.type, ctx)
    );

    for (const ctx of inappropriateContexts) {
      mismatches.push({ type: pattern.type, context: ctx });
    }
  }

  return mismatches;
}

function isContextAppropriate(type: string, context: string): boolean {
  const appropriateContexts: Record<string, string[]> = {
    aggressive: ['competitive', 'sports'],
    passive: ['formal', 'professional'],
    social: ['public', 'social']
  };

  return appropriateContexts[type]?.includes(context) ?? true;
}

function generateBehavioralRecommendations(
  consistency: number,
  trends: ReturnType<typeof identifyBehavioralTrends>,
  risks: ReturnType<typeof assessBehavioralRisks>
): string[] {
  const recommendations = [];

  if (consistency < 0.5) {
    recommendations.push('Work on developing consistent behavioral patterns');
  }

  const increasingNegativeTrends = trends.filter(
    t => t.trend === 'increasing' && isNegativeBehavior(t.type)
  );

  if (increasingNegativeTrends.length > 0) {
    recommendations.push('Address increasing negative behavioral patterns');
  }

  if (risks.impulsivity > 0.7) {
    recommendations.push('Practice impulse control techniques');
  }

  return recommendations;
}

function isNegativeBehavior(type: string): boolean {
  const negativeBehaviors = ['aggressive', 'impulsive', 'avoidant'];
  return negativeBehaviors.includes(type);
}