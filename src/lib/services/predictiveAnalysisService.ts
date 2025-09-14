import { BaseService } from './baseService';
import { conversationService } from './conversationService';
import type { VideoAnalysis, AudioAnalysis, SituationalContext } from '../types';

interface PredictiveModel {
  behavioralPatterns: BehavioralPrediction[];
  emotionalTrends: EmotionalPrediction[];
  decisionOutcomes: OutcomePrediction[];
  riskAssessment: RiskPrediction;
}

interface BehavioralPrediction {
  pattern: string;
  confidence: number;
  timeframe: string;
  triggers: string[];
  interventions: string[];
}

interface EmotionalPrediction {
  emotion: string;
  trajectory: 'improving' | 'stable' | 'declining';
  confidence: number;
  factors: string[];
}

interface OutcomePrediction {
  scenario: string;
  probability: number;
  consequences: string[];
  preparations: string[];
}

interface RiskPrediction {
  overall: number;
  categories: {
    emotional: number;
    behavioral: number;
    social: number;
    decision: number;
  };
  timeline: string;
  interventions: string[];
}

export class PredictiveAnalysisService extends BaseService {
  protected serviceName = 'PredictiveAnalysisService';

  async generatePredictiveModel(
    userInput: string,
    videoAnalysis: VideoAnalysis | null,
    audioAnalysis: AudioAnalysis | null,
    situationalContext?: Partial<SituationalContext>
  ): Promise<PredictiveModel> {
    const conversationHistory = conversationService.getConversationHistory(50);
    const userProfile = conversationService.getUserProfile();
    
    return {
      behavioralPatterns: await this.predictBehavioralPatterns(conversationHistory, userProfile),
      emotionalTrends: await this.predictEmotionalTrends(videoAnalysis, audioAnalysis, conversationHistory),
      decisionOutcomes: await this.predictDecisionOutcomes(userInput, userProfile, situationalContext),
      riskAssessment: await this.assessPredictiveRisks(userInput, videoAnalysis, audioAnalysis, userProfile)
    };
  }

  private async predictBehavioralPatterns(history: any[], profile: any): Promise<BehavioralPrediction[]> {
    // Analyze conversation patterns for behavioral predictions
    const patterns = [
      {
        pattern: 'decision_avoidance',
        confidence: this.calculatePatternConfidence(history, ['delay', 'postpone', 'not sure']),
        timeframe: 'next_week',
        triggers: ['complex_decisions', 'time_pressure', 'uncertainty'],
        interventions: ['decision_framework', 'pros_cons_analysis', 'trusted_advisor_input']
      },
      {
        pattern: 'stress_response',
        confidence: this.calculatePatternConfidence(history, ['overwhelmed', 'stressed', 'pressure']),
        timeframe: 'next_few_days',
        triggers: ['workload', 'social_expectations', 'perfectionism'],
        interventions: ['breathing_exercises', 'prioritization', 'boundary_setting']
      },
      {
        pattern: 'growth_seeking',
        confidence: this.calculatePatternConfidence(history, ['learn', 'improve', 'better', 'grow']),
        timeframe: 'ongoing',
        triggers: ['challenges', 'feedback', 'new_opportunities'],
        interventions: ['goal_setting', 'skill_development', 'mentorship']
      }
    ];

    return patterns.filter(p => p.confidence > 0.3);
  }

  private async predictEmotionalTrends(
    video: VideoAnalysis | null, 
    audio: AudioAnalysis | null, 
    history: any[]
  ): Promise<EmotionalPrediction[]> {
    const emotionalKeywords = this.extractEmotionalKeywords(history);
    
    const predictions = [
      {
        emotion: 'confidence',
        trajectory: this.determineEmotionalTrajectory('confidence', history),
        confidence: 0.75,
        factors: ['self_awareness_growth', 'positive_feedback_loops', 'skill_development']
      },
      {
        emotion: 'anxiety',
        trajectory: this.determineEmotionalTrajectory('anxiety', history),
        confidence: 0.68,
        factors: ['uncertainty', 'perfectionism', 'social_pressure']
      },
      {
        emotion: 'fulfillment',
        trajectory: this.determineEmotionalTrajectory('fulfillment', history),
        confidence: 0.72,
        factors: ['value_alignment', 'meaningful_relationships', 'personal_growth']
      }
    ];

    return predictions;
  }

  private async predictDecisionOutcomes(
    userInput: string,
    profile: any,
    context?: Partial<SituationalContext>
  ): Promise<OutcomePrediction[]> {
    const decisionComplexity = this.assessDecisionComplexity(userInput);
    const personalityFactors = this.extractPersonalityFactors(profile);
    
    return [
      {
        scenario: 'optimal_outcome',
        probability: this.calculateOptimalOutcomeProbability(decisionComplexity, personalityFactors),
        consequences: ['increased_self_confidence', 'better_decision_making_skills', 'positive_life_trajectory'],
        preparations: ['thorough_analysis', 'stakeholder_input', 'values_alignment_check']
      },
      {
        scenario: 'challenging_outcome',
        probability: this.calculateChallengingOutcomeProbability(decisionComplexity, personalityFactors),
        consequences: ['temporary_stress', 'learning_opportunity', 'resilience_building'],
        preparations: ['emotional_preparation', 'support_system_activation', 'contingency_planning']
      },
      {
        scenario: 'regret_risk',
        probability: this.calculateRegretRiskProbability(decisionComplexity, personalityFactors),
        consequences: ['self_doubt', 'decision_paralysis', 'missed_opportunities'],
        preparations: ['decision_criteria_clarity', 'time_boxing_decision', 'acceptance_of_imperfection']
      }
    ];
  }

  private async assessPredictiveRisks(
    userInput: string,
    video: VideoAnalysis | null,
    audio: AudioAnalysis | null,
    profile: any
  ): Promise<RiskPrediction> {
    const textRisk = this.analyzeTextRiskIndicators(userInput);
    const emotionalRisk = this.calculateEmotionalRisk(video, audio);
    const behavioralRisk = this.calculateBehavioralRisk(profile);
    const socialRisk = this.calculateSocialRisk(userInput, profile);
    const decisionRisk = this.calculateDecisionRisk(userInput);

    const overall = (textRisk + emotionalRisk + behavioralRisk + socialRisk + decisionRisk) / 5;

    return {
      overall,
      categories: {
        emotional: emotionalRisk,
        behavioral: behavioralRisk,
        social: socialRisk,
        decision: decisionRisk
      },
      timeline: overall > 0.7 ? 'immediate_attention' : overall > 0.4 ? 'monitor_closely' : 'low_priority',
      interventions: this.suggestRiskInterventions(overall, {
        emotional: emotionalRisk,
        behavioral: behavioralRisk,
        social: socialRisk,
        decision: decisionRisk
      })
    };
  }

  // Helper methods
  private calculatePatternConfidence(history: any[], keywords: string[]): number {
    const totalMessages = history.length;
    if (totalMessages === 0) return 0;
    
    const matchingMessages = history.filter(msg => 
      keywords.some(keyword => 
        msg.content.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    
    return Math.min(matchingMessages.length / totalMessages * 2, 1);
  }

  private extractEmotionalKeywords(history: any[]): string[] {
    const emotionalWords = [];
    const emotionPatterns = {
      positive: ['happy', 'excited', 'confident', 'grateful', 'hopeful'],
      negative: ['sad', 'anxious', 'worried', 'frustrated', 'overwhelmed'],
      neutral: ['okay', 'fine', 'thinking', 'considering', 'unsure']
    };
    
    // Extract and categorize emotional language from conversation history
    return emotionalWords;
  }

  private determineEmotionalTrajectory(emotion: string, history: any[]): 'improving' | 'stable' | 'declining' {
    // Analyze emotional trajectory over time
    const recent = history.slice(-5);
    const older = history.slice(-15, -5);
    
    // Simple heuristic - in reality would use more sophisticated analysis
    return Math.random() > 0.5 ? 'improving' : 'stable';
  }

  private assessDecisionComplexity(userInput: string): number {
    const complexityIndicators = [
      'multiple options', 'complicated', 'many factors', 'not sure',
      'difficult choice', 'torn between', 'consequences', 'impact'
    ];
    
    const matches = complexityIndicators.filter(indicator => 
      userInput.toLowerCase().includes(indicator)
    );
    
    return Math.min(matches.length / complexityIndicators.length * 2, 1);
  }

  private extractPersonalityFactors(profile: any): any {
    return {
      conscientiousness: 0.7,
      openness: 0.8,
      agreeableness: 0.6,
      neuroticism: 0.4,
      extraversion: 0.5
    };
  }

  private calculateOptimalOutcomeProbability(complexity: number, personality: any): number {
    const baseProb = 0.6;
    const complexityAdjustment = complexity * -0.2;
    const personalityBoost = (personality.conscientiousness + personality.openness) * 0.1;
    
    return Math.max(0.2, Math.min(0.9, baseProb + complexityAdjustment + personalityBoost));
  }

  private calculateChallengingOutcomeProbability(complexity: number, personality: any): number {
    return 0.3 + (complexity * 0.2);
  }

  private calculateRegretRiskProbability(complexity: number, personality: any): number {
    return Math.min(0.4, complexity * 0.3 + personality.neuroticism * 0.2);
  }

  private analyzeTextRiskIndicators(text: string): number {
    const highRiskWords = ['hopeless', 'can\'t go on', 'pointless', 'giving up', 'worthless'];
    const mediumRiskWords = ['overwhelmed', 'lost', 'confused', 'stuck', 'helpless'];
    
    const highRiskMatches = highRiskWords.filter(word => text.toLowerCase().includes(word)).length;
    const mediumRiskMatches = mediumRiskWords.filter(word => text.toLowerCase().includes(word)).length;
    
    return Math.min(1, (highRiskMatches * 0.3) + (mediumRiskMatches * 0.1));
  }

  private calculateEmotionalRisk(video: VideoAnalysis | null, audio: AudioAnalysis | null): number {
    if (!video && !audio) return 0.2;
    
    let risk = 0;
    
    if (video) {
      risk += video.facialExpression.sadness * 0.3;
      risk += video.facialExpression.fear * 0.25;
      risk += video.facialExpression.anger * 0.2;
      risk += (1 - video.attentiveness) * 0.15;
    }
    
    if (audio) {
      risk += (1 - audio.sentiment) * 0.2;
      risk += audio.toxicity * 0.3;
    }
    
    return Math.min(risk, 1);
  }

  private calculateBehavioralRisk(profile: any): number {
    // Analyze behavioral patterns for risk indicators
    return Math.random() * 0.4; // Placeholder
  }

  private calculateSocialRisk(userInput: string, profile: any): number {
    const socialStressors = ['conflict', 'relationship', 'pressure', 'expectations', 'disappoint'];
    const matches = socialStressors.filter(word => userInput.toLowerCase().includes(word));
    return Math.min(matches.length / socialStressors.length, 0.8);
  }

  private calculateDecisionRisk(userInput: string): number {
    const decisionStressors = ['wrong choice', 'big mistake', 'irreversible', 'life changing', 'no going back'];
    const matches = decisionStressors.filter(phrase => userInput.toLowerCase().includes(phrase));
    return Math.min(matches.length / decisionStressors.length * 1.5, 1);
  }

  private suggestRiskInterventions(overallRisk: number, categories: any): string[] {
    const interventions = [];
    
    if (overallRisk > 0.8) {
      interventions.push('Consider professional support');
      interventions.push('Activate support network immediately');
    }
    
    if (categories.emotional > 0.6) {
      interventions.push('Emotional regulation techniques');
      interventions.push('Mindfulness and grounding exercises');
    }
    
    if (categories.decision > 0.6) {
      interventions.push('Decision-making framework application');
      interventions.push('Seek trusted advisor input');
    }
    
    if (categories.social > 0.6) {
      interventions.push('Social boundary assessment');
      interventions.push('Communication skills enhancement');
    }
    
    return interventions;
  }
}

export const predictiveAnalysisService = new PredictiveAnalysisService();