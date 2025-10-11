export interface ConversationContext {
  userProfile?: any;
  emotionalState?: any;
  videoAnalysis?: any;
  previousMessages?: Array<{ role: string; content: string }>;
}

export class LocalChatService {
  private static instance: LocalChatService;
  private conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = [];

  private constructor() {}

  static getInstance(): LocalChatService {
    if (!LocalChatService.instance) {
      LocalChatService.instance = new LocalChatService();
    }
    return LocalChatService.instance;
  }

  async generateResponse(
    userMessage: string,
    context?: ConversationContext
  ): Promise<string> {
    const lowerMessage = userMessage.toLowerCase();
    let response = '';

    if (this.isGreeting(lowerMessage)) {
      response = this.getGreetingResponse();
    } else if (this.needsEmotionalSupport(lowerMessage)) {
      response = this.getEmotionalSupportResponse(lowerMessage, context);
    } else if (this.isSeekingAdvice(lowerMessage)) {
      response = this.getAdviceResponse(lowerMessage);
    } else if (this.isEthicalQuestion(lowerMessage)) {
      response = this.getEthicalGuidance(lowerMessage);
    } else if (this.isAboutFeelings(lowerMessage)) {
      response = this.getFeelingsResponse();
    } else {
      response = this.getReflectiveResponse(lowerMessage, context);
    }

    this.conversationHistory.push({ role: 'user', content: userMessage });
    this.conversationHistory.push({ role: 'assistant', content: response });

    if (this.conversationHistory.length > 20) {
      this.conversationHistory = this.conversationHistory.slice(-20);
    }

    return response;
  }

  private isGreeting(message: string): boolean {
    const greetings = ['hello', 'hi ', 'hey', 'good morning', 'good afternoon', 'good evening'];
    return greetings.some(g => message.includes(g));
  }

  private needsEmotionalSupport(message: string): boolean {
    const keywords = ['sad', 'depressed', 'anxious', 'worried', 'scared', 'lonely', 'hurt', 'crying', 'upset', 'angry', 'frustrated', 'stressed'];
    return keywords.some(k => message.includes(k));
  }

  private isSeekingAdvice(message: string): boolean {
    const keywords = ['should i', 'what should', 'help me decide', 'advice', 'recommend', 'suggest'];
    return keywords.some(k => message.includes(k));
  }

  private isEthicalQuestion(message: string): boolean {
    const keywords = ['right', 'wrong', 'moral', 'ethical', 'should', 'dilemma', 'fair'];
    return keywords.some(k => message.includes(k));
  }

  private isAboutFeelings(message: string): boolean {
    const keywords = ['feel', 'feeling', 'emotion', 'how am i', 'why do i'];
    return keywords.some(k => message.includes(k));
  }

  private getGreetingResponse(): string {
    const responses = [
      "Hello! I'm here to listen and support you. What's on your mind today?",
      "Hi there! How are you feeling? I'm here to talk about whatever you need.",
      "Hey! It's good to hear from you. What would you like to explore together?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getEmotionalSupportResponse(message: string, context?: ConversationContext): string {
    const responses = [
      "I hear that you're going through something difficult, and that's completely valid. Would you like to talk about what's weighing on you?",
      "It takes courage to acknowledge these feelings. I'm here with you. What would support you most right now?",
      "Thank you for sharing what you're experiencing. I'm listening. What else is on your heart?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getAdviceResponse(message: string): string {
    const responses = [
      "That's an important decision. What feels most aligned with your values? What would you be proud of looking back?",
      "Let's explore this together. What are the potential outcomes of each choice? Which aligns best with who you want to be?",
      "This is worth thoughtful consideration. What matters most to you in this situation?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getEthicalGuidance(message: string): string {
    const responses = [
      "Ethical questions rarely have simple answers. Let's consider: Who is affected by this decision? What are their perspectives?",
      "This touches on important values. What principles feel most important to you here - fairness, compassion, or honesty?",
      "Let's think through consequences. If you chose this path, how might it affect everyone involved?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getFeelingsResponse(): string {
    const responses = [
      "Feelings can be complex and layered. What sensations do you notice right now?",
      "It's valuable that you're exploring your feelings. What do you think they're trying to tell you?",
      "Emotions aren't right or wrong - they just are. What do you think this feeling is pointing toward?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  private getReflectiveResponse(message: string, context?: ConversationContext): string {
    const responses = [
      "That's interesting. Tell me more about that - what makes this significant to you?",
      "I'm listening. What else comes to mind when you think about this?",
      "Thank you for sharing that perspective. What feels most important about this right now?",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  }

  async analyzeSentiment(text: string): Promise<{
    score: number;
    emotions: Record<string, number>;
  }> {
    const emotionPatterns = {
      joy: /\b(happy|excited|great|wonderful|amazing|love|joy|glad)\b/gi,
      sadness: /\b(sad|depressed|down|unhappy|miserable|hurt)\b/gi,
      anger: /\b(angry|mad|furious|frustrated|annoyed|irritated)\b/gi,
      fear: /\b(scared|afraid|worried|anxious|nervous|fear)\b/gi,
      neutral: /\b(okay|fine|alright|normal|average)\b/gi
    };

    const emotions: Record<string, number> = {};
    let positiveScore = 0;
    let negativeScore = 0;

    for (const [emotion, pattern] of Object.entries(emotionPatterns)) {
      const matches = text.match(pattern);
      const count = matches ? matches.length : 0;

      if (count > 0) {
        emotions[emotion] = Math.min(count * 0.3, 1);

        if (emotion === 'joy') positiveScore += count * 0.4;
        else if (emotion === 'neutral') positiveScore += count * 0.1;
        else negativeScore += count * 0.3;
      }
    }

    const totalScore = positiveScore + negativeScore;
    const score = totalScore > 0 ? positiveScore / totalScore : 0.5;

    return { score, emotions };
  }

  clearHistory(): void {
    this.conversationHistory = [];
  }

  async analyzePsychologicalProfile(interactions: any[]): Promise<void> {
    console.log('Local psychological profile analysis:', interactions.length, 'interactions');
  }
}

export const localChatService = LocalChatService.getInstance();
