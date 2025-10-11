import { xaiService } from './xai.service';
import { localChatService } from './localChat.service';

export interface ConversationContext {
  userProfile?: any;
  emotionalState?: any;
  videoAnalysis?: any;
  previousMessages?: Array<{ role: string; content: string }>;
}

export class SmartChatService {
  private static instance: SmartChatService;
  private useLocalFallback = false;
  private failureCount = 0;
  private readonly MAX_FAILURES = 2;

  private constructor() {}

  static getInstance(): SmartChatService {
    if (!SmartChatService.instance) {
      SmartChatService.instance = new SmartChatService();
    }
    return SmartChatService.instance;
  }

  async generateResponse(
    userMessage: string,
    context?: ConversationContext
  ): Promise<string> {
    if (this.useLocalFallback) {
      console.log('Using local fallback (API unavailable)');
      return localChatService.generateResponse(userMessage, context);
    }

    try {
      const response = await xaiService.generateResponse(userMessage, context);

      if (response.includes("I hear you") || response.includes("Tell me more")) {
        this.failureCount++;
        if (this.failureCount >= this.MAX_FAILURES) {
          console.warn(`XAI API failed ${this.failureCount} times, switching to local fallback`);
          this.useLocalFallback = true;
          return localChatService.generateResponse(userMessage, context);
        }
      } else {
        this.failureCount = 0;
      }

      return response;
    } catch (error) {
      this.failureCount++;
      console.error('XAI service error, using local fallback:', error);

      if (this.failureCount >= this.MAX_FAILURES) {
        this.useLocalFallback = true;
      }

      return localChatService.generateResponse(userMessage, context);
    }
  }

  async analyzeSentiment(text: string): Promise<{
    score: number;
    emotions: Record<string, number>;
  }> {
    if (this.useLocalFallback) {
      return localChatService.analyzeSentiment(text);
    }

    try {
      return await xaiService.analyzeSentiment(text);
    } catch (error) {
      console.error('Sentiment analysis error, using local fallback');
      return localChatService.analyzeSentiment(text);
    }
  }

  clearHistory(): void {
    if (this.useLocalFallback) {
      localChatService.clearHistory();
    } else {
      xaiService.clearHistory();
    }
  }

  async analyzePsychologicalProfile(interactions: any[]): Promise<void> {
    if (this.useLocalFallback) {
      return localChatService.analyzePsychologicalProfile(interactions);
    }

    try {
      return await xaiService.analyzePsychologicalProfile(interactions);
    } catch (error) {
      console.error('Profile analysis error, using local fallback');
      return localChatService.analyzePsychologicalProfile(interactions);
    }
  }

  resetFailureCount(): void {
    this.failureCount = 0;
    this.useLocalFallback = false;
  }

  isUsingLocalFallback(): boolean {
    return this.useLocalFallback;
  }
}

export const smartChatService = SmartChatService.getInstance();
