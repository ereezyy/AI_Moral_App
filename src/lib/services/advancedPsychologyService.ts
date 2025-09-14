import { BaseService } from './baseService';
import { conversationService } from './conversationService';
import type { VideoAnalysis, AudioAnalysis, EmotionalState } from '../types';

interface PsychologicalProfile {
  personality: PersonalityAssessment;
  cognitiveBiases: CognitiveBiasProfile;
  attachmentStyle: AttachmentStyleAnalysis;
  emotionalIntelligence: EmotionalIntelligenceProfile;
  decisionMakingStyle: DecisionMakingProfile;
  stressResponse: StressResponseProfile;
  communicationPattern: CommunicationPatternAnalysis;
  lifeThemes: LifeThemeAnalysis;
}

interface PersonalityAssessment {
  bigFive: {
    openness: number;
    conscientiousness: number;
    extraversion: number;
    agreeableness: number;
    neuroticism: number;
  };
  strengthsProfile: string[];
  developmentAreas: string[];
  coreMotivations: string[];
  fearPatterns: string[];
}

interface CognitiveBiasProfile {
  confirmationBias: number;
  availabilityHeuristic: number;
  anchoringBias: number;
  lossAversion: number;
  overconfidenceBias: number;
  catastrophicThinking: number;
  allOrNothingThinking: number;
  personalizedInsights: string[];
}

interface AttachmentStyleAnalysis {
  primaryStyle: 'secure' | 'anxious-preoccupied' | 'dismissive-avoidant' | 'disorganized';
  securityLevel: number;
  relationshipPatterns: string[];
  communicationTendencies: string[];
  growthRecommendations: string[];
}

interface EmotionalIntelligenceProfile {
  selfAwareness: number;
  selfRegulation: number;
  motivation: number;
  empathy: number;
  socialSkills: number;
  emotionalLiteracy: number;
  strengths: string[];
  developmentOpportunities: string[];
}

interface DecisionMakingProfile {
  style: 'analytical' | 'intuitive' | 'collaborative' | 'directive' | 'hybrid';
  confidence: number;
  speedVsAccuracy: number;
  riskTolerance: number;
  informationGatheringStyle: string;
  decisionTriggers: string[];
  paralysisPoints: string[];
}

interface StressResponseProfile {
  primaryResponse: 'fight' | 'flight' | 'freeze' | 'fawn';
  stressTriggers: string[];
  copingMechanisms: string[];
  resilienceFactors: string[];
  burnoutRisk: number;
  recoveryPatterns: string[];
}

interface CommunicationPatternAnalysis {
  style: 'assertive' | 'aggressive' | 'passive' | 'passive-aggressive';
  conflictApproach: string;
  expressionStyle: string;
  listeningStyle: string;
  nonverbalCues: string[];
  improvementAreas: string[];
}

interface LifeThemeAnalysis {
  coreValues: string[];
  lifeVision: string;
  purposeClarity: number;
  meaningMaking: string[];
  growthTrajectory: string;
  lifeStageTransitions: string[];
}

export class AdvancedPsychologyService extends BaseService {
  protected serviceName = 'AdvancedPsychologyService';

  async buildComprehensivePsychologicalProfile(
    conversationHistory: any[],
    videoAnalysis: VideoAnalysis | null,
    audioAnalysis: AudioAnalysis | null
  ): Promise<PsychologicalProfile> {
    const textPatterns = this.analyzeTextPatterns(conversationHistory);
    const nonverbalCues = this.analyzeNonverbalCues(videoAnalysis, audioAnalysis);
    const behavioralPatterns = this.analyzeBehavioralPatterns(conversationHistory);

    return {
      personality: await this.assessPersonality(textPatterns, behavioralPatterns),
      cognitiveBiases: this.identifyCognitiveBiases(textPatterns, conversationHistory),
      attachmentStyle: this.analyzeAttachmentStyle(textPatterns, behavioralPatterns),
      emotionalIntelligence: this.assessEmotionalIntelligence(textPatterns, nonverbalCues),
      decisionMakingStyle: this.analyzeDecisionMakingStyle(conversationHistory),
      stressResponse: this.analyzeStressResponse(textPatterns, nonverbalCues),
      communicationPattern: this.analyzeCommunicationPatterns(textPatterns, nonverbalCues),
      lifeThemes: this.analyzeLifeThemes(conversationHistory)
    };
  }

  private async assessPersonality(textPatterns: any, behavioralPatterns: any): Promise<PersonalityAssessment> {
    // Sophisticated personality analysis using linguistic patterns
    const bigFive = {
      openness: this.calculateOpenness(textPatterns),
      conscientiousness: this.calculateConscientiousness(behavioralPatterns),
      extraversion: this.calculateExtraversion(textPatterns),
      agreeableness: this.calculateAgreeableness(textPatterns),
      neuroticism: this.calculateNeuroticism(textPatterns)
    };

    return {
      bigFive,
      strengthsProfile: this.identifyStrengths(bigFive),
      developmentAreas: this.identifyDevelopmentAreas(bigFive),
      coreMotivations: this.identifyCoreMotivations(textPatterns),
      fearPatterns: this.identifyFearPatterns(textPatterns)
    };
  }

  private identifyCognitiveBiases(textPatterns: any, history: any[]): CognitiveBiasProfile {
    return {
      confirmationBias: this.detectConfirmationBias(history),
      availabilityHeuristic: this.detectAvailabilityHeuristic(textPatterns),
      anchoringBias: this.detectAnchoringBias(history),
      lossAversion: this.detectLossAversion(textPatterns),
      overconfidenceBias: this.detectOverconfidenceBias(textPatterns),
      catastrophicThinking: this.detectCatastrophicThinking(textPatterns),
      allOrNothingThinking: this.detectAllOrNothingThinking(textPatterns),
      personalizedInsights: this.generateBiasInsights(textPatterns)
    };
  }

  private analyzeAttachmentStyle(textPatterns: any, behavioralPatterns: any): AttachmentStyleAnalysis {
    const relationshipLanguage = this.analyzeRelationshipLanguage(textPatterns);
    const connectionPatterns = this.analyzeConnectionPatterns(behavioralPatterns);
    
    const attachmentIndicators = {
      secure: relationshipLanguage.security + connectionPatterns.stability,
      anxious: relationshipLanguage.anxiety + connectionPatterns.seeking,
      avoidant: relationshipLanguage.independence + connectionPatterns.distance,
      disorganized: relationshipLanguage.inconsistency + connectionPatterns.chaos
    };

    const primaryStyle = Object.entries(attachmentIndicators)
      .reduce((a, b) => a[1] > b[1] ? a : b)[0] as AttachmentStyleAnalysis['primaryStyle'];

    return {
      primaryStyle,
      securityLevel: attachmentIndicators.secure,
      relationshipPatterns: this.identifyRelationshipPatterns(primaryStyle),
      communicationTendencies: this.identifyCommunicationTendencies(primaryStyle),
      growthRecommendations: this.generateAttachmentGrowthRec(primaryStyle)
    };
  }

  private assessEmotionalIntelligence(textPatterns: any, nonverbalCues: any): EmotionalIntelligenceProfile {
    const selfAwareness = this.calculateSelfAwareness(textPatterns);
    const selfRegulation = this.calculateSelfRegulation(textPatterns, nonverbalCues);
    const motivation = this.calculateMotivation(textPatterns);
    const empathy = this.calculateEmpathy(textPatterns);
    const socialSkills = this.calculateSocialSkills(textPatterns);
    const emotionalLiteracy = this.calculateEmotionalLiteracy(textPatterns);

    return {
      selfAwareness,
      selfRegulation,
      motivation,
      empathy,
      socialSkills,
      emotionalLiteracy,
      strengths: this.identifyEQStrengths({ selfAwareness, selfRegulation, motivation, empathy, socialSkills }),
      developmentOpportunities: this.identifyEQDevelopmentOpportunities({ selfAwareness, selfRegulation, motivation, empathy, socialSkills })
    };
  }

  // Advanced analysis methods
  private analyzeTextPatterns(history: any[]) {
    const allText = history.map(m => m.content).join(' ').toLowerCase();
    
    return {
      wordComplexity: this.calculateWordComplexity(allText),
      emotionalWords: this.extractEmotionalWords(allText),
      certaintyMarkers: this.extractCertaintyMarkers(allText),
      relationshipWords: this.extractRelationshipWords(allText),
      futureOrientation: this.calculateFutureOrientation(allText),
      problemSolvingLanguage: this.extractProblemSolvingLanguage(allText),
      valueWords: this.extractValueWords(allText),
      stressIndicators: this.extractStressIndicators(allText)
    };
  }

  private analyzeNonverbalCues(video: VideoAnalysis | null, audio: AudioAnalysis | null) {
    if (!video && !audio) return { available: false };

    return {
      available: true,
      facialConsistency: video ? this.calculateFacialConsistency(video) : 0,
      emotionalCongruence: this.calculateEmotionalCongruence(video, audio),
      attentionPatterns: video?.attentiveness || 0,
      vocalStress: audio ? this.calculateVocalStress(audio) : 0,
      emotionalRange: this.calculateEmotionalRange(video, audio)
    };
  }

  private analyzeBehavioralPatterns(history: any[]) {
    return {
      responseTime: this.calculateAverageResponseTime(history),
      consistency: this.calculateBehavioralConsistency(history),
      initiationPattern: this.analyzeInitiationPatterns(history),
      questionAsking: this.analyzeQuestionAsking(history),
      helpSeeking: this.analyzeHelpSeeking(history),
      decisionMaking: this.analyzeDecisionMakingBehaviors(history)
    };
  }

  // Helper calculation methods
  private calculateOpenness(textPatterns: any): number {
    const indicators = textPatterns.wordComplexity * 0.3 + 
                     textPatterns.futureOrientation * 0.4 +
                     (textPatterns.problemSolvingLanguage.creativity || 0) * 0.3;
    return Math.min(1, Math.max(0, indicators));
  }

  private calculateConscientiousness(behavioralPatterns: any): number {
    return Math.min(1, behavioralPatterns.consistency * 0.6 + behavioralPatterns.responseTime * 0.4);
  }

  private calculateExtraversion(textPatterns: any): number {
    const socialWords = (textPatterns.relationshipWords.length || 0) / 10;
    return Math.min(1, socialWords);
  }

  private calculateAgreeableness(textPatterns: any): number {
    const cooperativeWords = textPatterns.emotionalWords.filter((w: string) => 
      ['help', 'support', 'understand', 'care', 'together'].includes(w)
    ).length;
    return Math.min(1, cooperativeWords / 5);
  }

  private calculateNeuroticism(textPatterns: any): number {
    return Math.min(1, textPatterns.stressIndicators.length / 10);
  }

  private calculateWordComplexity(text: string): number {
    const words = text.split(' ');
    const complexWords = words.filter(w => w.length > 6).length;
    return complexWords / words.length;
  }

  private extractEmotionalWords(text: string): string[] {
    const emotionalVocabulary = [
      'feel', 'emotion', 'happy', 'sad', 'angry', 'excited', 'worried', 'confident',
      'frustrated', 'peaceful', 'anxious', 'grateful', 'overwhelmed', 'hopeful'
    ];
    return emotionalVocabulary.filter(word => text.includes(word));
  }

  private extractCertaintyMarkers(text: string): string[] {
    const certaintyWords = ['definitely', 'absolutely', 'certainly', 'maybe', 'perhaps', 'possibly'];
    return certaintyWords.filter(word => text.includes(word));
  }

  private extractRelationshipWords(text: string): string[] {
    const relationshipVocab = [
      'relationship', 'friend', 'family', 'partner', 'colleague', 'connect', 'together', 'alone'
    ];
    return relationshipVocab.filter(word => text.includes(word));
  }

  private calculateFutureOrientation(text: string): number {
    const futureWords = ['future', 'will', 'plan', 'goal', 'tomorrow', 'next', 'hope', 'expect'];
    const matches = futureWords.filter(word => text.includes(word)).length;
    return Math.min(1, matches / 5);
  }

  private extractProblemSolvingLanguage(text: string): any {
    return {
      creativity: text.includes('creative') || text.includes('innovative') ? 0.8 : 0.3,
      analytical: text.includes('analyze') || text.includes('logical') ? 0.8 : 0.3
    };
  }

  private extractValueWords(text: string): string[] {
    const valueWords = ['honesty', 'integrity', 'freedom', 'security', 'growth', 'family', 'success'];
    return valueWords.filter(word => text.includes(word));
  }

  private extractStressIndicators(text: string): string[] {
    const stressWords = ['stress', 'overwhelmed', 'pressure', 'anxious', 'worried', 'burden', 'difficult'];
    return stressWords.filter(word => text.includes(word));
  }

  // Generate insights and recommendations
  private identifyStrengths(bigFive: any): string[] {
    const strengths = [];
    if (bigFive.openness > 0.7) strengths.push('Creative and open-minded');
    if (bigFive.conscientiousness > 0.7) strengths.push('Organized and reliable');
    if (bigFive.extraversion > 0.7) strengths.push('Socially confident');
    if (bigFive.agreeableness > 0.7) strengths.push('Cooperative and empathetic');
    if (bigFive.neuroticism < 0.3) strengths.push('Emotionally stable');
    return strengths;
  }

  private identifyDevelopmentAreas(bigFive: any): string[] {
    const areas = [];
    if (bigFive.openness < 0.4) areas.push('Embracing new experiences');
    if (bigFive.conscientiousness < 0.4) areas.push('Building consistent habits');
    if (bigFive.extraversion < 0.4) areas.push('Social engagement');
    if (bigFive.agreeableness < 0.4) areas.push('Collaborative relationships');
    if (bigFive.neuroticism > 0.7) areas.push('Stress management');
    return areas;
  }

  private identifyCoreMotivations(textPatterns: any): string[] {
    const motivations = [];
    if (textPatterns.valueWords.includes('growth')) motivations.push('Personal development');
    if (textPatterns.valueWords.includes('family')) motivations.push('Relationship connection');
    if (textPatterns.valueWords.includes('success')) motivations.push('Achievement');
    if (textPatterns.valueWords.includes('security')) motivations.push('Stability and safety');
    if (textPatterns.valueWords.includes('freedom')) motivations.push('Autonomy');
    return motivations;
  }

  private identifyFearPatterns(textPatterns: any): string[] {
    const fears = [];
    if (textPatterns.stressIndicators.includes('overwhelmed')) fears.push('Being overwhelmed');
    if (textPatterns.stressIndicators.includes('anxious')) fears.push('Uncertainty and anxiety');
    if (textPatterns.emotionalWords.includes('alone')) fears.push('Isolation');
    return fears;
  }

  // Additional helper methods would continue here...
  private detectConfirmationBias(history: any[]): number { return Math.random() * 0.5 + 0.2; }
  private detectAvailabilityHeuristic(textPatterns: any): number { return Math.random() * 0.5 + 0.2; }
  private detectAnchoringBias(history: any[]): number { return Math.random() * 0.5 + 0.2; }
  private detectLossAversion(textPatterns: any): number { return Math.random() * 0.5 + 0.2; }
  private detectOverconfidenceBias(textPatterns: any): number { return Math.random() * 0.5 + 0.2; }
  private detectCatastrophicThinking(textPatterns: any): number { return Math.random() * 0.5 + 0.2; }
  private detectAllOrNothingThinking(textPatterns: any): number { return Math.random() * 0.5 + 0.2; }
  private generateBiasInsights(textPatterns: any): string[] { return ['Working on pattern recognition']; }

  private analyzeRelationshipLanguage(textPatterns: any): any {
    return {
      security: 0.7,
      anxiety: 0.3,
      independence: 0.5,
      inconsistency: 0.2
    };
  }

  private analyzeConnectionPatterns(behavioralPatterns: any): any {
    return {
      stability: 0.8,
      seeking: 0.4,
      distance: 0.3,
      chaos: 0.1
    };
  }

  private identifyRelationshipPatterns(style: string): string[] {
    const patterns: Record<string, string[]> = {
      secure: ['Comfortable with intimacy', 'Good communication'],
      'anxious-preoccupied': ['Seeks reassurance', 'Fear of abandonment'],
      'dismissive-avoidant': ['Values independence', 'Difficulty with closeness'],
      disorganized: ['Inconsistent relationship behaviors', 'Push-pull dynamics']
    };
    return patterns[style] || [];
  }

  private identifyCommunicationTendencies(style: string): string[] {
    const tendencies: Record<string, string[]> = {
      secure: ['Direct and honest', 'Good listening skills'],
      'anxious-preoccupied': ['Over-explains emotions', 'Seeks validation'],
      'dismissive-avoidant': ['Minimizes emotions', 'Avoids conflict'],
      disorganized: ['Inconsistent communication', 'Mixed signals']
    };
    return tendencies[style] || [];
  }

  private generateAttachmentGrowthRec(style: string): string[] {
    const recommendations: Record<string, string[]> = {
      secure: ['Continue healthy patterns', 'Support others\' growth'],
      'anxious-preoccupied': ['Practice self-soothing', 'Build self-worth independent of others'],
      'dismissive-avoidant': ['Practice emotional expression', 'Work on vulnerability'],
      disorganized: ['Seek professional support', 'Work on emotional regulation']
    };
    return recommendations[style] || [];
  }

  private calculateSelfAwareness(textPatterns: any): number { return 0.7; }
  private calculateSelfRegulation(textPatterns: any, nonverbalCues: any): number { return 0.6; }
  private calculateMotivation(textPatterns: any): number { return 0.8; }
  private calculateEmpathy(textPatterns: any): number { return 0.75; }
  private calculateSocialSkills(textPatterns: any): number { return 0.65; }
  private calculateEmotionalLiteracy(textPatterns: any): number { return 0.7; }

  private identifyEQStrengths(eq: any): string[] {
    const strengths = [];
    if (eq.selfAwareness > 0.7) strengths.push('Strong self-awareness');
    if (eq.empathy > 0.7) strengths.push('High empathy');
    if (eq.motivation > 0.7) strengths.push('Self-motivated');
    return strengths;
  }

  private identifyEQDevelopmentOpportunities(eq: any): string[] {
    const opportunities = [];
    if (eq.selfRegulation < 0.6) opportunities.push('Emotional regulation');
    if (eq.socialSkills < 0.6) opportunities.push('Social interaction skills');
    return opportunities;
  }

  private calculateFacialConsistency(video: VideoAnalysis): number { return 0.8; }
  private calculateEmotionalCongruence(video: VideoAnalysis | null, audio: AudioAnalysis | null): number { return 0.75; }
  private calculateVocalStress(audio: AudioAnalysis): number { return audio.volume > 0.8 ? 0.7 : 0.3; }
  private calculateEmotionalRange(video: VideoAnalysis | null, audio: AudioAnalysis | null): number { return 0.6; }
  private calculateAverageResponseTime(history: any[]): number { return 0.5; }
  private calculateBehavioralConsistency(history: any[]): number { return 0.8; }
  private analyzeInitiationPatterns(history: any[]): any { return { proactive: 0.6 }; }
  private analyzeQuestionAsking(history: any[]): any { return { frequency: 0.4 }; }
  private analyzeHelpSeeking(history: any[]): any { return { willingness: 0.7 }; }
  private analyzeDecisionMakingBehaviors(history: any[]): any { return { deliberate: 0.8 }; }
  private analyzeDecisionMakingStyle(history: any[]): DecisionMakingProfile {
    return {
      style: 'analytical',
      confidence: 0.7,
      speedVsAccuracy: 0.6,
      riskTolerance: 0.5,
      informationGatheringStyle: 'thorough',
      decisionTriggers: ['clear criteria', 'sufficient information'],
      paralysisPoints: ['too many options', 'high stakes']
    };
  }

  private analyzeStressResponse(textPatterns: any, nonverbalCues: any): StressResponseProfile {
    return {
      primaryResponse: 'freeze',
      stressTriggers: ['uncertainty', 'time pressure', 'conflict'],
      copingMechanisms: ['analysis', 'seeking support', 'planning'],
      resilienceFactors: ['self-awareness', 'growth mindset'],
      burnoutRisk: 0.4,
      recoveryPatterns: ['reflection', 'rest', 'connection']
    };
  }

  private analyzeCommunicationPatterns(textPatterns: any, nonverbalCues: any): CommunicationPatternAnalysis {
    return {
      style: 'assertive',
      conflictApproach: 'collaborative problem-solving',
      expressionStyle: 'thoughtful and measured',
      listeningStyle: 'active and empathetic',
      nonverbalCues: ['consistent eye contact', 'open posture'],
      improvementAreas: ['more direct expression of needs']
    };
  }

  private analyzeLifeThemes(history: any[]): LifeThemeAnalysis {
    return {
      coreValues: ['growth', 'authenticity', 'connection', 'contribution'],
      lifeVision: 'Living with purpose and meaningful relationships',
      purposeClarity: 0.7,
      meaningMaking: ['personal development', 'helping others', 'creative expression'],
      growthTrajectory: 'consistent upward development',
      lifeStageTransitions: ['building career', 'deepening relationships']
    };
  }
}

export const advancedPsychologyService = new AdvancedPsychologyService();