import { BaseService } from './baseService';
import { toxicityModel } from '../models';
import { 
  calculateEmotionalScore,
  calculateContextScore,
  getShortTermConsequences,
  getLongTermConsequences,
  generateContextAwareRecommendations,
  analyzeEthicalPrinciples
} from '../utils';
import type { 
  MoralAnalysis, 
  AudioAnalysis, 
  VideoAnalysis, 
  SituationalContext 
} from '../types';

export class MoralService extends BaseService {
  protected serviceName = 'MoralService';

  async initialize(): Promise<boolean> {
    try {
      await toxicityModel.initialize();
      return true;
    } catch (error) {
      this.logError(error, 'initialization failed');
      return false;
    }
  }

  async analyzeMoralContext(
    audioAnalysis: AudioAnalysis,
    videoAnalysis: VideoAnalysis,
    situationalContext: SituationalContext,
    userInput: string
  ): Promise<MoralAnalysis> {
    const toxicityResults = await toxicityModel.analyze(userInput);
    const ethicalScore = this.calculateEthicalScore(
      audioAnalysis,
      videoAnalysis,
      situationalContext,
      toxicityResults
    );

    const principles = analyzeEthicalPrinciples(
      situationalContext,
      audioAnalysis.emotionalTone
    );

    return {
      ethicalAlignment: ethicalScore,
      conflictingValues: this.identifyConflictingValues(situationalContext),
      potentialConsequences: {
        shortTerm: getShortTermConsequences(situationalContext, ethicalScore),
        longTerm: getLongTermConsequences(situationalContext, principles)
      },
      recommendedActions: generateContextAwareRecommendations(
        ethicalScore,
        principles,
        { 
          shortTerm: getShortTermConsequences(situationalContext, ethicalScore),
          longTerm: getLongTermConsequences(situationalContext, principles)
        },
        situationalContext,
        audioAnalysis.emotionalTone
      ),
      moralPrinciples: principles
    };
  }

  private calculateEthicalScore(
    audio: AudioAnalysis,
    video: VideoAnalysis,
    context: SituationalContext,
    toxicity: any
  ): number {
    const emotionalScore = calculateEmotionalScore(audio.emotionalTone);
    const contextScore = calculateContextScore(context);
    const toxicityScore = 1 - (toxicity?.toxicity || 0);

    return (emotionalScore * 0.3) + (contextScore * 0.4) + (toxicityScore * 0.3);
  }

  private identifyConflictingValues(context: SituationalContext): string[] {
    const conflicts = [];

    if (context.socialContext.socialPressure > 0.6) {
      conflicts.push('individual_autonomy_vs_social_harmony');
    }

    if (context.location.riskLevel > 0.5) {
      conflicts.push('safety_vs_opportunity');
    }

    return conflicts;
  }
}

export const moralService = new MoralService();