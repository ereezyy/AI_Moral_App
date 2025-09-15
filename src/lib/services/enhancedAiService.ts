import { aiService } from './aiService';
import { conversationService } from './conversationService';
import { ConversationAnalyzer } from './conversationAnalyzer';
import { CentralizedErrorHandler } from '../utils/error/centralizedErrorHandler';
import { TextAnalyzer } from '../utils/textAnalysis';
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
    videoAnalysisParam: VideoAnalysis | null,
    audioAnalysisParam: AudioAnalysis | null,
    situationalContext?: Partial<SituationalContext>
  ): Promise<LifePartnerResponse> {
    return await CentralizedErrorHandler.handleAsync(
      async () => {
        // Rename parameters to avoid potential variable shadowing
        const videoAnalysis = videoAnalysisParam;
        const audioAnalysis = audioAnalysisParam;
        
        const conversationHistory = conversationService.getConversationHistory(10);
        const conversationPatterns = ConversationAnalyzer.analyzeConversationHistory(conversationHistory);
        const userProfile = ConversationAnalyzer.extractUserProfile(conversationPatterns);

        const enhancedPrompt = this.buildEnhancedPrompt(
          userInput,
          videoAnalysis,
          audioAnalysis,
          userProfile,
          conversationPatterns
        );

        const response = await aiService.analyzeMoralSituation({
          situation: enhancedPrompt,
          context: this.buildAnalysisContext(videoAnalysis, audioAnalysis, situationalContext)
        });

        return this.createLifePartnerResponse(response, userInput, videoAnalysis, userProfile);
      },
      {
        operation: 'Enhanced AI life context analysis',
        component: 'EnhancedAIService',
        timestamp: Date.now()
      },
      { fallbackValue: this.getBasicFallbackResponse(userInput, videoAnalysis) }
    ) || this.getBasicFallbackResponse(userInput, videoAnalysis);
  }

  private buildEnhancedPrompt(
    userInput: string,
    videoAnalysis: VideoAnalysis | null,
    audioAnalysis: AudioAnalysis | null,
    userProfile: any,
    conversationPatterns: any
  ): string {
    const contextualPrompt = conversationService.getContextualPrompt();
    const environmentalContext = this.buildEnvironmentalContext(videoAnalysis, audioAnalysis);
    const behavioralAnalysis = this.buildBehavioralAnalysis(conversationPatterns, userProfile);
    
    return `
${contextualPrompt}

CURRENT INPUT: "${userInput}"

BEHAVIORAL ANALYSIS:
${behavioralAnalysis}

ENVIRONMENTAL CONTEXT:
${environmentalContext}

Please provide a warm, insightful, and supportive response that:
1. Acknowledges their emotional state with empathy
2. Provides practical guidance based on the context
3. Offers growth-oriented perspectives
4. Includes personalized insights based on their patterns
5. Suggests concrete next steps
6. Maintains the tone of a caring AI life partner

Be conversational, not clinical. Reference their patterns naturally. Focus on their strengths while addressing concerns compassionately.
    `;
  }

  private buildAnalysisContext(
    videoAnalysis: VideoAnalysis | null,
    audioAnalysis: AudioAnalysis | null,
    situationalContext?: Partial<SituationalContext>
  ) {
    const context = {
      emotional: audioAnalysis?.emotionalTone || { neutral: 0.7, joy: 0.2, sadness: 0.1, anger: 0, fear: 0, surprise: 0 },
      environmental: videoAnalysis?.environmentalContext || ['indoor', 'moderate_lighting'],
      social: situationalContext?.socialContext || {
        numberOfPeople: 1,
        relationshipTypes: ['self'],
        socialPressure: 0.2
      }
    };

    return context;
  }

  private createLifePartnerResponse(
    aiResponse: any,
    userInput: string,
    videoAnalysis: VideoAnalysis | null,
    userProfile: any
  ): LifePartnerResponse {
    const enhancedText = this.enhanceResponseText(aiResponse.reasoning || aiResponse.text, userInput, videoAnalysis);
    const emotion = this.determineEmotionFromContext(userInput, videoAnalysis, aiResponse);
    const priority = this.calculatePriorityLevel(aiResponse, userInput);
    
    return {
      text: enhancedText,
      emotion,
      priority,
      suggestions: this.generateContextualSuggestions(userInput, videoAnalysis, userProfile),
      followUpQuestions: this.generatePersonalizedQuestions(userProfile, userInput),
      predictions: this.generatePredictions(userInput, videoAnalysis, userProfile),
      growthOpportunities: this.identifyGrowthOpportunities(userInput, userProfile),
      psychologicalInsights: this.generatePsychologicalInsights(videoAnalysis, audioAnalysis, userProfile),
      coachingInterventions: this.identifyImmediateInterventions(userInput),
      skillDevelopment: this.identifySkillDevelopmentOpportunities(userInput)
    };
  }

  private enhanceResponseText(
    baseResponse: string,
    userInput: string,
    videoAnalysis: VideoAnalysis | null
  ): string {
    let enhancedText = baseResponse;

    // Add emotional acknowledgment if video shows clear emotion
    if (videoAnalysis) {
      const dominantEmotion = this.getDominantEmotion(videoAnalysis.facialExpression);
      if (dominantEmotion !== 'neutral' && videoAnalysis.facialExpression[dominantEmotion] > 0.4) {
        const emotionAcknowledgment = this.getEmotionAcknowledgment(dominantEmotion);
        enhancedText = `${emotionAcknowledgment} ${enhancedText}`;
      }
    }

    return enhancedText;
  }

  private getDominantEmotion(emotions: any): string {
    return Object.entries(emotions)
      .reduce((prev, current) => prev[1] > current[1] ? prev : current)[0];
  }

  private getEmotionAcknowledgment(emotion: string): string {
    const acknowledgments = {
      joy: "I can see you're feeling positive about this!",
      sadness: "I sense this is weighing on you.",
      anger: "This seems to be bringing up some strong feelings.",
      fear: "I understand this might feel uncertain or concerning.",
      surprise: "This seems to have caught you off guard!"
    };
    return acknowledgments[emotion as keyof typeof acknowledgments] || "";
  }

  private determineEmotionFromContext(
    userInput: string,
    videoAnalysis: VideoAnalysis | null,
    aiResponse: any
  ): LifePartnerResponse['emotion'] {
    // Check for crisis indicators first
    const crisisWords = ['hopeless', 'can\'t go on', 'pointless', 'overwhelming'];
    if (crisisWords.some(word => userInput.toLowerCase().includes(word))) {
      return 'concerned';
    }

    // Check video emotion if available
    if (videoAnalysis) {
      const dominantEmotion = this.getDominantEmotion(videoAnalysis.facialExpression);
      if (dominantEmotion === 'joy' && videoAnalysis.facialExpression.joy > 0.6) return 'excited';
      if (dominantEmotion === 'sadness' && videoAnalysis.facialExpression.sadness > 0.5) return 'concerned';
    }

    // Check AI response content
    if (aiResponse.ethicalAlignment > 0.8) return 'encouraging';
    if (userInput.includes('think') || userInput.includes('consider')) return 'thoughtful';

    return 'supportive';
  }

  private calculatePriorityLevel(aiResponse: any, userInput: string): LifePartnerResponse['priority'] {
    // Crisis indicators = urgent
    const crisisWords = ['emergency', 'crisis', 'desperate', 'immediate help'];
    if (crisisWords.some(word => userInput.toLowerCase().includes(word))) {
      return 'urgent';
    }

    // Low ethical alignment = high priority
    if (aiResponse.ethicalAlignment < 0.5) return 'high';

    // Important keywords = high priority
    const importantWords = ['important', 'significant', 'major', 'big decision'];
    if (importantWords.some(word => userInput.toLowerCase().includes(word))) {
      return 'high';
    }

    return 'medium';
  }

  private generateContextualSuggestions(
    userInput: string,
    videoAnalysis: VideoAnalysis | null,
    userProfile: any
  ): string[] {
    const suggestions = [];

    // Video-based suggestions
    if (videoAnalysis) {
      const dominantEmotion = this.getDominantEmotion(videoAnalysis.facialExpression);
      if (dominantEmotion === 'sadness') {
        suggestions.push("Tell me more about what's troubling you");
      } else if (dominantEmotion === 'joy') {
        suggestions.push("Share what's going well for you");
      }
    }

    // Content-based suggestions
    if (userInput.toLowerCase().includes('decision')) {
      suggestions.push("Let's explore your options together");
      suggestions.push("What factors are most important to you?");
    } else if (userInput.toLowerCase().includes('relationship')) {
      suggestions.push("Tell me about this relationship dynamic");
      suggestions.push("How do you usually handle conflicts?");
    } else {
      suggestions.push("Help me understand the situation better");
      suggestions.push("What's the most challenging part?");
    }

    return suggestions.slice(0, 3);
  }

  private generatePersonalizedQuestions(userProfile: any, userInput: string): string[] {
    const questions = [];

    // Always include emotional check-in
    questions.push("How are you feeling about this situation?");

    // Based on user input content
    if (userInput.toLowerCase().includes('decision') || userInput.toLowerCase().includes('choice')) {
      questions.push("What would your ideal outcome look like?");
      questions.push("What values are most important in this decision?");
    } else if (userInput.toLowerCase().includes('stress') || userInput.toLowerCase().includes('overwhelm')) {
      questions.push("What typically helps you feel more balanced?");
      questions.push("What support do you have available?");
    } else {
      questions.push("What patterns do you notice in similar situations?");
      questions.push("How does this connect to your broader goals?");
    }

    return questions.slice(0, 3);
  }

  private generatePredictions(
    userInput: string,
    videoAnalysis: VideoAnalysis | null,
    userProfile: any
  ): string[] {
    const predictions = [];

    // Positive prediction based on engagement
    if (videoAnalysis && videoAnalysis.attentiveness > 0.7) {
      predictions.push("Your high engagement suggests you'll find clarity through discussion");
    }

    // Content-based predictions
    if (userInput.toLowerCase().includes('goal') || userInput.toLowerCase().includes('plan')) {
      predictions.push("Your planning mindset indicates strong follow-through potential");
    }

    // Growth-oriented prediction
    predictions.push("This reflection process will likely lead to valuable insights");

    return predictions.slice(0, 2);
  }

  private identifyGrowthOpportunities(userInput: string, userProfile: any): string[] {
    const opportunities = [];

    if (userInput.toLowerCase().includes('communication')) {
      opportunities.push("Developing more effective communication strategies");
    }
    if (userInput.toLowerCase().includes('stress') || userInput.toLowerCase().includes('pressure')) {
      opportunities.push("Building stronger stress management techniques");
    }
    if (userInput.toLowerCase().includes('decision')) {
      opportunities.push("Enhancing decision-making confidence and clarity");
    }

    if (opportunities.length === 0) {
      opportunities.push("Expanding self-awareness and emotional intelligence");
    }

    return opportunities.slice(0, 2);
  }

  private generatePsychologicalInsights(
    videoAnalysis: VideoAnalysis | null,
    audioAnalysis: AudioAnalysis | null,
    userProfile: any
  ): string[] {
    const insights = [];

    if (videoAnalysis) {
      if (videoAnalysis.attentiveness > 0.8) {
        insights.push("Your focused attention demonstrates strong cognitive engagement");
      }
      
      const dominantEmotion = this.getDominantEmotion(videoAnalysis.facialExpression);
      if (dominantEmotion !== 'neutral') {
        insights.push(`Your ${dominantEmotion} expression shows authentic emotional processing`);
      }
    }

    if (audioAnalysis) {
      if (audioAnalysis.clarity > 0.8) {
        insights.push("Your clear speech patterns indicate organized thinking");
      }
      if (audioAnalysis.sentiment > 0.7) {
        insights.push("Your positive vocal tone suggests resilience and optimism");
      }
    }

    return insights.slice(0, 2);
  }

  private identifyImmediateInterventions(userInput: string): string[] {
    const interventions = [];

    if (userInput.toLowerCase().includes('overwhelmed') || userInput.toLowerCase().includes('stress')) {
      interventions.push("Try the 4-7-8 breathing technique for immediate calm");
    }
    if (userInput.toLowerCase().includes('confused') || userInput.toLowerCase().includes('unclear')) {
      interventions.push("Let's break this down into smaller, manageable parts");
    }
    if (userInput.toLowerCase().includes('angry') || userInput.toLowerCase().includes('frustrated')) {
      interventions.push("Take a moment to acknowledge and validate these feelings");
    }

    return interventions.slice(0, 2);
  }

  private identifySkillDevelopmentOpportunities(userInput: string): string[] {
    const skills = [];

    if (userInput.toLowerCase().includes('communication') || userInput.toLowerCase().includes('express')) {
      skills.push("Communication and emotional expression skills");
    }
    if (userInput.toLowerCase().includes('decision') || userInput.toLowerCase().includes('choice')) {
      skills.push("Decision-making frameworks and confidence building");
    }
    if (userInput.toLowerCase().includes('relationship')) {
      skills.push("Relationship dynamics and boundary setting");
    }

    if (skills.length === 0) {
      skills.push("Emotional regulation and self-awareness");
    }

    return skills.slice(0, 2);
  }

  private buildEnvironmentalContext(
    videoAnalysis: VideoAnalysis | null,
    audioAnalysis: AudioAnalysis | null
  ): string {
    const context = [];
    
    if (videoAnalysis) {
      const dominantEmotion = this.getDominantEmotion(videoAnalysis.facialExpression);
      const emotionIntensity = videoAnalysis.facialExpression[dominantEmotion];
      
      context.push(`Facial emotion: ${dominantEmotion} (${Math.round(emotionIntensity * 100)}%)`);
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

  private buildBehavioralAnalysis(conversationPatterns: any, userProfile: any): string {
    const patterns = [];

    if (userProfile.primaryEmotions && userProfile.primaryEmotions.length > 0) {
      patterns.push(`Primary emotions: ${userProfile.primaryEmotions.join(', ')}`);
    }
    
    if (userProfile.coreValues && userProfile.coreValues.length > 0) {
      patterns.push(`Core values: ${userProfile.coreValues.join(', ')}`);
    }
    
    if (userProfile.communicationStyle) {
      patterns.push(`Communication style: ${userProfile.communicationStyle}`);
    }

    return patterns.length > 0 ? patterns.join('\n') : 'Learning about behavioral patterns...';
  }

  private getBasicFallbackResponse(userInput: string, videoAnalysis: VideoAnalysis | null): LifePartnerResponse {
    let responseText = "I'm here to support you. ";
    
    // Add context-aware response
    if (videoAnalysis) {
      const dominantEmotion = this.getDominantEmotion(videoAnalysis.facialExpression);
      if (dominantEmotion === 'sadness' && videoAnalysis.facialExpression.sadness > 0.4) {
        responseText += "I can see you might be feeling down right now. Your feelings are completely valid, and I'm here to listen. ";
      } else if (dominantEmotion === 'joy' && videoAnalysis.facialExpression.joy > 0.6) {
        responseText += "I love seeing your positive energy! It's wonderful when we can share in these brighter moments. ";
      }
    }
    
    responseText += "What would be most helpful for you right now?";

    return {
      text: responseText,
      emotion: 'supportive',
      priority: 'medium',
      suggestions: [
        "Tell me more about your situation",
        "Share what's on your mind",
        "Ask for specific guidance"
      ],
      followUpQuestions: [
        "How are you feeling about this?",
        "What's the most challenging part?",
        "What support would be helpful?"
      ],
      predictions: ["Talking through this will bring clarity and insight"],
      growthOpportunities: ["Developing greater self-awareness through reflection"],
      psychologicalInsights: videoAnalysis ? [
        `Your ${this.getDominantEmotion(videoAnalysis.facialExpression)} expression shows authentic emotional processing`
      ] : [],
      coachingInterventions: ["Let's explore this step by step together"],
      skillDevelopment: ["Emotional awareness and communication skills"]
    };
  }
}

export const enhancedAIService = EnhancedAIService.getInstance();