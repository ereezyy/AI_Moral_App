import { BaseService } from './baseService';
import { conversationService } from './conversationService';
import { advancedPsychologyService } from './advancedPsychologyService';
import { speechService } from './speechService';
import type { VideoAnalysis, AudioAnalysis } from '../types';

interface CoachingIntervention {
  id: string;
  type: 'emotional' | 'cognitive' | 'behavioral' | 'crisis' | 'opportunity';
  priority: 'low' | 'medium' | 'high' | 'urgent' | 'critical';
  trigger: string;
  intervention: string;
  rationale: string;
  techniques: string[];
  expectedOutcome: string;
  followUp: string[];
  timing: 'immediate' | 'next_opportunity' | 'session_end';
}

interface CoachingContext {
  sessionGoals: string[];
  currentEmotionalState: any;
  behavioralPatterns: any;
  riskFactors: any;
  growthOpportunities: any;
  therapeuticRelationship: {
    trust: number;
    rapport: number;
    readiness: number;
  };
}

interface AdvancedGuidanceResponse {
  immediateResponse: string;
  coachingInterventions: CoachingIntervention[];
  skillBuilding: SkillBuildingRecommendation[];
  emotionalRegulation: EmotionalRegulationGuidance;
  cognitiveReframing: CognitiveReframingExercise[];
  behavioralExperiments: BehavioralExperiment[];
  crisisAssessment: CrisisAssessment;
}

interface SkillBuildingRecommendation {
  skill: string;
  currentLevel: number;
  targetLevel: number;
  exercises: string[];
  practiceSchedule: string;
  progressIndicators: string[];
}

interface EmotionalRegulationGuidance {
  currentEmotionalState: string;
  regulationNeeded: boolean;
  techniques: {
    immediate: string[];
    shortTerm: string[];
    longTerm: string[];
  };
  customizedApproach: string;
}

interface CognitiveReframingExercise {
  unhelpfulThought: string;
  cognitiveDistortion: string;
  reframingQuestions: string[];
  balancedThought: string;
  evidenceFor: string[];
  evidenceAgainst: string[];
}

interface BehavioralExperiment {
  hypothesis: string;
  experiment: string;
  predictions: string[];
  measurements: string[];
  learningGoals: string[];
}

interface CrisisAssessment {
  riskLevel: 'none' | 'low' | 'moderate' | 'high' | 'crisis';
  indicators: string[];
  protectiveFactors: string[];
  immediateActions: string[];
  resourceRecommendations: string[];
  followUpRequired: boolean;
}

export class RealTimeCoachingService extends BaseService {
  protected serviceName = 'RealTimeCoachingService';

  async provideAdvancedGuidance(
    userInput: string,
    videoAnalysis: VideoAnalysis | null,
    audioAnalysis: AudioAnalysis | null,
    sessionContext?: any
  ): Promise<AdvancedGuidanceResponse> {
    const conversationHistory = conversationService.getConversationHistory(20);
    const psychProfile = await advancedPsychologyService.buildComprehensivePsychologicalProfile(
      conversationHistory, videoAnalysis, audioAnalysis
    );

    const coachingContext = await this.buildCoachingContext(
      userInput, psychProfile, videoAnalysis, audioAnalysis
    );

    const crisisAssessment = this.assessCrisisRisk(userInput, psychProfile, videoAnalysis, audioAnalysis);
    
    if (crisisAssessment.riskLevel === 'crisis' || crisisAssessment.riskLevel === 'high') {
      return this.handleCrisisScenario(crisisAssessment, coachingContext);
    }

    return {
      immediateResponse: await this.generateImmediateResponse(userInput, coachingContext),
      coachingInterventions: this.identifyCoachingInterventions(coachingContext),
      skillBuilding: this.recommendSkillBuilding(psychProfile, coachingContext),
      emotionalRegulation: this.provideEmotionalRegulation(videoAnalysis, audioAnalysis, coachingContext),
      cognitiveReframing: this.generateCognitiveReframing(userInput, psychProfile),
      behavioralExperiments: this.designBehavioralExperiments(psychProfile, coachingContext),
      crisisAssessment
    };
  }

  private async buildCoachingContext(
    userInput: string,
    psychProfile: any,
    videoAnalysis: VideoAnalysis | null,
    audioAnalysis: AudioAnalysis | null
  ): Promise<CoachingContext> {
    const sessionGoals = this.identifySessionGoals(userInput, psychProfile);
    const currentEmotionalState = this.assessCurrentEmotionalState(videoAnalysis, audioAnalysis);
    const behavioralPatterns = this.analyzeBehavioralPatterns(psychProfile);
    const riskFactors = this.identifyRiskFactors(psychProfile, currentEmotionalState);
    const growthOpportunities = this.identifyGrowthOpportunities(psychProfile, currentEmotionalState);
    const therapeuticRelationship = this.assessTherapeuticRelationship();

    return {
      sessionGoals,
      currentEmotionalState,
      behavioralPatterns,
      riskFactors,
      growthOpportunities,
      therapeuticRelationship
    };
  }

  private identifyCoachingInterventions(context: CoachingContext): CoachingIntervention[] {
    const interventions: CoachingIntervention[] = [];

    // Emotional interventions
    if (context.currentEmotionalState.distress > 0.6) {
      interventions.push({
        id: 'emotional-regulation-1',
        type: 'emotional',
        priority: 'high',
        trigger: 'High emotional distress detected',
        intervention: 'Guided breathing and grounding exercise',
        rationale: 'Immediate emotional regulation needed before productive conversation',
        techniques: ['4-7-8 breathing', '5-4-3-2-1 grounding', 'body scan'],
        expectedOutcome: 'Reduced emotional intensity, increased clarity',
        followUp: ['Check emotional state', 'Continue with main topic', 'Process emotions if needed'],
        timing: 'immediate'
      });
    }

    // Cognitive interventions
    if (context.behavioralPatterns.catastrophicThinking > 0.5) {
      interventions.push({
        id: 'cognitive-reframe-1',
        type: 'cognitive',
        priority: 'medium',
        trigger: 'Catastrophic thinking patterns detected',
        intervention: 'Challenge catastrophic thoughts with evidence-based questioning',
        rationale: 'Reduce cognitive distortions that amplify problems',
        techniques: ['worst case/best case/most likely', 'evidence examination', 'probability assessment'],
        expectedOutcome: 'More balanced and realistic thinking',
        followUp: ['Practice thought challenging', 'Monitor thought patterns', 'Develop balanced perspectives'],
        timing: 'next_opportunity'
      });
    }

    // Behavioral interventions
    if (context.behavioralPatterns.avoidance > 0.6) {
      interventions.push({
        id: 'behavioral-activation-1',
        type: 'behavioral',
        priority: 'medium',
        trigger: 'Avoidance patterns identified',
        intervention: 'Gradual exposure and behavioral activation',
        rationale: 'Break avoidance cycles that maintain problems',
        techniques: ['behavioral experiments', 'graded exposure', 'activity scheduling'],
        expectedOutcome: 'Increased engagement and confidence',
        followUp: ['Plan specific actions', 'Schedule follow-up', 'Review outcomes'],
        timing: 'next_opportunity'
      });
    }

    // Growth opportunity interventions
    if (context.growthOpportunities.length > 0) {
      interventions.push({
        id: 'growth-opportunity-1',
        type: 'opportunity',
        priority: 'low',
        trigger: 'Growth opportunity identified',
        intervention: 'Strength-based development planning',
        rationale: 'Leverage existing strengths for personal development',
        techniques: ['strength identification', 'goal setting', 'action planning'],
        expectedOutcome: 'Enhanced self-efficacy and growth',
        followUp: ['Create development plan', 'Set milestones', 'Regular check-ins'],
        timing: 'session_end'
      });
    }

    return interventions.sort((a, b) => this.getPriorityWeight(a.priority) - this.getPriorityWeight(b.priority));
  }

  private recommendSkillBuilding(psychProfile: any, context: CoachingContext): SkillBuildingRecommendation[] {
    const recommendations: SkillBuildingRecommendation[] = [];

    // Emotional regulation skills
    if (psychProfile.emotionalIntelligence.selfRegulation < 0.6) {
      recommendations.push({
        skill: 'Emotional Regulation',
        currentLevel: psychProfile.emotionalIntelligence.selfRegulation,
        targetLevel: 0.8,
        exercises: [
          'Daily emotion tracking and labeling',
          'Progressive muscle relaxation',
          'Cognitive reappraisal practice',
          'Mindfulness meditation'
        ],
        practiceSchedule: 'Daily 10-15 minute sessions',
        progressIndicators: [
          'Faster emotional recovery',
          'Better emotion identification',
          'Reduced emotional reactivity',
          'Increased emotional flexibility'
        ]
      });
    }

    // Communication skills
    if (psychProfile.emotionalIntelligence.socialSkills < 0.7) {
      recommendations.push({
        skill: 'Communication Skills',
        currentLevel: psychProfile.emotionalIntelligence.socialSkills,
        targetLevel: 0.85,
        exercises: [
          'Active listening practice',
          'Assertiveness training',
          'Nonviolent communication techniques',
          'Conflict resolution skills'
        ],
        practiceSchedule: 'Practice in daily interactions',
        progressIndicators: [
          'Clearer expression of needs',
          'Better listening and understanding',
          'Reduced interpersonal conflicts',
          'Stronger relationships'
        ]
      });
    }

    // Decision-making skills
    if (psychProfile.decisionMakingStyle.confidence < 0.7) {
      recommendations.push({
        skill: 'Decision Making',
        currentLevel: psychProfile.decisionMakingStyle.confidence,
        targetLevel: 0.8,
        exercises: [
          'Decision-making frameworks practice',
          'Values clarification exercises',
          'Pros and cons analysis',
          'Decision outcome tracking'
        ],
        practiceSchedule: 'Apply to daily decisions',
        progressIndicators: [
          'Faster decision making',
          'Higher decision satisfaction',
          'Reduced decision regret',
          'Better long-term outcomes'
        ]
      });
    }

    return recommendations;
  }

  private provideEmotionalRegulation(
    videoAnalysis: VideoAnalysis | null,
    audioAnalysis: AudioAnalysis | null,
    context: CoachingContext
  ): EmotionalRegulationGuidance {
    const currentState = this.identifyDominantEmotion(videoAnalysis, audioAnalysis);
    const intensity = this.calculateEmotionalIntensity(videoAnalysis, audioAnalysis);
    const regulationNeeded = intensity > 0.6 || this.isNegativeEmotionDominant(currentState);

    const techniques = {
      immediate: this.getImmediateTechniques(currentState, intensity),
      shortTerm: this.getShortTermTechniques(currentState, context),
      longTerm: this.getLongTermTechniques(context)
    };

    return {
      currentEmotionalState: currentState,
      regulationNeeded,
      techniques,
      customizedApproach: this.createCustomizedApproach(currentState, intensity, context)
    };
  }

  private generateCognitiveReframing(userInput: string, psychProfile: any): CognitiveReframingExercise[] {
    const exercises: CognitiveReframingExercise[] = [];
    const negativeThoughts = this.identifyNegativeThoughts(userInput);
    
    for (const thought of negativeThoughts) {
      const distortion = this.identifyCognitiveDistortion(thought);
      exercises.push({
        unhelpfulThought: thought,
        cognitiveDistortion: distortion,
        reframingQuestions: this.generateReframingQuestions(distortion),
        balancedThought: this.generateBalancedThought(thought),
        evidenceFor: this.generateSupportingEvidence(thought),
        evidenceAgainst: this.generateCounterEvidence(thought)
      });
    }

    return exercises;
  }

  private designBehavioralExperiments(psychProfile: any, context: CoachingContext): BehavioralExperiment[] {
    const experiments: BehavioralExperiment[] = [];

    // Social anxiety experiment
    if (psychProfile.personality.bigFive.extraversion < 0.4) {
      experiments.push({
        hypothesis: 'People will reject me if I initiate conversation',
        experiment: 'Initiate one friendly conversation with a colleague or acquaintance',
        predictions: ['They will seem annoyed', 'The conversation will be awkward', 'I will feel rejected'],
        measurements: ['Their actual response', 'Duration of conversation', 'My anxiety level before/after'],
        learningGoals: ['Test accuracy of social predictions', 'Build social confidence', 'Gather evidence about social interactions']
      });
    }

    // Perfectionism experiment
    if (psychProfile.cognitiveBiases.allOrNothingThinking > 0.6) {
      experiments.push({
        hypothesis: 'If I don\'t do something perfectly, it\'s worthless',
        experiment: 'Complete a task to 80% of your usual standard and observe outcomes',
        predictions: ['The result will be terrible', 'Others will notice the imperfection', 'I will feel like a failure'],
        measurements: ['Actual quality of outcome', 'Others\' reactions', 'Time saved', 'Stress level'],
        learningGoals: ['Test perfectionism assumptions', 'Learn about good enough standards', 'Reduce perfectionist pressure']
      });
    }

    return experiments;
  }

  private assessCrisisRisk(
    userInput: string,
    psychProfile: any,
    videoAnalysis: VideoAnalysis | null,
    audioAnalysis: AudioAnalysis | null
  ): CrisisAssessment {
    const riskIndicators = this.identifyCrisisIndicators(userInput, videoAnalysis, audioAnalysis);
    const protectiveFactors = this.identifyProtectiveFactors(psychProfile);
    const riskLevel = this.calculateOverallRiskLevel(riskIndicators, protectiveFactors);

    return {
      riskLevel,
      indicators: riskIndicators,
      protectiveFactors,
      immediateActions: this.generateImmediateActions(riskLevel),
      resourceRecommendations: this.generateResourceRecommendations(riskLevel),
      followUpRequired: riskLevel !== 'none' && riskLevel !== 'low'
    };
  }

  private async generateImmediateResponse(userInput: string, context: CoachingContext): Promise<string> {
    const urgentInterventions = context.therapeuticRelationship.trust > 0.7;
    const emotionalValidation = this.generateEmotionalValidation(context.currentEmotionalState);
    const immediateTechnique = this.selectImmediateTechnique(context);
    
    return `${emotionalValidation} ${immediateTechnique}`;
  }

  // Crisis handling
  private handleCrisisScenario(crisis: CrisisAssessment, context: CoachingContext): AdvancedGuidanceResponse {
    const crisisResponse = this.generateCrisisResponse(crisis);
    
    return {
      immediateResponse: crisisResponse,
      coachingInterventions: [{
        id: 'crisis-intervention',
        type: 'crisis',
        priority: 'critical',
        trigger: 'Crisis indicators detected',
        intervention: 'Safety assessment and crisis support',
        rationale: 'Immediate safety and stabilization required',
        techniques: ['safety planning', 'crisis resources', 'emergency contacts'],
        expectedOutcome: 'Stabilization and safety',
        followUp: ['Professional referral', 'Safety check', 'Continued monitoring'],
        timing: 'immediate'
      }],
      skillBuilding: [],
      emotionalRegulation: this.provideCrisisEmotionalSupport(),
      cognitiveReframing: [],
      behavioralExperiments: [],
      crisisAssessment: crisis
    };
  }

  // Helper methods
  private getPriorityWeight(priority: string): number {
    const weights = { critical: 1, urgent: 2, high: 3, medium: 4, low: 5 };
    return weights[priority as keyof typeof weights] || 6;
  }

  private identifySessionGoals(userInput: string, psychProfile: any): string[] {
    return ['Emotional clarity', 'Decision support', 'Stress management'];
  }

  private assessCurrentEmotionalState(video: VideoAnalysis | null, audio: AudioAnalysis | null): any {
    return { distress: video?.facialExpression.sadness || 0.3 };
  }

  private analyzeBehavioralPatterns(psychProfile: any): any {
    return { 
      catastrophicThinking: psychProfile.cognitiveBiases?.catastrophicThinking || 0.3,
      avoidance: 0.4
    };
  }

  private identifyRiskFactors(psychProfile: any, emotionalState: any): string[] {
    return ['High stress', 'Social isolation'];
  }

  private identifyGrowthOpportunities(psychProfile: any, emotionalState: any): string[] {
    return ['Leadership development', 'Creative expression'];
  }

  private assessTherapeuticRelationship(): any {
    return { trust: 0.8, rapport: 0.7, readiness: 0.8 };
  }

  private identifyDominantEmotion(video: VideoAnalysis | null, audio: AudioAnalysis | null): string {
    if (!video) return 'neutral';
    const emotions = Object.entries(video.facialExpression);
    return emotions.reduce((a, b) => a[1] > b[1] ? a : b)[0];
  }

  private calculateEmotionalIntensity(video: VideoAnalysis | null, audio: AudioAnalysis | null): number {
    if (!video) return 0.3;
    return Math.max(...Object.values(video.facialExpression));
  }

  private isNegativeEmotionDominant(emotion: string): boolean {
    return ['sadness', 'anger', 'fear'].includes(emotion);
  }

  private getImmediateTechniques(emotion: string, intensity: number): string[] {
    if (intensity > 0.8) return ['Deep breathing', 'Grounding exercise', 'Safe space visualization'];
    if (intensity > 0.6) return ['Mindful breathing', 'Progressive relaxation', 'Emotional labeling'];
    return ['Awareness and acceptance', 'Gentle breathing', 'Self-compassion'];
  }

  private getShortTermTechniques(emotion: string, context: CoachingContext): string[] {
    return ['Journaling', 'Physical exercise', 'Social connection', 'Creative expression'];
  }

  private getLongTermTechniques(context: CoachingContext): string[] {
    return ['Regular meditation', 'Therapy', 'Skill building', 'Lifestyle changes'];
  }

  private createCustomizedApproach(emotion: string, intensity: number, context: CoachingContext): string {
    return `Given your current ${emotion} at intensity ${intensity.toFixed(1)}, I recommend starting with immediate grounding techniques, followed by personalized coping strategies based on your strengths in ${context.behavioralPatterns}.`;
  }

  private identifyNegativeThoughts(input: string): string[] {
    const negativeIndicators = ['always', 'never', 'terrible', 'awful', 'disaster', 'hopeless'];
    const sentences = input.split(/[.!?]+/);
    return sentences.filter(s => negativeIndicators.some(indicator => s.toLowerCase().includes(indicator)));
  }

  private identifyCognitiveDistortion(thought: string): string {
    if (thought.includes('always') || thought.includes('never')) return 'All-or-nothing thinking';
    if (thought.includes('terrible') || thought.includes('awful')) return 'Catastrophizing';
    if (thought.includes('should') || thought.includes('must')) return 'Should statements';
    return 'Negative thinking pattern';
  }

  private generateReframingQuestions(distortion: string): string[] {
    const questions: Record<string, string[]> = {
      'All-or-nothing thinking': [
        'Is this really always or never true?',
        'What evidence contradicts this absolute statement?',
        'What would be a more balanced way to view this?'
      ],
      'Catastrophizing': [
        'What is the worst that could realistically happen?',
        'How likely is this worst-case scenario?',
        'What would I tell a friend in this situation?'
      ]
    };
    return questions[distortion] || ['What evidence supports this thought?', 'What evidence challenges it?'];
  }

  private generateBalancedThought(thought: string): string {
    return `A more balanced perspective might be: ${thought.replace(/always|never/g, 'sometimes').replace(/terrible|awful/g, 'challenging')}`;
  }

  private generateSupportingEvidence(thought: string): string[] {
    return ['Consider specific examples that support this thought'];
  }

  private generateCounterEvidence(thought: string): string[] {
    return ['Look for examples that contradict this thought'];
  }

  private identifyCrisisIndicators(input: string, video: VideoAnalysis | null, audio: AudioAnalysis | null): string[] {
    const crisisWords = ['hopeless', 'pointless', 'end it all', 'can\'t go on', 'no way out'];
    const indicators = [];
    
    for (const word of crisisWords) {
      if (input.toLowerCase().includes(word)) {
        indicators.push(`Crisis language: "${word}"`);
      }
    }
    
    if (video && video.facialExpression.sadness > 0.8) {
      indicators.push('Extreme sadness detected');
    }
    
    return indicators;
  }

  private identifyProtectiveFactors(psychProfile: any): string[] {
    const factors = [];
    if (psychProfile.emotionalIntelligence?.selfAwareness > 0.6) factors.push('High self-awareness');
    if (psychProfile.lifeThemes?.coreValues.includes('family')) factors.push('Strong family connections');
    if (psychProfile.personality?.bigFive.agreeableness > 0.6) factors.push('Social connections');
    return factors;
  }

  private calculateOverallRiskLevel(indicators: string[], protectiveFactors: string[]): CrisisAssessment['riskLevel'] {
    const riskScore = indicators.length * 2;
    const protectionScore = protectiveFactors.length;
    const netRisk = riskScore - protectionScore;
    
    if (netRisk >= 4) return 'crisis';
    if (netRisk >= 2) return 'high';
    if (netRisk >= 1) return 'moderate';
    if (netRisk >= 0) return 'low';
    return 'none';
  }

  private generateImmediateActions(riskLevel: CrisisAssessment['riskLevel']): string[] {
    const actions: Record<string, string[]> = {
      crisis: ['Contact emergency services', 'Stay with person', 'Remove harmful objects'],
      high: ['Contact mental health professional', 'Activate support network', 'Create safety plan'],
      moderate: ['Schedule professional consultation', 'Increase monitoring', 'Strengthen coping strategies'],
      low: ['Continue regular support', 'Monitor changes', 'Maintain healthy routines'],
      none: ['Continue personal development', 'Maintain wellbeing practices']
    };
    return actions[riskLevel] || [];
  }

  private generateResourceRecommendations(riskLevel: CrisisAssessment['riskLevel']): string[] {
    if (riskLevel === 'crisis' || riskLevel === 'high') {
      return [
        'National Suicide Prevention Lifeline: 988',
        'Crisis Text Line: Text HOME to 741741',
        'Emergency Services: 911',
        'Local crisis intervention team'
      ];
    }
    return [
      'Licensed therapist or counselor',
      'Support groups',
      'Mental health apps',
      'Employee assistance program'
    ];
  }

  private generateCrisisResponse(crisis: CrisisAssessment): string {
    return `I'm very concerned about what you've shared. Your safety and wellbeing are the top priority right now. Let's work together to ensure you have the support and resources you need. Please know that you don't have to go through this alone.`;
  }

  private provideCrisisEmotionalSupport(): EmotionalRegulationGuidance {
    return {
      currentEmotionalState: 'crisis',
      regulationNeeded: true,
      techniques: {
        immediate: ['Focus on breathing', 'Stay in the present moment', 'Reach out for support'],
        shortTerm: ['Professional crisis support', 'Safety planning', 'Supportive environment'],
        longTerm: ['Comprehensive mental health treatment', 'Ongoing support network', 'Recovery planning']
      },
      customizedApproach: 'Immediate safety and stabilization are the priority, followed by professional crisis intervention and ongoing support.'
    };
  }

  private generateEmotionalValidation(emotionalState: any): string {
    return "I can see this is really important to you, and your feelings make complete sense given the situation.";
  }

  private selectImmediateTechnique(context: CoachingContext): string {
    if (context.currentEmotionalState.distress > 0.7) {
      return "Let's start by taking a moment to ground yourself - can you take three slow, deep breaths with me?";
    }
    return "I'm here to support you through this.";
  }
}

export const realTimeCoachingService = new RealTimeCoachingService();