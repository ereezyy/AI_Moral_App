import { supabase } from '../supabase';
import { geminiService, ConversationContext } from './gemini.service';
import { speechService } from './speech.service';
import { mediaPipeService, VideoAnalysisResult } from './mediapipe.service';

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  videoAnalysis?: VideoAnalysisResult | null;
  sentimentScore?: number;
  timestamp: Date;
}

export interface ConversationSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export class ConversationService {
  private static instance: ConversationService;
  private currentConversationId: string | null = null;
  private currentUserId: string | null = null;
  private messages: Message[] = [];
  private videoAnalysisEnabled = false;
  private lastVideoAnalysis: VideoAnalysisResult | null = null;

  private constructor() {
    this.initializeAuth();
  }

  static getInstance(): ConversationService {
    if (!ConversationService.instance) {
      ConversationService.instance = new ConversationService();
    }
    return ConversationService.instance;
  }

  private async initializeAuth(): Promise<void> {
    this.currentUserId = 'demo-user-' + Date.now();
  }

  async startNewConversation(title?: string): Promise<string> {
    if (!this.currentUserId) {
      await this.initializeAuth();
    }

    this.currentConversationId = crypto.randomUUID();
    this.messages = [];
    geminiService.clearHistory();

    return this.currentConversationId;
  }

  async loadConversation(conversationId: string): Promise<ConversationSession> {
    return {
      id: conversationId,
      title: 'Conversation',
      messages: this.messages,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async sendMessage(
    content: string,
    options?: {
      useVideoAnalysis?: boolean;
      videoElement?: HTMLVideoElement;
    }
  ): Promise<Message> {
    if (!this.currentConversationId) {
      await this.startNewConversation();
    }

    let videoAnalysis: VideoAnalysisResult | null = null;
    if (options?.useVideoAnalysis && options?.videoElement) {
      videoAnalysis = await mediaPipeService.analyzeVideoFrame(options.videoElement);
      this.lastVideoAnalysis = videoAnalysis;
    }

    const sentimentAnalysis = await geminiService.analyzeSentiment(content);

    const userMessage: Message = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      videoAnalysis,
      sentimentScore: sentimentAnalysis.score,
      timestamp: new Date()
    };

    this.messages.push(userMessage);

    const context: ConversationContext = {
      emotionalState: sentimentAnalysis.emotions,
      videoAnalysis,
      previousMessages: this.messages.slice(-5).map(m => ({
        role: m.role,
        content: m.content
      }))
    };

    const aiResponse = await geminiService.generateResponse(content, context);

    const assistantMessage: Message = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: aiResponse,
      timestamp: new Date()
    };

    this.messages.push(assistantMessage);

    return assistantMessage;
  }

  async sendVoiceMessage(
    onTranscript?: (text: string, isFinal: boolean) => void
  ): Promise<void> {
    return speechService.startListening(
      async (text, isFinal) => {
        if (onTranscript) {
          onTranscript(text, isFinal);
        }

        if (isFinal && text.trim()) {
          await this.sendMessage(text);
        }
      },
      (error) => {
        console.error('Speech recognition error:', error);
      }
    );
  }

  stopVoiceInput(): void {
    speechService.stopListening();
  }

  async speakMessage(content: string): Promise<void> {
    return speechService.speak(content);
  }

  async analyzeMoralDilemma(dilemma: string): Promise<{
    ethicalScore: number;
    principlesApplied: string[];
    recommendation: string;
    consequences: string[];
  }> {
    if (!this.currentUserId) {
      await this.initializeAuth();
    }

    const context: ConversationContext = {
      emotionalState: this.lastVideoAnalysis?.facialExpression
    };

    const analysis = await geminiService.analyzeMoralDilemma(dilemma, context);

    return analysis;
  }

  async updatePsychologicalProfile(): Promise<void> {
    if (!this.currentUserId) return;

    const interactions = this.messages
      .filter(m => m.role === 'user')
      .map(m => ({
        content: m.content,
        sentiment: m.sentimentScore || 0
      }));

    if (interactions.length < 3) return;

    await geminiService.analyzePsychologicalProfile(interactions);
  }

  async getConversationHistory(): Promise<ConversationSession[]> {
    return [];
  }

  getCurrentMessages(): Message[] {
    return this.messages;
  }

  getCurrentConversationId(): string | null {
    return this.currentConversationId;
  }

  getLastVideoAnalysis(): VideoAnalysisResult | null {
    return this.lastVideoAnalysis;
  }

  enableVideoAnalysis(enabled: boolean): void {
    this.videoAnalysisEnabled = enabled;
  }

  isVideoAnalysisEnabled(): boolean {
    return this.videoAnalysisEnabled;
  }
}

export const conversationService = ConversationService.getInstance();
