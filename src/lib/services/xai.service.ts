const XAI_API_KEY = import.meta.env.VITE_XAI_API_KEY;
const XAI_API_URL = 'https://api.x.ai/v1';

export interface ConversationContext {
  userProfile?: any;
  emotionalState?: any;
  videoAnalysis?: any;
  previousMessages?: Array<{ role: string; content: string }>;
}

export class XAIService {
  private static instance: XAIService;
  private conversationHistory: Array<{ role: 'user' | 'assistant' | 'system'; content: string }> = [];

  private constructor() {}

  static getInstance(): XAIService {
    if (!XAIService.instance) {
      XAIService.instance = new XAIService();
    }
    return XAIService.instance;
  }

  async generateResponse(
    userMessage: string,
    context?: ConversationContext
  ): Promise<string> {
    try {
      const systemMessage = this.buildSystemMessage(context);

      const messages = [
        { role: 'system' as const, content: systemMessage },
        ...this.conversationHistory.slice(-10),
        { role: 'user' as const, content: userMessage }
      ];

      const response = await fetch(`${XAI_API_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${XAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'grok-beta',
          messages,
          temperature: 0.8,
          max_tokens: 1024,
          stream: false
        })
      });

      if (!response.ok) {
        console.error('XAI API error:', response.status);
        return this.getFallbackResponse(userMessage);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || this.getFallbackResponse(userMessage);

      this.conversationHistory.push({ role: 'user', content: userMessage });
      this.conversationHistory.push({ role: 'assistant', content: aiResponse });

      if (this.conversationHistory.length > 20) {
        this.conversationHistory = this.conversationHistory.slice(-20);
      }

      return aiResponse;
    } catch (error) {
      console.error('XAI service error:', error);
      const fallback = this.getFallbackResponse(userMessage);
      this.conversationHistory.push({ role: 'user', content: userMessage });
      this.conversationHistory.push({ role: 'assistant', content: fallback });
      return fallback;
    }
  }

  private buildSystemMessage(context?: ConversationContext): string {
    let systemPrompt = `You are a compassionate AI life companion and ethical advisor. Your role is to:

1. Listen deeply and respond with empathy
2. Help users navigate moral and ethical decisions
3. Provide thoughtful guidance without being judgmental
4. Ask clarifying questions to understand situations better
5. Consider multiple perspectives and potential consequences
6. Support personal growth and self-reflection

Be warm, supportive, and conversational. Keep responses concise but meaningful.`;

    if (context?.emotionalState) {
      const emotions = Object.entries(context.emotionalState)
        .filter(([_, value]) => (value as number) > 0.3)
        .map(([emotion]) => emotion)
        .join(', ');

      if (emotions) {
        systemPrompt += `\n\nCurrent emotional state detected: ${emotions}. Respond with appropriate sensitivity.`;
      }
    }

    if (context?.videoAnalysis) {
      systemPrompt += `\n\nFacial expression detected: ${context.videoAnalysis.expression || 'neutral'}. Consider this in your response.`;
    }

    return systemPrompt;
  }

  async analyzeSentiment(text: string): Promise<{
    score: number;
    emotions: Record<string, number>;
  }> {
    const emotionKeywords = {
      joy: ['happy', 'excited', 'great', 'wonderful', 'amazing', 'love', 'joy'],
      sadness: ['sad', 'depressed', 'down', 'unhappy', 'miserable', 'hurt'],
      anger: ['angry', 'mad', 'furious', 'frustrated', 'annoyed', 'irritated'],
      fear: ['scared', 'afraid', 'worried', 'anxious', 'nervous', 'fear'],
      neutral: ['okay', 'fine', 'alright', 'normal', 'average']
    };

    const lowerText = text.toLowerCase();
    const emotions: Record<string, number> = {};
    let totalScore = 0;
    let matches = 0;

    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      const matchCount = keywords.filter(keyword => lowerText.includes(keyword)).length;
      if (matchCount > 0) {
        emotions[emotion] = Math.min(matchCount / keywords.length, 1);
        totalScore += emotions[emotion] * (emotion === 'joy' ? 1 : emotion === 'neutral' ? 0.5 : 0);
        matches++;
      }
    }

    const score = matches > 0 ? totalScore / matches : 0.5;

    return { score, emotions };
  }

  clearHistory(): void {
    this.conversationHistory = [];
  }

  private getFallbackResponse(userMessage: string): string {
    const responses = [
      "I hear you. Tell me more about what you're experiencing right now.",
      "That's an important point. What matters most to you in this situation?",
      "I'm listening. How are you feeling about all of this?",
      "Thank you for sharing that with me. What would help you most right now?",
      "I understand. What do you think would be the best path forward?"
    ];

    return responses[Math.floor(Math.random() * responses.length)];
  }

  async analyzePsychologicalProfile(interactions: any[]): Promise<void> {
    console.log('Psychological profile analysis', interactions.length, 'interactions');
  }
}

export const xaiService = XAIService.getInstance();
