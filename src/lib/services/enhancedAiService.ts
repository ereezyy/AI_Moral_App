import { aiService } from './aiService';
import { conversationService } from './conversationService';
import { speechService } from './speechService';
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
    // Analyze user patterns and build comprehensive profile
    const userProfile = conversationService.getUserProfile();
    const behavioralPatterns = this.analyzeBehavioralPatterns();
    const emotionalTrends = this.analyzeEmotionalTrends(videoAnalysis, audioAnalysis);
    const riskAssessment = this.assessCurrentRisk(userInput, videoAnalysis, audioAnalysis);
    const predictionModel = this.generatePredictiveInsights(userInput, userProfile);

    // Add user message to conversation memory
    conversationService.addMessage('user', userInput, {
      emotional: videoAnalysis?.facialExpression,
      environmental: videoAnalysis?.environmentalContext,
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
    
    const enhancedPrompt = `
${contextualPrompt}

ADVANCED BEHAVIORAL ANALYSIS:
${this.buildBehavioralAnalysis(behavioralPatterns, emotionalTrends)}

RISK ASSESSMENT & PREDICTIONS:
${this.buildRiskAndPredictionAnalysis(riskAssessment, predictionModel)}

CURRENT ENVIRONMENT ANALYSIS:
${environmentalContext}

DEEP CONTEXTUAL INSIGHTS:
${this.buildDeepContextAnalysis(userInput, videoAnalysis, audioAnalysis, userProfile)}

CURRENT USER INPUT: "${userInput}"

You are an advanced AI life partner with deep psychological insight and predictive capabilities.

ENHANCED CAPABILITIES:
- Analyze micro-expressions and subtle behavioral cues
- Predict potential outcomes of decisions based on psychological patterns
- Provide personalized guidance based on long-term behavioral analysis
- Identify underlying emotional needs and motivations
- Offer proactive suggestions for personal growth and well-being
- Detect early warning signs of stress, anxiety, or decision-making patterns that might lead to regret

Be deeply personal, insightful, and transformative. Use advanced psychological principles.
Reference specific patterns you've observed. Predict how the user might feel about their choices.
Offer multi-layered guidance that addresses both immediate needs and long-term growth.

Consider not just what they're saying, but what they're NOT saying based on their patterns.

Provide your response in this JSON format:
{
  "text": "Your deeply personalized, psychologically insightful response",
  "emotion": "supportive|encouraging|concerned|excited|thoughtful", 
  "priority": "low|medium|high|urgent|critical",
  "suggestions": ["psychological insight-based suggestion 1", "behavioral change suggestion 2", "growth opportunity suggestion 3"],
  "followUpQuestions": ["deep psychological question 1", "pattern recognition question 2"],
  "predictions": ["likely outcome 1", "potential challenge 2", "opportunity for growth 3"],
  "riskFactors": ["psychological risk 1", "behavioral risk 2"],
  "growthOpportunities": ["personal development area 1", "strength to leverage 2"]
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
        environmental: videoAnalysis?.environmentalContext
      });

      return lifePartnerResponse;
    } catch (error) {
      console.error('Enhanced AI analysis failed:', error);
      return this.getFallbackResponse(userInput, videoAnalysis);
    }
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

  private createStructuredResponse(text: string): LifePartnerResponse {
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
        "Would you like to explore this further?"
      ]
    };
  }

  private getFallbackResponse(userInput: string, videoAnalysis: VideoAnalysis | null): LifePartnerResponse {
    const userProfile = conversationService.getUserProfile();
    const recentMessages = conversationService.getConversationHistory(3);
    const behavioralPatterns = this.analyzeBehavioralPatterns();
    
    let responseText = "I'm here for you. ";
    
    if (videoAnalysis) {
      const dominantEmotion = Object.entries(videoAnalysis.facialExpression)
        .reduce((a, b) => a[1] > b[1] ? a : b)[0];
      
      if (dominantEmotion === 'sadness' && videoAnalysis.facialExpression.sadness > 0.4) {
        responseText += "I can see you might be feeling down right now. Based on our conversations, this seems like a pattern that emerges when you're facing decisions about [specific area]. That's completely okay - we all have those moments. ";
      } else if (dominantEmotion === 'joy' && videoAnalysis.facialExpression.joy > 0.6) {
        responseText += "I love seeing you happy! Your positive energy is wonderful, and I notice this tends to happen when you're aligned with your core values. ";
      } else if (dominantEmotion === 'anger' && videoAnalysis.facialExpression.anger > 0.4) {
        responseText += "I sense some frustration, and knowing your patterns, this might be connected to feeling unheard or undervalued. Let's work through whatever is bothering you. ";
      }
    }
    
    if (recentMessages.length > 0 && behavioralPatterns.consistency > 0.7) {
      responseText += "Based on our conversations, I can see you're really committed to personal growth, and that consistency is one of your greatest strengths. ";
    }
    
    responseText += "What's most important to you right now, and how does it connect to the deeper values I've observed in you?";
    
    return {
      text: responseText,
      emotion: 'supportive',
      priority: 'high',
      suggestions: [
        "Take a moment to breathe and connect with your core values",
        "Share what's really beneath the surface of this situation",
        "Let's explore the long-term implications of this decision",
        "Consider how this aligns with your personal growth patterns"
      ],
      followUpQuestions: [
        "What's the deeper fear or desire behind this situation?",
        "How does this connect to patterns we've discussed before?",
        "What would the version of you from a year from now advise?"
      ],
      predictions: [
        "Based on your patterns, you'll likely find clarity after processing this emotionally",
        "This situation may reveal new strengths you haven't recognized yet"
      ],
      riskFactors: [
        "Tendency to overthink decisions when stressed",
        "Pattern of being hard on yourself during transitions"
      ],
      growthOpportunities: [
        "Developing trust in your decision-making intuition",
        "Building resilience through this challenging moment"
      ]
    };
  }

  private analyzeBehavioralPatterns() {
    const history = conversationService.getConversationHistory(20);
    const insights = conversationService.getInsights();
    
    return {
      consistency: this.calculateConsistencyScore(history),
      decisionMakingStyle: this.identifyDecisionMakingStyle(history),
      stressPatterns: this.identifyStressPatterns(history),
      growthAreas: this.identifyGrowthAreas(history),
      strengths: this.identifyPersonalStrengths(history),
      emotionalRegulation: this.assessEmotionalRegulation(history)
    };
  }

  private analyzeEmotionalTrends(video: VideoAnalysis | null, audio: AudioAnalysis | null) {
    if (!video && !audio) return null;
    
    return {
      dominantEmotions: this.identifyDominantEmotions(video, audio),
      emotionalStability: this.assessEmotionalStability(video, audio),
      stressTriggers: this.identifyStressTriggers(video, audio),
      positiveIndicators: this.identifyPositiveIndicators(video, audio),
      concerningPatterns: this.identifyConceringPatterns(video, audio)
    };
  }

  private assessCurrentRisk(userInput: string, video: VideoAnalysis | null, audio: AudioAnalysis | null) {
    const textRisk = this.analyzeTextForRiskIndicators(userInput);
    const emotionalRisk = this.assessEmotionalRisk(video, audio);
    const behavioralRisk = this.assessBehavioralRisk();
    
    return {
      overall: (textRisk + emotionalRisk + behavioralRisk) / 3,
      categories: {
        emotional: emotionalRisk,
        behavioral: behavioralRisk,
        situational: textRisk
      },
      interventions: this.suggestInterventions(textRisk, emotionalRisk, behavioralRisk)
    };
  }

  private generatePredictiveInsights(userInput: string, userProfile: any) {
    return {
      likelyOutcomes: this.predictLikelyOutcomes(userInput, userProfile),
      potentialChallenges: this.predictPotentialChallenges(userInput, userProfile),
      opportunitiesForGrowth: this.identifyGrowthOpportunities(userInput, userProfile),
      recommendedPreparation: this.suggestPreparation(userInput, userProfile)
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

  private buildBehavioralAnalysis(patterns: any, trends: any): string {
    if (!patterns) return 'Behavioral analysis not available';
    
    return `
Decision-making style: ${patterns.decisionMakingStyle || 'Analytical'}
Stress patterns: ${patterns.stressPatterns || 'Under evaluation'}
Emotional regulation: ${patterns.emotionalRegulation || 'Developing'}
Key strengths: ${patterns.strengths?.join(', ') || 'Resilience, thoughtfulness'}
Growth areas: ${patterns.growthAreas?.join(', ') || 'Decision confidence'}
Emotional trends: ${trends ? 
      `Stability: ${trends.emotionalStability}, Dominant: ${trends.dominantEmotions}` : 
      'Monitoring emotional patterns'}
    `;
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

  private identifyStressPatterns(history: any[]): string {
    const patterns = ['Perfectionism', 'Overthinking', 'Social pressure sensitivity', 'Time pressure'];
    return patterns[Math.floor(Math.random() * patterns.length)];
  }

  private identifyGrowthAreas(history: any[]): string[] {
    return ['Decision confidence', 'Emotional regulation', 'Stress management'];
  }

  private identifyPersonalStrengths(history: any[]): string[] {
    return ['Empathy', 'Thoughtfulness', 'Resilience', 'Self-awareness'];
  }

  private assessEmotionalRegulation(history: any[]): string {
    const levels = ['Developing', 'Good', 'Excellent', 'Needs attention'];
    return levels[Math.floor(Math.random() * levels.length)];
  }

  private identifyDominantEmotions(video: VideoAnalysis | null, audio: AudioAnalysis | null): string {
    if (!video) return 'Monitoring';
    const emotions = Object.entries(video.facialExpression);
    const dominant = emotions.reduce((a, b) => a[1] > b[1] ? a : b);
    return dominant[0];
  }

  private assessEmotionalStability(video: VideoAnalysis | null, audio: AudioAnalysis | null): string {
    return Math.random() > 0.5 ? 'Stable' : 'Variable';
  }

  private identifyStressTriggers(video: VideoAnalysis | null, audio: AudioAnalysis | null): string[] {
    return ['Decision pressure', 'Time constraints', 'Social expectations'];
  }

  private identifyPositiveIndicators(video: VideoAnalysis | null, audio: AudioAnalysis | null): string[] {
    return ['Clear communication', 'Emotional awareness', 'Growth mindset'];
  }

  private identifyConceringPatterns(video: VideoAnalysis | null, audio: AudioAnalysis | null): string[] {
    return [];
  }

  private analyzeTextForRiskIndicators(text: string): number {
    const riskWords = ['hopeless', 'overwhelmed', 'can\'t handle', 'giving up', 'pointless'];
    const riskScore = riskWords.filter(word => text.toLowerCase().includes(word)).length / riskWords.length;
    return Math.min(riskScore * 2, 1);
  }

  private assessEmotionalRisk(video: VideoAnalysis | null, audio: AudioAnalysis | null): number {
    if (!video || !audio) return 0.2;
    const sadness = video.facialExpression.sadness || 0;
    const fear = video.facialExpression.fear || 0;
    const anger = video.facialExpression.anger || 0;
    return Math.min((sadness * 0.4 + fear * 0.4 + anger * 0.2), 1);
  }

  private assessBehavioralRisk(): number {
    return 0.3; // Placeholder
  }

  private suggestInterventions(textRisk: number, emotionalRisk: number, behavioralRisk: number): string[] {
    const interventions = [];
    if (textRisk > 0.6) interventions.push('Professional support recommended');
    if (emotionalRisk > 0.5) interventions.push('Emotional regulation techniques');
    if (behavioralRisk > 0.5) interventions.push('Behavioral pattern adjustment');
    return interventions;
  }

  private predictLikelyOutcomes(input: string, profile: any): string[] {
    return ['Increased self-awareness', 'Better decision clarity', 'Emotional growth'];
  }

  private predictPotentialChallenges(input: string, profile: any): string[] {
    return ['Initial uncertainty', 'Adjustment period', 'Need for patience'];
  }

  private identifyGrowthOpportunities(input: string, profile: any): string[] {
    return ['Enhanced emotional intelligence', 'Stronger decision-making skills', 'Improved self-confidence'];
  }

  private suggestPreparation(input: string, profile: any): string[] {
    return ['Mindfulness practice', 'Journaling insights', 'Trusted advisor consultation'];
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