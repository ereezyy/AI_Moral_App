import * as tf from '@tensorflow/tfjs';
import type { MoralAnalysis, SituationalContext, EmotionalState } from '@/types/analysis';

class EnhancedMoralAnalysisModel {
  private static instance: EnhancedMoralAnalysisModel;
  private model: tf.LayersModel | null = null;
  
  private readonly ethicalPrinciples = [
    { id: 'autonomy', weight: 0.9 },
    { id: 'beneficence', weight: 0.85 },
    { id: 'non_maleficence', weight: 0.8 },
    { id: 'justice', weight: 0.9 },
    { id: 'fidelity', weight: 0.75 },
    { id: 'utility', weight: 0.8 },
    { id: 'care', weight: 0.85 },
    { id: 'virtue', weight: 0.7 }
  ];

  private constructor() {}

  static getInstance(): EnhancedMoralAnalysisModel {
    if (!EnhancedMoralAnalysisModel.instance) {
      EnhancedMoralAnalysisModel.instance = new EnhancedMoralAnalysisModel();
    }
    return EnhancedMoralAnalysisModel.instance;
  }

  async analyzeContext(
    context: SituationalContext,
    emotionalState: EmotionalState,
    behavioralData: Float32Array,
    environmentalFactors: string[]
  ): Promise<MoralAnalysis> {
    const ethicalScore = this.calculateEnhancedEthicalScore(
      emotionalState,
      behavioralData,
      context,
      environmentalFactors
    );

    const principles = this.analyzeEthicalPrinciples(context, emotionalState);
    const conflicts = this.identifyEthicalConflicts(context, principles, emotionalState);
    const consequences = this.predictDetailedConsequences(context, ethicalScore, principles);

    return {
      ethicalAlignment: ethicalScore,
      conflictingValues: conflicts,
      potentialConsequences: consequences,
      recommendedActions: this.generateContextAwareRecommendations(
        ethicalScore,
        principles,
        consequences,
        context,
        emotionalState
      ),
      moralPrinciples: principles
    };
  }

  private calculateEnhancedEthicalScore(
    emotional: EmotionalState,
    behavioral: Float32Array,
    context: SituationalContext,
    environmental: string[]
  ): number {
    const emotionalScore = this.calculateEmotionalScore(emotional);
    const behavioralScore = this.calculateBehavioralScore(behavioral);
    const contextScore = this.calculateContextScore(context);
    const environmentalScore = this.calculateEnvironmentalScore(environmental);

    return (
      emotionalScore * 0.3 +
      behavioralScore * 0.3 +
      contextScore * 0.2 +
      environmentalScore * 0.2
    );
  }

  private calculateEmotionalScore(emotional: EmotionalState): number {
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

  private calculateBehavioralScore(behavioral: Float32Array): number {
    return Array.from(behavioral).reduce((acc, val) => acc + val, 0) / behavioral.length;
  }

  private calculateContextScore(context: SituationalContext): number {
    const socialPressureImpact = 1 - (context.socialContext.socialPressure * 0.5);
    const riskAdjustment = 1 - (context.location.riskLevel * 0.3);
    
    return (socialPressureImpact + riskAdjustment) / 2;
  }

  private calculateEnvironmentalScore(factors: string[]): number {
    const positiveFactors = ['well-lit', 'open-space', 'professional-setting'];
    const negativeFactors = ['crowded', 'noisy', 'high-stress'];

    const score = factors.reduce((acc, factor) => {
      if (positiveFactors.includes(factor)) return acc + 0.2;
      if (negativeFactors.includes(factor)) return acc - 0.1;
      return acc;
    }, 0.5);

    return Math.max(0, Math.min(1, score));
  }

  private analyzeEthicalPrinciples(
    context: SituationalContext,
    emotional: EmotionalState
  ) {
    return this.ethicalPrinciples.map(({ id, weight }) => ({
      principle: id,
      relevance: this.calculatePrincipleRelevance(id, context, emotional, weight)
    }));
  }

  private calculatePrincipleRelevance(
    principle: string,
    context: SituationalContext,
    emotional: EmotionalState,
    baseWeight: number
  ): number {
    const contextualFactor = this.getContextualFactor(principle, context);
    const emotionalFactor = this.getEmotionalFactor(principle, emotional);
    
    return Math.min(1, baseWeight * contextualFactor * emotionalFactor);
  }

  private getContextualFactor(principle: string, context: SituationalContext): number {
    const factors = {
      autonomy: 1 - (context.socialContext.socialPressure * 0.5),
      justice: context.socialContext.numberOfPeople > 1 ? 1.2 : 0.8,
      care: context.location.riskLevel > 0.5 ? 1.3 : 1,
      utility: context.socialContext.numberOfPeople > 2 ? 1.4 : 1
    };

    return factors[principle as keyof typeof factors] || 1;
  }

  private getEmotionalFactor(principle: string, emotional: EmotionalState): number {
    const factors = {
      care: 1 + (emotional.joy * 0.3),
      justice: 1 + (emotional.anger * 0.2),
      beneficence: 1 + (emotional.sadness * 0.2),
      non_maleficence: 1 - (emotional.fear * 0.3)
    };

    return factors[principle as keyof typeof factors] || 1;
  }

  private identifyEthicalConflicts(
    context: SituationalContext,
    principles: { principle: string; relevance: number }[],
    emotional: EmotionalState
  ): string[] {
    const conflicts: string[] = [];
    const highRelevancePrinciples = principles.filter(p => p.relevance > 0.7);

    if (context.socialContext.socialPressure > 0.6) {
      conflicts.push('individual_autonomy_vs_social_harmony');
    }

    if (emotional.anger > 0.5 || emotional.fear > 0.5) {
      conflicts.push('emotional_reaction_vs_rational_judgment');
    }

    if (highRelevancePrinciples.length >= 2) {
      conflicts.push(`${highRelevancePrinciples[0].principle}_vs_${highRelevancePrinciples[1].principle}`);
    }

    return conflicts;
  }

  private predictDetailedConsequences(
    context: SituationalContext,
    ethicalScore: number,
    principles: { principle: string; relevance: number }[]
  ) {
    return {
      shortTerm: this.getShortTermConsequences(context, ethicalScore),
      longTerm: this.getLongTermConsequences(context, principles)
    };
  }

  private getShortTermConsequences(context: SituationalContext, ethicalScore: number): string[] {
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

  private getLongTermConsequences(
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

  private generateContextAwareRecommendations(
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
}

export const enhancedMoralAnalysisModel = EnhancedMoralAnalysisModel.getInstance();