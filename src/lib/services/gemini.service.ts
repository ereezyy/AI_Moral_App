let GoogleGenerativeAI: any;
let genAI: any;
let isInitialized = false;

async function initializeGemini() {
  if (isInitialized) return;

  try {
    const module = await import('@google/generative-ai');
    GoogleGenerativeAI = module.GoogleGenerativeAI;

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('Missing Gemini API key');
    }

    genAI = new GoogleGenerativeAI(apiKey);
    isInitialized = true;
  } catch (error) {
    console.error('Failed to initialize Gemini:', error);
    throw error;
  }
}

export interface ConversationContext {
  userProfile?: any;
  emotionalState?: any;
  videoAnalysis?: any;
  previousMessages?: Array<{ role: string; content: string }>;
}

export class GeminiService {
  private static instance: GeminiService;
  private model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
  private conversationHistory: Array<{ role: string; parts: string }> = [];

  private constructor() {}

  static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  async generateResponse(
    userMessage: string,
    context?: ConversationContext
  ): Promise<string> {
    await initializeGemini();

    try {
      const systemContext = this.buildSystemContext(context);

      const chat = this.model.startChat({
        history: this.conversationHistory.map(msg => ({
          role: msg.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: msg.parts }]
        })),
        generationConfig: {
          temperature: 0.9,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
      });

      const fullPrompt = systemContext
        ? `${systemContext}\n\nUser: ${userMessage}`
        : userMessage;

      const result = await chat.sendMessage(fullPrompt);
      const response = result.response.text();

      this.conversationHistory.push({ role: 'user', parts: userMessage });
      this.conversationHistory.push({ role: 'assistant', parts: response });

      if (this.conversationHistory.length > 20) {
        this.conversationHistory = this.conversationHistory.slice(-20);
      }

      return response;
    } catch (error) {
      console.error('Gemini API error:', error);
      throw new Error('Failed to generate AI response');
    }
  }

  async analyzeSentiment(text: string): Promise<{
    score: number;
    emotions: Record<string, number>;
    overall: string;
  }> {
    await initializeGemini();

    try {
      const prompt = `Analyze the sentiment and emotions in the following text. Return a JSON object with:
- score: a number from -1 (very negative) to 1 (very positive)
- emotions: an object with emotion names as keys and confidence scores (0-1) as values
- overall: a brief description of the overall emotional tone

Text: "${text}"

Return ONLY valid JSON, no markdown or explanation.`;

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();

      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return {
        score: 0,
        emotions: { neutral: 1 },
        overall: 'neutral'
      };
    } catch (error) {
      console.error('Sentiment analysis error:', error);
      return {
        score: 0,
        emotions: { neutral: 1 },
        overall: 'neutral'
      };
    }
  }

  async analyzeMoralDilemma(dilemma: string, context?: ConversationContext): Promise<{
    ethicalScore: number;
    principlesApplied: string[];
    recommendation: string;
    consequences: string[];
  }> {
    await initializeGemini();

    try {
      const prompt = `As an AI ethics advisor, analyze this moral dilemma:

"${dilemma}"

${context?.userProfile ? `User's psychological profile: ${JSON.stringify(context.userProfile)}` : ''}
${context?.emotionalState ? `Current emotional state: ${JSON.stringify(context.emotionalState)}` : ''}

Provide a thorough ethical analysis in JSON format:
{
  "ethicalScore": <number 0-100>,
  "principlesApplied": [<list of ethical principles like "autonomy", "beneficence", "justice", etc.>],
  "recommendation": "<your recommendation>",
  "consequences": [<list of potential consequences>]
}

Return ONLY valid JSON.`;

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();

      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return {
        ethicalScore: 50,
        principlesApplied: ['unknown'],
        recommendation: 'Unable to analyze',
        consequences: []
      };
    } catch (error) {
      console.error('Moral analysis error:', error);
      throw new Error('Failed to analyze moral dilemma');
    }
  }

  async analyzePsychologicalProfile(
    interactions: Array<{ content: string; sentiment: number }>
  ): Promise<{
    traits: Record<string, number>;
    patterns: string[];
    insights: string;
  }> {
    await initializeGemini();

    try {
      const interactionSummary = interactions
        .slice(-10)
        .map(i => `Content: "${i.content}" (Sentiment: ${i.sentiment})`)
        .join('\n');

      const prompt = `Based on these user interactions, create a psychological profile:

${interactionSummary}

Return JSON with:
{
  "traits": {<personality traits with scores 0-1>},
  "patterns": [<observed behavioral patterns>],
  "insights": "<overall psychological insights>"
}

Return ONLY valid JSON.`;

      const result = await this.model.generateContent(prompt);
      const response = result.response.text();

      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }

      return {
        traits: {},
        patterns: [],
        insights: 'Insufficient data'
      };
    } catch (error) {
      console.error('Psychological profile error:', error);
      throw new Error('Failed to analyze psychological profile');
    }
  }

  clearHistory(): void {
    this.conversationHistory = [];
  }

  private buildSystemContext(context?: ConversationContext): string {
    if (!context) return '';

    const parts: string[] = [];

    if (context.userProfile) {
      parts.push(`User Profile: ${JSON.stringify(context.userProfile)}`);
    }

    if (context.emotionalState) {
      parts.push(`Current Emotional State: ${JSON.stringify(context.emotionalState)}`);
    }

    if (context.videoAnalysis) {
      parts.push(`Video Analysis: ${JSON.stringify(context.videoAnalysis)}`);
    }

    return parts.length > 0
      ? `Context:\n${parts.join('\n')}\n\n`
      : '';
  }
}

export const geminiService = GeminiService.getInstance();
