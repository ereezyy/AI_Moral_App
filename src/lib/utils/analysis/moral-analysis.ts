import { MoralAnalysis, AudioAnalysis, VideoAnalysis, SituationalContext } from '../../types';
import { analyzeContext } from './context';
import { analyzeEmotionalState } from './emotional';
import { analyzeBehavioralPatterns } from './behavioral';
import { Profiler } from '../performance';
import { logger } from '../logger';
import { ETHICAL_PRINCIPLES } from '../../constants/ethical-principles';
import { calculateEmotionalBalance } from './scoring';
import { identifyConflicts } from './conflicts';
import { getShortTermConsequences, getLongTermConsequences } from './consequences';
import { generateRecommendations } from './recommendations';

export async function analyzeMoralContext(
  audioAnalysis: AudioAnalysis,
  videoAnalysis: VideoAnalysis,
  situationalContext: SituationalContext,
  userInput: string
): Promise<MoralAnalysis> {
  return await Profiler.profileAsync('moral-analysis', async () => {
    try {
      // Analyze context and emotional state
      const contextAnalysis = analyzeContext(situationalContext);
      const emotionalAnalysis = analyzeEmotionalState(audioAnalysis.emotionalTone);
      
      // Analyze behavioral patterns
      const behavioralAnalysis = analyzeBehavioralPatterns([
        {
          type: 'current',
          frequency: 1,
          intensity: videoAnalysis.attentiveness,
          context: videoAnalysis.environmentalContext
        }
      ]);

      // Calculate core metrics
      const ethicalScore = calculateEthicalScore(
        contextAnalysis,
        emotionalAnalysis,
        behavioralAnalysis
      );

      const emotionalBalance = calculateEmotionalBalance(audioAnalysis.emotionalTone);

      // Analyze principles and generate insights
      const principles = analyzeEthicalPrinciples(
        situationalContext,
        audioAnalysis.emotionalTone
      );

      const conflicts = identifyConflicts(
        situationalContext,
        principles,
        contextAnalysis.riskLevel,
        contextAnalysis.socialComplexity
      );

      // Generate consequences and recommendations
      const shortTermConsequences = getShortTermConsequences(
        situationalContext,
        ethicalScore,
        contextAnalysis.riskLevel,
        contextAnalysis.socialComplexity
      );

      const longTermConsequences = getLongTermConsequences(
        situationalContext,
        principles,
        contextAnalysis.environmentalScore
      );

      const recommendations = generateRecommendations(
        ethicalScore,
        principles,
        situationalContext,
        audioAnalysis.emotionalTone,
        contextAnalysis.riskLevel,
        emotionalAnalysis.stability
      );

      return {
        ethicalAlignment: ethicalScore,
        conflictingValues: conflicts,
        potentialConsequences: {
          shortTerm: shortTermConsequences,
          longTerm: longTermConsequences
        },
        recommendedActions: recommendations,
        moralPrinciples: principles
      };
    } catch (error) {
      logger.error('Failed to analyze moral context', { error });
      throw error;
    }
  });
}

function calculateEthicalScore(
  context: ReturnType<typeof analyzeContext>,
  emotional: ReturnType<typeof analyzeEmotionalState>,
  behavioral: ReturnType<typeof analyzeBehavioralPatterns>
): number {
  const weights = {
    contextRisk: 0.3,
    emotionalBalance: 0.3,
    behavioralConsistency: 0.4
  };

  return (
    (1 - context.riskLevel) * weights.contextRisk +
    emotional.balance * weights.emotionalBalance +
    behavioral.consistency * weights.behavioralConsistency
  );
}

function analyzeEthicalPrinciples(
  context: SituationalContext,
  emotional: ReturnType<typeof analyzeEmotionalState>['dominant']
) {
  return ETHICAL_PRINCIPLES.map(({ id, weight }) => ({
    principle: id,
    relevance: calculatePrincipleRelevance(id, context, emotional, weight)
  }));
}

function calculatePrincipleRelevance(
  principle: string,
  context: SituationalContext,
  emotional: ReturnType<typeof analyzeEmotionalState>['dominant'],
  baseWeight: number
): number {
  const contextFactor = getContextualFactor(principle, context);
  const emotionalFactor = getEmotionalFactor(principle, emotional);
  
  return Math.min(1, baseWeight * contextFactor * emotionalFactor);
}

function getContextualFactor(principle: string, context: SituationalContext): number {
  const factors = {
    autonomy: 1 - (context.socialContext.socialPressure * 0.5),
    justice: context.socialContext.numberOfPeople > 1 ? 1.2 : 0.8,
    care: context.location.riskLevel > 0.5 ? 1.3 : 1,
    utility: context.socialContext.numberOfPeople > 2 ? 1.4 : 1
  };

  return factors[principle as keyof typeof factors] || 1;
}

function getEmotionalFactor(
  principle: string,
  emotional: ReturnType<typeof analyzeEmotionalState>['dominant']
): number {
  const factors = {
    care: emotional.emotion === 'joy' ? 1.3 : 1,
    justice: emotional.emotion === 'anger' ? 1.2 : 1,
    beneficence: emotional.emotion === 'sadness' ? 1.2 : 1,
    non_maleficence: emotional.emotion === 'fear' ? 0.7 : 1
  };

  return factors[principle as keyof typeof factors] || 1;
}