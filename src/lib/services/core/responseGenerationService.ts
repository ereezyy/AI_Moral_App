import { CentralizedErrorHandler } from '../../utils/error/centralizedErrorHandler';
import { analysisService, type AnalysisResult } from './analysisService';
import { conversationService } from '../conversationService';

export interface ResponseGenerationRequest {
  userInput: string;
  analysisResult: AnalysisResult;
  conversationHistory: any[];
  userProfile: any;
}

export interface GeneratedResponse {
  mainText: string;
  emotionType: 'supportive' | 'encouraging' | 'concerned' | 'excited' | 'thoughtful';
  priorityLevel: 'low' | 'medium' | 'high' | 'urgent';
  quickSuggestions: string[];
  followUpQuestions: string[];
  additionalInsights: string[];
}

export class ResponseGenerationService {
  private static instance: ResponseGenerationService;

  private constructor() {}

  static getInstance(): ResponseGenerationService {
    if (!ResponseGenerationService.instance) {
      ResponseGenerationService.instance = new ResponseGenerationService();
    }
    return ResponseGenerationService.instance;
  }

  async generateResponse(request: ResponseGenerationRequest): Promise<GeneratedResponse | undefined> {
    return await CentralizedErrorHandler.handleAsync(
      async () => {
        const mainText = this.createMainResponse(request);
        const emotionType = this.determineEmotionType(request);
        const priorityLevel = this.calculatePriorityLevel(request);
        const quickSuggestions = this.createQuickSuggestions(request);
        const followUpQuestions = this.createFollowUpQuestions(request);
        const additionalInsights = this.generateAdditionalInsights(request);

        return {
          mainText,
          emotionType,
          priorityLevel,
          quickSuggestions,
          followUpQuestions,
          additionalInsights
        };
      },
      {
        operation: 'generateResponse',
        component: 'ResponseGenerationService',
        timestamp: Date.now()
      },
      { fallbackValue: this.getDefaultResponse() }
    );
  }

  private createMainResponse(request: ResponseGenerationRequest): string {
    const { analysisResult, userInput } = request;
    
    let responseText = this.getGreeting(analysisResult.emotionalState);
    responseText += this.addContextualResponse(analysisResult, userInput);
    responseText += this.addGuidanceBasedOnRisk(analysisResult.riskLevel);
    
    return responseText;
  }

  private getGreeting(emotionalState: string): string {
    const greetings = {
      joy: "I can see you're feeling positive about this! ",
      sadness: "I sense this is weighing on you. ",
      anger: "This seems to be bringing up some strong feelings. ",
      fear: "I understand this might feel uncertain or concerning. ",
      neutral: "I'm here to help you work through this. "
    };
    
    return greetings[emotionalState as keyof typeof greetings] || greetings.neutral;
  }

  private addContextualResponse(result: AnalysisResult, userInput: string): string {
    if (result.ethicalScore > 0.8) {
      return "Your approach shows strong ethical reasoning. ";
    } else if (result.ethicalScore < 0.5) {
      return "Let's explore some different perspectives on this situation. ";
    }
    return "This is a thoughtful question that deserves careful consideration. ";
  }

  private addGuidanceBasedOnRisk(riskLevel: number): string {
    if (riskLevel > 0.7) {
      return "This seems like a significant situation that warrants extra care and possibly some additional support.";
    } else if (riskLevel > 0.4) {
      return "There are some important factors to consider as you move forward.";
    }
    return "You seem to be handling this well, and I'm here to support your continued growth.";
  }

  private determineEmotionType(request: ResponseGenerationRequest): GeneratedResponse['emotionType'] {
    const { analysisResult } = request;
    
    if (analysisResult.riskLevel > 0.6) return 'concerned';
    if (analysisResult.ethicalScore > 0.8) return 'encouraging';
    if (analysisResult.emotionalState === 'joy') return 'excited';
    if (request.userInput.includes('think') || request.userInput.includes('consider')) return 'thoughtful';
    
    return 'supportive';
  }

  private calculatePriorityLevel(request: ResponseGenerationRequest): GeneratedResponse['priorityLevel'] {
    const { analysisResult, userInput } = request;
    
    if (analysisResult.riskLevel > 0.8) return 'urgent';
    if (analysisResult.riskLevel > 0.6) return 'high';
    if (userInput.includes('important') || userInput.includes('urgent')) return 'high';
    
    return 'medium';
  }

  private createQuickSuggestions(request: ResponseGenerationRequest): string[] {
    const suggestions = [];
    const { analysisResult } = request;
    
    if (analysisResult.ethicalScore < 0.6) {
      suggestions.push("Let's explore different ethical perspectives");
      suggestions.push("Tell me about your core values");
    }
    
    if (analysisResult.riskLevel > 0.5) {
      suggestions.push("Share more about what's concerning you");
      suggestions.push("Let's identify your support systems");
    } else {
      suggestions.push("Tell me more about your thoughts");
      suggestions.push("How does this connect to your goals?");
    }
    
    return suggestions.slice(0, 3);
  }

  private createFollowUpQuestions(request: ResponseGenerationRequest): string[] {
    const questions = [];
    const { analysisResult, userInput } = request;
    
    questions.push("How are you feeling about this situation?");
    
    if (analysisResult.emotionalState !== 'neutral') {
      questions.push("What emotions are strongest for you right now?");
    }
    
    if (request.userInput.includes('decision') || request.userInput.includes('choice')) {
      questions.push("What factors are most important in making this decision?");
    } else {
      questions.push("What would help you feel more confident about this?");
    }
    
    return questions.slice(0, 3);
  }

  private generateAdditionalInsights(request: ResponseGenerationRequest): string[] {
    return request.analysisResult.insights || [];
  }

  private getDefaultResponse(): GeneratedResponse {
    return {
      mainText: "I'm here to support you. Let's talk through whatever is on your mind.",
      emotionType: 'supportive',
      priorityLevel: 'medium',
      quickSuggestions: ["Tell me more about your situation", "Share what's concerning you"],
      followUpQuestions: ["How can I best support you right now?"],
      additionalInsights: []
    };
  }
}

export const responseGenerationService = ResponseGenerationService.getInstance();