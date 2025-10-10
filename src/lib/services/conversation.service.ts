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
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      this.currentUserId = user.id;
      await this.ensureUserProfile(user.id);
    }

    supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        this.currentUserId = session.user.id;
        await this.ensureUserProfile(session.user.id);
      } else {
        this.currentUserId = null;
      }
    });
  }

  private async ensureUserProfile(userId: string): Promise<void> {
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (!profile) {
      await supabase.from('user_profiles').insert({
        id: userId,
        psychological_profile: {},
        behavioral_patterns: {},
        total_decisions: 0,
        consistency_score: 0
      });
    }
  }

  async startNewConversation(title?: string): Promise<string> {
    if (!this.currentUserId) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('conversations')
      .insert({
        user_id: this.currentUserId,
        title: title || 'New Conversation'
      })
      .select()
      .single();

    if (error) throw error;

    this.currentConversationId = data.id;
    this.messages = [];
    geminiService.clearHistory();

    return data.id;
  }

  async loadConversation(conversationId: string): Promise<ConversationSession> {
    const { data: conversation, error: convError } = await supabase
      .from('conversations')
      .select('*')
      .eq('id', conversationId)
      .single();

    if (convError) throw convError;

    const { data: messages, error: msgError } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true });

    if (msgError) throw msgError;

    this.currentConversationId = conversationId;
    this.messages = messages.map(msg => ({
      id: msg.id,
      role: msg.role,
      content: msg.content,
      videoAnalysis: msg.video_analysis,
      sentimentScore: msg.sentiment_score || undefined,
      timestamp: new Date(msg.created_at)
    }));

    return {
      id: conversation.id,
      title: conversation.title,
      messages: this.messages,
      createdAt: new Date(conversation.created_at),
      updatedAt: new Date(conversation.updated_at)
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

    await supabase.from('messages').insert({
      conversation_id: this.currentConversationId!,
      role: 'user',
      content,
      video_analysis: videoAnalysis,
      sentiment_score: sentimentAnalysis.score
    });

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

    await supabase.from('messages').insert({
      conversation_id: this.currentConversationId!,
      role: 'assistant',
      content: aiResponse
    });

    await supabase
      .from('conversations')
      .update({ updated_at: new Date().toISOString() })
      .eq('id', this.currentConversationId!);

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
      throw new Error('User not authenticated');
    }

    const { data: profile } = await supabase
      .from('user_profiles')
      .select('psychological_profile, behavioral_patterns')
      .eq('id', this.currentUserId)
      .single();

    const context: ConversationContext = {
      userProfile: profile?.psychological_profile,
      emotionalState: this.lastVideoAnalysis?.facialExpression
    };

    const analysis = await geminiService.analyzeMoralDilemma(dilemma, context);

    await supabase.from('moral_decisions').insert({
      user_id: this.currentUserId,
      conversation_id: this.currentConversationId,
      dilemma,
      decision: analysis.recommendation,
      ethical_score: analysis.ethicalScore,
      principles_applied: analysis.principlesApplied,
      emotional_state: this.lastVideoAnalysis?.facialExpression || {}
    });

    await supabase
      .from('user_profiles')
      .update({
        total_decisions: (profile?.total_decisions || 0) + 1
      })
      .eq('id', this.currentUserId);

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

    const profile = await geminiService.analyzePsychologicalProfile(interactions);

    await supabase
      .from('user_profiles')
      .update({
        psychological_profile: profile.traits,
        behavioral_patterns: profile.patterns,
        updated_at: new Date().toISOString()
      })
      .eq('id', this.currentUserId);
  }

  async getConversationHistory(): Promise<ConversationSession[]> {
    if (!this.currentUserId) {
      throw new Error('User not authenticated');
    }

    const { data, error } = await supabase
      .from('conversations')
      .select('*')
      .eq('user_id', this.currentUserId)
      .order('updated_at', { ascending: false });

    if (error) throw error;

    return data.map(conv => ({
      id: conv.id,
      title: conv.title,
      messages: [],
      createdAt: new Date(conv.created_at),
      updatedAt: new Date(conv.updated_at)
    }));
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
