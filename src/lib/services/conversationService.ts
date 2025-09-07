interface ConversationMessage {
  id: string;
  timestamp: number;
  type: 'user' | 'assistant';
  content: string;
  context?: {
    emotional?: any;
    environmental?: string[];
    analysis?: any;
  };
}

interface ConversationMemory {
  messages: ConversationMessage[];
  userProfile: {
    name?: string;
    preferences: string[];
    concerns: string[];
    goals: string[];
    emotionalPatterns: Record<string, number>;
  };
  contextualInsights: {
    frequentEmotions: string[];
    commonSituations: string[];
    progressTracking: Record<string, any>;
  };
}

class ConversationService {
  private static instance: ConversationService;
  private memory: ConversationMemory;
  private maxMessages = 100;

  private constructor() {
    this.memory = this.loadMemory() || {
      messages: [],
      userProfile: {
        preferences: [],
        concerns: [],
        goals: [],
        emotionalPatterns: {}
      },
      contextualInsights: {
        frequentEmotions: [],
        commonSituations: [],
        progressTracking: {}
      }
    };
  }

  static getInstance(): ConversationService {
    if (!ConversationService.instance) {
      ConversationService.instance = new ConversationService();
    }
    return ConversationService.instance;
  }

  addMessage(
    type: 'user' | 'assistant',
    content: string,
    context?: ConversationMessage['context']
  ): ConversationMessage {
    const message: ConversationMessage = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      type,
      content,
      context
    };

    this.memory.messages.push(message);
    
    if (this.memory.messages.length > this.maxMessages) {
      this.memory.messages.shift();
    }

    this.updateUserProfile(message);
    this.saveMemory();
    
    return message;
  }

  getConversationHistory(limit: number = 10): ConversationMessage[] {
    return this.memory.messages.slice(-limit);
  }

  getContextualPrompt(): string {
    const recentMessages = this.getConversationHistory(5);
    const userProfile = this.memory.userProfile;
    const insights = this.memory.contextualInsights;

    return `
CONVERSATION CONTEXT:
Previous messages: ${recentMessages.map(m => `${m.type}: ${m.content}`).join('\n')}

USER PROFILE:
- Preferences: ${userProfile.preferences.join(', ') || 'Learning...'}
- Current concerns: ${userProfile.concerns.join(', ') || 'None identified'}
- Goals: ${userProfile.goals.join(', ') || 'Exploring...'}
- Emotional patterns: ${Object.entries(userProfile.emotionalPatterns).map(([e, v]) => `${e}: ${v}`).join(', ')}

INSIGHTS:
- Frequent emotions: ${insights.frequentEmotions.join(', ')}
- Common situations: ${insights.commonSituations.join(', ')}

PERSONALITY: You are a caring, intelligent AI companion. Be warm, supportive, and insightful. 
Offer practical advice while being emotionally supportive. Reference previous conversations naturally.
Use the user's name if known. Be conversational and personal, not formal or robotic.
    `;
  }

  private updateUserProfile(message: ConversationMessage) {
    if (message.type === 'user') {
      // Extract goals, concerns, preferences from user messages
      const content = message.content.toLowerCase();
      
      // Simple keyword detection for goals
      if (content.includes('want to') || content.includes('goal') || content.includes('achieve')) {
        const goal = message.content.substring(0, 100);
        if (!this.memory.userProfile.goals.includes(goal)) {
          this.memory.userProfile.goals.push(goal);
        }
      }
      
      // Track emotional context
      if (message.context?.emotional) {
        const emotions = Object.entries(message.context.emotional)
          .filter(([_, value]) => (value as number) > 0.4)
          .map(([emotion, _]) => emotion);
        
        emotions.forEach(emotion => {
          this.memory.userProfile.emotionalPatterns[emotion] = 
            (this.memory.userProfile.emotionalPatterns[emotion] || 0) + 1;
        });
      }
    }
  }

  private loadMemory(): ConversationMemory | null {
    try {
      const saved = localStorage.getItem('aiLifePartner_memory');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }

  private saveMemory(): void {
    try {
      localStorage.setItem('aiLifePartner_memory', JSON.stringify(this.memory));
    } catch (error) {
      console.warn('Failed to save conversation memory:', error);
    }
  }

  clearMemory(): void {
    this.memory = {
      messages: [],
      userProfile: {
        preferences: [],
        concerns: [],
        goals: [],
        emotionalPatterns: {}
      },
      contextualInsights: {
        frequentEmotions: [],
        commonSituations: [],
        progressTracking: {}
      }
    };
    this.saveMemory();
  }

  getUserProfile() {
    return { ...this.memory.userProfile };
  }

  getInsights() {
    return { ...this.memory.contextualInsights };
  }
}

export const conversationService = ConversationService.getInstance();