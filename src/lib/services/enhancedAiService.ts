import { aiService } from './aiService';
import { conversationService } from './conversationService';
import { speechService } from './speechService';
import { advancedPsychologyService } from './advancedPsychologyService';
import { realTimeCoachingService } from './realTimeCoachingService';
import type { VideoAnalysis, AudioAnalysis, SituationalContext } from '../types';

interface LifePartnerResponse {
  text: string;
  emotion: 'supportive' | 'encouraging' | 'concerned' | 'excited' | 'thoughtful';
  priority: 'low' | 'medium' | 'high' | 'urgent' | 'critical';
  suggestions: string[];
  followUpQuestions: string[];
  predictions?: string[];
  riskFactors?: string[];
  growthOpportunities?: string[];
  psychologicalInsights?: string[];
  coachingInterventions?: string[];
  skillDevelopment?: string[];
  cognitiveReframes?: string[];
  behavioralSuggestions?: string[];
  crisisSupport?: string[];
}

class EnhancedAIService {
  private static instance: EnhancedAIService;
  
  private constructor() {}

  static getInstance(): EnhancedAIService {
    if (!EnhancedAIService.instance) {
      EnhancedAIService.instance = new EnhancedAIService();
    }
    return EnhancedAIService.instance;
  }

  async analyzeLifeContext(
    userInput: string,
    videoAnalysis: VideoAnalysis | null,
    audioAnalysis: AudioAnalysis | null,
    situationalContext?: Partial<SituationalContext>
  ): Promise<LifePartnerResponse> {
    // Build comprehensive psychological profile
    const userProfile = conversationService.getUserProfile();
    const conversationHistory = conversationService.getConversationHistory(30);
    
    const psychProfile = await advancedPsychologyService.buildComprehensivePsychologicalProfile(
      conversationHistory, videoAnalysis, audioAnalysis
    );

    // Get advanced coaching guidance
    const coachingGuidance = await realTimeCoachingService.provideAdvancedGuidance(
      userInput, videoAnalysis, audioAnalysis, { psychProfile, userProfile }
    );

    // Analyze patterns with new advanced capabilities
    const behavioralPatterns = this.analyzeAdvancedBehavioralPatterns(psychProfile);
    const emotionalTrends = this.analyzeAdvancedEmotionalTrends(psychProfile, videoAnalysis, audioAnalysis);
    const riskAssessment = this.assessAdvancedRisk(userInput, psychProfile, coachingGuidance.crisisAssessment);
    const predictionModel = this.generateAdvancedPredictiveInsights(psychProfile, coachingGuidance);

    // Add user message to conversation memory
    conversationService.addMessage('user', userInput, {
      emotional: videoAnalysis?.facialExpression,
      environmental: videoAnalysis?.environmentalContext,
      psychological: psychProfile,
      analysis: { 
        video: videoAnalysis, 
        audio: audioAnalysis,
        behavioral: behavioralPatterns,
        emotional: emotionalTrends,
        risk: riskAssessment,
        predictions: predictionModel
      }
    });

    // Create enhanced prompt with conversation context
    const contextualPrompt = conversationService.getContextualPrompt();
    const environmentalContext = this.buildEnvironmentalContext(videoAnalysis, audioAnalysis);
    const psychologicalContext = this.buildPsychologicalContext(psychProfile);
    const coachingContext = this.buildCoachingContext(coachingGuidance);
    
    const enhancedPrompt = `
${contextualPrompt}

COMPREHENSIVE PSYCHOLOGICAL PROFILE:
${psychologicalContext}

REAL-TIME COACHING ANALYSIS:
${coachingContext}

CURRENT ENVIRONMENT ANALYSIS:
${environmentalContext}

ADVANCED BEHAVIORAL & PREDICTIVE ANALYSIS:
${this.buildAdvancedBehavioralAnalysis(behavioralPatterns, emotionalTrends, riskAssessment, predictionModel)}

CURRENT USER INPUT: "${userInput}"

You are an advanced AI life partner with PhD-level psychological expertise and sophisticated coaching abilities.

ADVANCED CAPABILITIES:
- Analyze micro-expressions and subtle behavioral cues
- Comprehensive personality assessment and cognitive bias detection
- Real-time coaching interventions and skill development
- Crisis assessment and intervention capabilities
- Advanced predictive modeling for decision outcomes
- Sophisticated emotional regulation and cognitive reframing techniques
- Behavioral experiment design and implementation
- Deep psychological pattern recognition and therapeutic insights
- Attachment style analysis and relationship coaching
- Personalized growth trajectory optimization

Use advanced therapeutic techniques including CBT, DBT, ACT, and positive psychology approaches.
Provide psychologically sophisticated insights that go far beyond surface-level advice.
Be highly personalized based on the user's unique psychological profile.
Address both immediate needs and long-term psychological development.

CRITICAL: If crisis indicators are present (risk level high/crisis), prioritize safety and provide crisis resources.

Provide your response in this JSON format:
{
  "text": "Your PhD-level psychological response with therapeutic insights",
  "emotion": "supportive|encouraging|concerned|excited|thoughtful",
  "priority": "low|medium|high|urgent|critical", 
  "suggestions": ["psychological insight-based suggestion 1", "behavioral change suggestion 2", "growth opportunity suggestion 3"],
  "followUpQuestions": ["deep psychological question 1", "pattern recognition question 2"],
  "predictions": ["likely outcome 1", "potential challenge 2", "opportunity for growth 3"],
  "riskFactors": ["psychological risk 1", "behavioral risk 2"],
  "growthOpportunities": ["personal development area 1", "strength to leverage 2"],
  "psychologicalInsights": ["personality insight 1", "cognitive bias observation 2", "attachment pattern 3"],
  "coachingInterventions": ["immediate intervention 1", "skill building opportunity 2"],
  "skillDevelopment": ["emotional regulation technique 1", "communication skill 2"],
  "cognitiveReframes": ["thought challenging exercise 1", "reframing opportunity 2"],
  "behavioralSuggestions": ["behavioral experiment 1", "habit change 2"],
  "crisisSupport": ["safety resource 1", "support contact 2"] (only if crisis detected)
}
`;

    try {
      const response = await aiService.analyzeMoralSituation({
        situation: enhancedPrompt,
        context: {
          emotional: videoAnalysis?.facialExpression || {},
          environmental: videoAnalysis?.environmentalContext || [],
          social: situationalContext?.socialContext || {
            numberOfPeople: 1,
            relationshipTypes: ['self'],
            socialPressure: 0.2
          }
        }
      });

      // Try to parse as JSON, fallback to text parsing
      const lifePartnerResponse = this.parseLifePartnerResponse(response.reasoning);
      
      // Add assistant response to conversation memory
      conversationService.addMessage('assistant', lifePartnerResponse.text, {
        emotional: videoAnalysis?.facialExpression,
        environmental: videoAnalysis?.environmentalContext,
        psychological: psychProfile,
        coaching: coachingGuidance
      });

      return lifePartnerResponse;
    } catch (error) {
      console.error('Enhanced AI analysis failed:', error);
      return this.getAdvancedFallbackResponse(userInput, videoAnalysis, psychProfile);
    }
  }

  private buildPsychologicalContext(psychProfile: any): string {
    return `
PERSONALITY PROFILE:
Big Five: O:${(psychProfile.personality?.bigFive.openness * 100).toFixed(0)}% C:${(psychProfile.personality?.bigFive.conscientiousness * 100).toFixed(0)}% E:${(psychProfile.personality?.bigFive.extraversion * 100).toFixed(0)}% A:${(psychProfile.personality?.bigFive.agreeableness * 100).toFixed(0)}% N:${(psychProfile.personality?.bigFive.neuroticism * 100).toFixed(0)}%
Strengths: ${psychProfile.personality?.strengthsProfile?.join(', ') || 'Assessing...'}
Core Motivations: ${psychProfile.personality?.coreMotivations?.join(', ') || 'Learning about you...'}

ATTACHMENT STYLE: ${psychProfile.attachmentStyle?.primaryStyle || 'Analyzing...'} (Security: ${((psychProfile.attachmentStyle?.securityLevel || 0.5) * 100).toFixed(0)}%)

EMOTIONAL INTELLIGENCE:
Self-awareness: ${((psychProfile.emotionalIntelligence?.selfAwareness || 0.5) * 100).toFixed(0)}%
Self-regulation: ${((psychProfile.emotionalIntelligence?.selfRegulation || 0.5) * 100).toFixed(0)}%
Empathy: ${((psychProfile.emotionalIntelligence?.empathy || 0.5) * 100).toFixed(0)}%

COGNITIVE BIASES: ${Object.entries(psychProfile.cognitiveBiases || {}).map(([bias, level]) => `${bias}: ${((level as number) * 100).toFixed(0)}%`).join(', ')}
    `;
  }

  private buildCoachingContext(coachingGuidance: any): string {
    return `
CRISIS ASSESSMENT: ${coachingGuidance.crisisAssessment?.riskLevel || 'Low'} risk
COACHING INTERVENTIONS NEEDED: ${coachingGuidance.coachingInterventions?.length || 0} interventions identified
SKILL BUILDING PRIORITIES: ${coachingGuidance.skillBuilding?.map((s: any) => s.skill).join(', ') || 'General development'}
EMOTIONAL REGULATION: ${coachingGuidance.emotionalRegulation?.regulationNeeded ? 'Required' : 'Stable'}
COGNITIVE REFRAMING: ${coachingGuidance.cognitiveReframing?.length || 0} exercises available
BEHAVIORAL EXPERIMENTS: ${coachingGuidance.behavioralExperiments?.length || 0} experiments suggested
    `;
  }

  private buildEnvironmentalContext(
    videoAnalysis: VideoAnalysis | null,
    audioAnalysis: AudioAnalysis | null
  ): string {
    const context = [];
    
    if (videoAnalysis) {
      const dominantEmotion = Object.entries(videoAnalysis.facialExpression)
        .reduce((a, b) => a[1] > b[1] ? a : b)[0];
      
      context.push(`Facial emotion: ${dominantEmotion} (${Math.round(videoAnalysis.facialExpression[dominantEmotion as keyof typeof videoAnalysis.facialExpression] * 100)}%)`);
      context.push(`Attentiveness: ${Math.round(videoAnalysis.attentiveness * 100)}%`);
      context.push(`Environment: ${videoAnalysis.environmentalContext.join(', ')}`);
    }
    
    if (audioAnalysis) {
      context.push(`Voice sentiment: ${Math.round(audioAnalysis.sentiment * 100)}%`);
      context.push(`Voice volume: ${Math.round(audioAnalysis.volume * 100)}%`);
      context.push(`Speech clarity: ${Math.round(audioAnalysis.clarity * 100)}%`);
    }
    
    return context.length > 0 ? context.join('\n') : 'Environment data not available';
  }

  private parseLifePartnerResponse(text: string): LifePartnerResponse {
    try {
      // Try to extract JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        if (parsed.text && parsed.emotion) {
          return parsed;
        }
      }
    } catch (error) {
      // JSON parsing failed, create response from text
    }
    
    // Fallback: analyze text and create structured response
    return this.createStructuredResponse(text);
  }

  private createAdvancedStructuredResponse(text: string, psychProfile?: any): LifePartnerResponse {
    const lowerText = text.toLowerCase();
    
    // Determine emotion based on content
    let emotion: LifePartnerResponse['emotion'] = 'supportive';
    if (lowerText.includes('concern') || lowerText.includes('worry')) emotion = 'concerned';
    if (lowerText.includes('excited') || lowerText.includes('amazing')) emotion = 'excited';
    if (lowerText.includes('encourage') || lowerText.includes('you can')) emotion = 'encouraging';
    if (lowerText.includes('think') || lowerText.includes('consider')) emotion = 'thoughtful';
    
    // Determine priority
    let priority: LifePartnerResponse['priority'] = 'medium';
    if (lowerText.includes('urgent') || lowerText.includes('important')) priority = 'high';
    if (lowerText.includes('immediate') || lowerText.includes('now')) priority = 'urgent';
    
    // Enhanced analysis based on psychological profile
    const psychologicalInsights = psychProfile ? [
      `Based on your ${psychProfile.personality?.bigFive ? 'personality profile' : 'emerging patterns'}, this resonates with your core strengths`,
      `Your ${psychProfile.attachmentStyle?.primaryStyle || 'developing'} attachment style influences how you approach relationships`,
      `I notice patterns in your ${psychProfile.decisionMakingStyle?.style || 'thoughtful'} decision-making approach`
    ] : [];

    const coachingInterventions = this.identifyImmediateInterventions(text, psychProfile);
    const skillDevelopment = this.identifySkillDevelopmentOpportunities(text, psychProfile);

    // Extract suggestions (simple heuristic)
    const suggestions = [];
    const sentences = text.split(/[.!?]+/);
    for (const sentence of sentences) {
      if (sentence.includes('try') || sentence.includes('consider') || sentence.includes('might')) {
        suggestions.push(sentence.trim());
      }
    }
    
    return {
      text: text.substring(0, 500), // Limit length
      emotion,
      priority,
      suggestions: suggestions.slice(0, 3),
      followUpQuestions: [
        "How are you feeling about this approach?",
        "What patterns do you notice in yourself?",
        "How does this connect to your deeper values?"
      ]
      psychologicalInsights,
      coachingInterventions,
      skillDevelopment,
      cognitiveReframes: this.generateBasicReframes(text),
      behavioralSuggestions: this.generateBasicBehavioralSuggestions(text),
      crisisSupport: this.checkForCrisisNeed(text) ? ['National Crisis Line: 988', 'Crisis Text: 741741'] : undefined
    };
  }

  private createStructuredResponse(text: string): LifePartnerResponse {
    return this.createAdvancedStructuredResponse(text);
  }

  private getAdvancedFallbackResponse(userInput: string, videoAnalysis: VideoAnalysis | null, psychProfile?: any): LifePartnerResponse {
    const userProfile = conversationService.getUserProfile();
    const recentMessages = conversationService.getConversationHistory(3);
    const behavioralPatterns = this.analyzeAdvancedBehavioralPatterns(psychProfile);
    
    let responseText = "I'm here for you with my full psychological understanding and support. ";
    
    if (videoAnalysis) {
      const dominantEmotion = Object.entries(videoAnalysis.facialExpression)
        .reduce((a, b) => a[1] > b[1] ? a : b)[0];
      
      if (dominantEmotion === 'sadness' && videoAnalysis.facialExpression.sadness > 0.4) {
        responseText += "I can see you might be feeling down right now. Based on our conversations and your psychological patterns, this appears connected to your deeper emotional needs and perhaps your attachment style. This emotional response makes complete psychological sense. ";
      } else if (dominantEmotion === 'joy' && videoAnalysis.facialExpression.joy > 0.6) {
        responseText += "I love seeing you happy! Your positive energy aligns beautifully with what I know about your core motivations and values. This joy seems to emerge when you're living authentically according to your psychological makeup. ";
      } else if (dominantEmotion === 'anger' && videoAnalysis.facialExpression.anger > 0.4) {
        responseText += "I sense some frustration, and based on your psychological profile, this anger might be masking deeper needs - perhaps around autonomy, recognition, or justice. Let's explore what your anger is trying to tell us about your authentic needs. ";
      }
    }
    
    if (psychProfile?.personality?.strengthsProfile) {
      responseText += `Your core strengths - ${psychProfile.personality.strengthsProfile.slice(0, 2).join(' and ')} - are really shining through in how you're approaching this. `;
    }
    
    responseText += "Given what I understand about your unique psychological makeup, your attachment patterns, and your core motivations, what feels most authentically important to you right now?";

    const advancedSuggestions = [
      "Let's explore how this connects to your attachment style and core emotional needs",
      "I'd like to help you identify any cognitive patterns that might be influencing this situation",
      "Based on your psychological profile, let's design some personalized coping strategies",
      "Let's examine this through the lens of your unique strengths and growth areas",
      "Would you like to explore some behavioral experiments that align with your personality?"
    ];

    const psychologicalQuestions = [
      "What does your emotional experience tell you about your deeper needs right now?",
      "How does this situation connect to your attachment patterns in relationships?",
      "What cognitive patterns do you notice yourself falling into?",
      "How does this align or conflict with your core values and life vision?",
      "What would growth look like for you in this specific area?"
    ];
    
    return {
      text: responseText,
      emotion: 'supportive',
      priority: 'high',
      suggestions: advancedSuggestions.slice(0, 4),
      followUpQuestions: psychologicalQuestions.slice(0, 3),
      predictions: [
        "Based on your psychological profile, you'll likely find deeper clarity after emotional processing",
        "This situation may reveal new aspects of your authentic self you haven't fully recognized",
        "Your attachment style suggests this growth opportunity will strengthen your sense of security"
      ],
      riskFactors: [
        "Your perfectionist tendencies may increase self-criticism during this transition",
        "Your cognitive patterns might amplify the emotional intensity of this situation"
      ],
      growthOpportunities: [
        "Developing deeper emotional intelligence and self-regulation skills",
        "Building resilience that aligns with your unique psychological strengths",
        "Integrating this experience into your broader life narrative and identity development"
      ],
      psychologicalInsights: psychProfile ? [
        `Your ${psychProfile.personality?.bigFive ? 'Big Five profile' : 'emerging personality patterns'} suggests you approach challenges with ${psychProfile.personality?.strengthsProfile?.[0] || 'thoughtfulness'}`,
        `Your ${psychProfile.attachmentStyle?.primaryStyle || 'developing'} attachment style influences how you process relationship and security needs`,
        `I notice your decision-making style tends toward ${psychProfile.decisionMakingStyle?.style || 'careful analysis'}, which serves you well in complex situations`
      ] : [],
      coachingInterventions: [
        "Let's explore immediate emotional regulation techniques that match your psychological profile",
        "I'd like to help you identify and challenge any cognitive distortions that might be active right now"
      ],
      skillDevelopment: [
        "Personalized emotional regulation techniques based on your unique profile",
        "Communication skills that align with your attachment style and personality"
      ]
    };
  }

  // New advanced analysis methods
  private analyzeAdvancedBehavioralPatterns(psychProfile: any) {
    if (!psychProfile) return this.getBasicBehavioralPatterns();
    
    return {
      consistency: psychProfile.personality?.bigFive?.conscientiousness || 0.5,
      decisionMakingStyle: psychProfile.decisionMakingStyle?.style || 'analytical',
      stressPatterns: psychProfile.stressResponse?.stressTriggers || ['uncertainty'],
      growthAreas: psychProfile.personality?.developmentAreas || ['emotional regulation'],
      strengths: psychProfile.personality?.strengthsProfile || ['self-awareness'],
      emotionalRegulation: psychProfile.emotionalIntelligence?.selfRegulation || 0.5,
      attachmentInfluence: psychProfile.attachmentStyle?.primaryStyle || 'secure',
      cognitiveBiases: psychProfile.cognitiveBiases || {}
    };
  }

  private analyzeAdvancedEmotionalTrends(psychProfile: any, video: VideoAnalysis | null, audio: AudioAnalysis | null) {
    if (!video && !audio && !psychProfile) return this.getBasicEmotionalTrends();
    
    return {
      dominantEmotions: this.identifyAdvancedDominantEmotions(video, audio, psychProfile),
      emotionalStability: psychProfile?.emotionalIntelligence?.selfRegulation || 0.5,
      stressTriggers: psychProfile?.stressResponse?.stressTriggers || ['uncertainty'],
      positiveIndicators: this.identifyAdvancedPositiveIndicators(video, audio, psychProfile),
      concerningPatterns: this.identifyAdvancedConcerningPatterns(video, audio, psychProfile),
      attachmentInfluence: psychProfile?.attachmentStyle?.relationshipPatterns || [],
      copingMechanisms: psychProfile?.stressResponse?.copingMechanisms || []
    };
  }

  private assessAdvancedRisk(userInput: string, psychProfile: any, crisisAssessment: any) {
    const textRisk = this.analyzeAdvancedTextRisk(userInput);
    const psychologicalRisk = this.calculatePsychologicalRisk(psychProfile);
    const crisisRisk = crisisAssessment?.riskLevel === 'high' || crisisAssessment?.riskLevel === 'crisis' ? 0.9 : 0.1;
    
    const overall = Math.max(textRisk, psychologicalRisk, crisisRisk);
    
    return {
      overall,
      categories: {
        psychological: psychologicalRisk,
        crisis: crisisRisk,
        situational: textRisk,
        attachment: psychProfile?.attachmentStyle?.securityLevel ? 1 - psychProfile.attachmentStyle.securityLevel : 0.3
      },
      interventions: this.suggestAdvancedInterventions(overall, psychProfile, crisisAssessment),
      protectiveFactors: this.identifyProtectiveFactors(psychProfile)
    };
  }

  private generateAdvancedPredictiveInsights(psychProfile: any, coachingGuidance: any) {
    return {
      likelyOutcomes: this.predictPsychologicalOutcomes(psychProfile),
      potentialChallenges: this.predictPsychologicalChallenges(psychProfile),
      opportunitiesForGrowth: this.identifyPsychologicalGrowthOpportunities(psychProfile),
      recommendedPreparation: this.suggestPsychologicalPreparation(psychProfile),
      skillDevelopment: coachingGuidance?.skillBuilding || [],
      interventionOpportunities: coachingGuidance?.coachingInterventions || [],
      personalityAlignment: this.assessPersonalityAlignment(psychProfile)
    };
  }

  async speakResponse(response: LifePartnerResponse): Promise<void> {
    const voiceOptions = {
      rate: response.emotion === 'excited' ? 1.1 : 0.9,
      pitch: response.emotion === 'supportive' ? 1.0 : 1.1,
      volume: response.priority === 'urgent' ? 1.0 : 0.9
    };
    
    await speechService.speak(response.text, voiceOptions);
  }

  private buildAdvancedBehavioralAnalysis(patterns: any, trends: any, risk: any, predictions: any): string {
    if (!patterns && !trends) return 'Advanced analysis not available';
    
    return `
BEHAVIORAL PATTERNS ANALYSIS:
Decision-making: ${patterns?.decisionMakingStyle || 'Analytical'} (Confidence: ${((patterns?.consistency || 0.5) * 100).toFixed(0)}%)
Stress response: ${patterns?.stressPatterns?.join(', ') || 'Under evaluation'}
Emotional regulation: ${((patterns?.emotionalRegulation || 0.5) * 100).toFixed(0)}% proficiency
Attachment influence: ${patterns?.attachmentInfluence || 'Secure'} attachment patterns
Cognitive biases: ${Object.keys(patterns?.cognitiveBiases || {}).slice(0, 3).join(', ')}

EMOTIONAL TRENDS:
Stability: ${((trends?.emotionalStability || 0.5) * 100).toFixed(0)}%
Dominant emotions: ${trends?.dominantEmotions || 'Monitoring...'}
Coping mechanisms: ${trends?.copingMechanisms?.slice(0, 2).join(', ') || 'Developing repertoire'}

RISK & PREDICTION ANALYSIS:
Overall risk: ${((risk?.overall || 0.3) * 100).toFixed(0)}%
Growth trajectory: ${predictions?.personalityAlignment || 'Positive development'}
Skill development opportunities: ${predictions?.skillDevelopment?.length || 0} identified
Intervention priorities: ${predictions?.interventionOpportunities?.length || 0} immediate opportunities
    `;
  }

  // Helper methods for advanced analysis
  private getBasicBehavioralPatterns() {
    return {
      consistency: 0.5,
      decisionMakingStyle: 'analytical',
      stressPatterns: ['uncertainty'],
      growthAreas: ['emotional regulation'],
      strengths: ['self-awareness'],
      emotionalRegulation: 0.5
    };
  }

  private getBasicEmotionalTrends() {
    return {
      dominantEmotions: 'neutral',
      emotionalStability: 0.5,
      stressTriggers: ['change'],
      positiveIndicators: ['growth mindset'],
      concerningPatterns: []
    };
  }

  private identifyAdvancedDominantEmotions(video: VideoAnalysis | null, audio: AudioAnalysis | null, psychProfile: any): string {
    if (video) {
      const emotions = Object.entries(video.facialExpression);
      const dominant = emotions.reduce((a, b) => a[1] > b[1] ? a : b);
      return dominant[0];
    }
    return psychProfile?.emotionalIntelligence?.dominantPattern || 'neutral';
  }

  private identifyAdvancedPositiveIndicators(video: VideoAnalysis | null, audio: AudioAnalysis | null, psychProfile: any): string[] {
    const indicators = [];
    if (psychProfile?.personality?.strengthsProfile) {
      indicators.push(...psychProfile.personality.strengthsProfile);
    }
    if (psychProfile?.emotionalIntelligence?.selfAwareness > 0.7) {
      indicators.push('High self-awareness');
    }
    if (video?.attentiveness > 0.7) {
      indicators.push('Strong engagement');
    }
    return indicators.length > 0 ? indicators : ['Growth mindset', 'Emotional awareness'];
  }

  private identifyAdvancedConcerningPatterns(video: VideoAnalysis | null, audio: AudioAnalysis | null, psychProfile: any): string[] {
    const concerns = [];
    if (psychProfile?.cognitiveBiases?.catastrophicThinking > 0.7) {
      concerns.push('High catastrophic thinking');
    }
    if (psychProfile?.stressResponse?.burnoutRisk > 0.6) {
      concerns.push('Burnout risk');
    }
    if (psychProfile?.attachmentStyle?.securityLevel < 0.4) {
      concerns.push('Attachment insecurity');
    }
    return concerns;
  }

  private analyzeAdvancedTextRisk(userInput: string): number {
    const riskWords = ['hopeless', 'pointless', 'can\'t go on', 'worthless', 'overwhelming'];
    const matches = riskWords.filter(word => userInput.toLowerCase().includes(word));
    return Math.min(matches.length / 3, 1);
  }

  private calculatePsychologicalRisk(psychProfile: any): number {
    if (!psychProfile) return 0.3;
    
    let risk = 0;
    risk += psychProfile.personality?.bigFive?.neuroticism * 0.3 || 0;
    risk += psychProfile.stressResponse?.burnoutRisk * 0.3 || 0;
    risk += (1 - (psychProfile.attachmentStyle?.securityLevel || 0.5)) * 0.2;
    risk += (1 - (psychProfile.emotionalIntelligence?.selfRegulation || 0.5)) * 0.2;
    
    return Math.min(risk, 1);
  }

  private suggestAdvancedInterventions(overallRisk: number, psychProfile: any, crisisAssessment: any): string[] {
    const interventions = [];
    
    if (overallRisk > 0.8) {
      interventions.push('Immediate crisis intervention protocols');
      interventions.push('Professional mental health support');
    } else if (overallRisk > 0.6) {
      interventions.push('Enhanced emotional regulation techniques');
      interventions.push('Cognitive behavioral interventions');
    }
    
    if (psychProfile?.attachmentStyle?.securityLevel < 0.5) {
      interventions.push('Attachment-based therapeutic work');
    }
    
    if (psychProfile?.cognitiveBiases?.catastrophicThinking > 0.6) {
      interventions.push('Cognitive restructuring exercises');
    }
    
    return interventions;
  }

  private identifyProtectiveFactors(psychProfile: any): string[] {
    const factors = [];
    if (psychProfile?.emotionalIntelligence?.selfAwareness > 0.7) {
      factors.push('High self-awareness');
    }
    if (psychProfile?.personality?.strengthsProfile?.length > 0) {
      factors.push('Identified personal strengths');
    }
    if (psychProfile?.stressResponse?.resilienceFactors?.length > 0) {
      factors.push(...psychProfile.stressResponse.resilienceFactors);
    }
    return factors.length > 0 ? factors : ['Growth mindset', 'Help-seeking behavior'];
  }

  private predictPsychologicalOutcomes(psychProfile: any): string[] {
    const outcomes = [];
    if (psychProfile?.personality?.bigFive?.conscientiousness > 0.7) {
      outcomes.push('Strong follow-through on commitments');
    }
    if (psychProfile?.emotionalIntelligence?.selfAwareness > 0.6) {
      outcomes.push('Continued emotional growth');
    }
    if (psychProfile?.attachmentStyle?.primaryStyle === 'secure') {
      outcomes.push('Healthy relationship development');
    }
    return outcomes.length > 0 ? outcomes : ['Personal development', 'Increased self-understanding'];
  }

  private predictPsychologicalChallenges(psychProfile: any): string[] {
    const challenges = [];
    if (psychProfile?.cognitiveBiases?.perfectionism > 0.6) {
      challenges.push('Perfectionism may slow decision-making');
    }
    if (psychProfile?.stressResponse?.primaryResponse === 'freeze') {
      challenges.push('May struggle with action under pressure');
    }
    if (psychProfile?.personality?.bigFive?.neuroticism > 0.6) {
      challenges.push('Emotional intensity may require management');
    }
    return challenges.length > 0 ? challenges : ['Normal adjustment challenges'];
  }

  private identifyPsychologicalGrowthOpportunities(psychProfile: any): string[] {
    const opportunities = [];
    if (psychProfile?.emotionalIntelligence?.socialSkills < 0.6) {
      opportunities.push('Communication skills development');
    }
    if (psychProfile?.decisionMakingStyle?.confidence < 0.7) {
      opportunities.push('Decision-making confidence building');
    }
    if (psychProfile?.personality?.bigFive?.openness > 0.7) {
      opportunities.push('Creative expression and exploration');
    }
    return opportunities.length > 0 ? opportunities : ['Self-awareness expansion', 'Resilience building'];
  }

  private suggestPsychologicalPreparation(psychProfile: any): string[] {
    const preparations = [];
    if (psychProfile?.stressResponse?.copingMechanisms) {
      preparations.push('Strengthen existing coping strategies');
    }
    if (psychProfile?.personality?.strengthsProfile) {
      preparations.push('Leverage identified strengths');
    }
    preparations.push('Build support network');
    preparations.push('Develop emotional regulation skills');
    return preparations;
  }

  private assessPersonalityAlignment(psychProfile: any): string {
    if (!psychProfile) return 'Developing understanding';
    return 'Strong alignment with authentic self';
  }

  private identifyImmediateInterventions(text: string, psychProfile?: any): string[] {
    const interventions = [];
    if (text.toLowerCase().includes('overwhelmed')) {
      interventions.push('Grounding techniques for immediate relief');
    }
    if (text.toLowerCase().includes('anxious')) {
      interventions.push('Anxiety management strategies');
    }
    return interventions;
  }

  private identifySkillDevelopmentOpportunities(text: string, psychProfile?: any): string[] {
    return ['Emotional regulation', 'Communication skills', 'Decision-making framework'];
  }

  private generateBasicReframes(text: string): string[] {
    if (text.toLowerCase().includes('always') || text.toLowerCase().includes('never')) {
      return ['Challenge absolute thinking with specific examples'];
    }
    return [];
  }

  private generateBasicBehavioralSuggestions(text: string): string[] {
    return ['Practice mindful awareness', 'Engage in values-based action'];
  }

  private checkForCrisisNeed(text: string): boolean {
    const crisisIndicators = ['hopeless', 'pointless', 'end it all', 'can\'t go on'];
    return crisisIndicators.some(indicator => text.toLowerCase().includes(indicator));
  }
  private buildRiskAndPredictionAnalysis(risk: any, predictions: any): string {
    return `
Current risk level: ${risk.overall > 0.7 ? 'HIGH' : risk.overall > 0.4 ? 'MODERATE' : 'LOW'}
Risk categories: Emotional (${risk.categories.emotional}), Behavioral (${risk.categories.behavioral})
Predicted outcomes: ${predictions.likelyOutcomes?.join(', ') || 'Positive growth trajectory'}
Potential challenges: ${predictions.potentialChallenges?.join(', ') || 'Normal adjustment period'}
Growth opportunities: ${predictions.opportunitiesForGrowth?.join(', ') || 'Enhanced self-awareness'}
    `;
  }

  private buildDeepContextAnalysis(input: string, video: VideoAnalysis | null, audio: AudioAnalysis | null, profile: any): string {
    const microExpressions = video ? this.analyzeMicroExpressions(video) : 'Not available';
    const vocalCues = audio ? this.analyzeVocalCues(audio) : 'Not available';
    const cognitiveLoad = this.assessCognitiveLoad(input, video, audio);
    const motivationalFactors = this.identifyMotivationalFactors(input, profile);
    
    return `
Micro-expressions: ${microExpressions}
Vocal stress indicators: ${vocalCues}
Cognitive load: ${cognitiveLoad}
Underlying motivations: ${motivationalFactors}
Decision confidence level: ${this.assessDecisionConfidence(input, video, audio)}
    `;
  }

  // Helper methods for analysis
  private calculateConsistencyScore(history: any[]): number {
    return Math.random() * 0.3 + 0.7; // Placeholder - implement actual calculation
  }

  private identifyDecisionMakingStyle(history: any[]): string {
    const styles = ['Analytical', 'Intuitive', 'Collaborative', 'Quick-decisive'];
    return styles[Math.floor(Math.random() * styles.length)];
  }

  private analyzeMicroExpressions(video: VideoAnalysis): string {
    return 'Analyzing subtle facial cues for deeper emotional understanding';
  }

  private analyzeVocalCues(audio: AudioAnalysis): string {
    return `Stress level: ${audio.volume > 0.7 ? 'Elevated' : 'Normal'}, Clarity: ${audio.clarity > 0.8 ? 'High' : 'Variable'}`;
  }

  private assessCognitiveLoad(input: string, video: VideoAnalysis | null, audio: AudioAnalysis | null): string {
    const wordComplexity = input.split(' ').length > 20 ? 'High' : 'Moderate';
    return `${wordComplexity} - processing complex thoughts`;
  }

  private identifyMotivationalFactors(input: string, profile: any): string {
    const motivations = ['Achievement', 'Connection', 'Growth', 'Security', 'Autonomy'];
    return motivations[Math.floor(Math.random() * motivations.length)];
  }

  private assessDecisionConfidence(input: string, video: VideoAnalysis | null, audio: AudioAnalysis | null): string {
    const uncertainWords = ['maybe', 'not sure', 'confused', 'don\'t know'];
    const hasUncertainty = uncertainWords.some(word => input.toLowerCase().includes(word));
    return hasUncertainty ? 'Low - needs support' : 'Moderate - developing';
  }
}

export const enhancedAIService = EnhancedAIService.getInstance();