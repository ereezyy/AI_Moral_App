import { aiService } from './aiService';
import { conversationService } from './conversationService';
import { speechService } from './speechService';
import type { VideoAnalysis, AudioAnalysis, SituationalContext } from '../types';

interface LifePartnerResponse {
  text: string;
  emotion: 'supportive' | 'encouraging' | 'concerned' | 'excited' | 'thoughtful';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  suggestions: string[];
  followUpQuestions: string[];
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
    // Add user message to conversation memory
    conversationService.addMessage('user', userInput, {
      emotional: videoAnalysis?.facialExpression,
      environmental: videoAnalysis?.environmentalContext,
      analysis: { video: videoAnalysis, audio: audioAnalysis }
    });

    // Create enhanced prompt with conversation context
    const contextualPrompt = conversationService.getContextualPrompt();
    const environmentalContext = this.buildEnvironmentalContext(videoAnalysis, audioAnalysis);
    
    const enhancedPrompt = `
${contextualPrompt}

CURRENT ENVIRONMENT ANALYSIS:
${environmentalContext}

CURRENT USER INPUT: "${userInput}"

Respond as a caring AI life partner. Be personal, supportive, and insightful. 
Reference previous conversations naturally. Offer specific, actionable advice.
Consider the user's emotional state and environment. Be conversational and warm.

Provide your response in this JSON format:
{
  "text": "Your main response (be conversational and personal)",
  "emotion": "supportive|encouraging|concerned|excited|thoughtful", 
  "priority": "low|medium|high|urgent",
  "suggestions": ["specific actionable suggestion 1", "suggestion 2"],
  "followUpQuestions": ["natural follow-up question 1", "question 2"]
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
    
    let responseText = "I'm here for you. ";
    
    if (videoAnalysis) {
      const dominantEmotion = Object.entries(videoAnalysis.facialExpression)
        .reduce((a, b) => a[1] > b[1] ? a : b)[0];
      
      if (dominantEmotion === 'sadness' && videoAnalysis.facialExpression.sadness > 0.4) {
        responseText += "I can see you might be feeling down right now. That's completely okay - we all have those moments. ";
      } else if (dominantEmotion === 'joy' && videoAnalysis.facialExpression.joy > 0.6) {
        responseText += "I love seeing you happy! Your positive energy is wonderful. ";
      } else if (dominantEmotion === 'anger' && videoAnalysis.facialExpression.anger > 0.4) {
        responseText += "I sense some frustration. Let's work through whatever is bothering you. ";
      }
    }
    
    if (recentMessages.length > 0) {
      responseText += "Based on our conversations, I want to help you continue growing. ";
    }
    
    responseText += "What's most important to you right now?";
    
    return {
      text: responseText,
      emotion: 'supportive',
      priority: 'medium',
      suggestions: [
        "Take a moment to breathe and center yourself",
        "Share what's really on your mind",
        "Let's break down what you're dealing with"
      ],
      followUpQuestions: [
        "What's the most challenging part of your day so far?",
        "Is there something specific you'd like guidance on?"
      ]
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
}

export const enhancedAIService = EnhancedAIService.getInstance();