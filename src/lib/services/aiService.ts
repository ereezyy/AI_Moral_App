interface MoralAnalysisRequest {
  situation: string;
  context: {
    emotional: any;
    environmental: string[];
    social: any;
  };
}

interface AIResponse {
  ethicalAlignment: number;
  conflictingValues: string[];
  potentialConsequences: {
    shortTerm: string[];
    longTerm: string[];
  };
  recommendedActions: string[];
  moralPrinciples: Array<{ principle: string; relevance: number }>;
  reasoning: string;
}

class AIService {
  private static instance: AIService;
  private geminiApiKey: string;
  private xaiApiKey: string;
  private xaiApiSecret: string;

  private constructor() {
    this.geminiApiKey = import.meta.env.VITE_GEMINI_API_KEY;
    this.xaiApiKey = import.meta.env.VITE_XAI_API_KEY;
    this.xaiApiSecret = import.meta.env.VITE_XAI_API_SECRET;

    if (!this.geminiApiKey) {
      console.warn('Gemini API key not found. Using fallback responses.');
    }
    if (!this.xaiApiKey) {
      console.warn('XAI API key not found. Using fallback responses.');
    }
  }

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async analyzeMoralSituation(request: MoralAnalysisRequest): Promise<AIResponse> {
    try {
      // Try Gemini first, fallback to XAI, then mock
      if (this.geminiApiKey) {
        return await this.analyzeWithGemini(request);
      } else if (this.xaiApiKey) {
        return await this.analyzeWithXAI(request);
      } else {
        return this.getFallbackResponse(request);
      }
    } catch (error) {
      console.error('AI Analysis failed, using fallback:', error);
      return this.getFallbackResponse(request);
    }
  }

  private async analyzeWithGemini(request: MoralAnalysisRequest): Promise<AIResponse> {
    const prompt = this.buildMoralAnalysisPrompt(request);
    
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${this.geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Gemini API error: ${response.status}`);
    }

    const data = await response.json();
    return this.parseGeminiResponse(data.candidates[0].content.parts[0].text);
  }

  private async analyzeWithXAI(request: MoralAnalysisRequest): Promise<AIResponse> {
    const prompt = this.buildMoralAnalysisPrompt(request);
    
    const response = await fetch('https://api.x.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.xaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'grok-beta',
        messages: [
          {
            role: 'system',
            content: 'You are an AI ethics advisor providing thoughtful moral guidance. Respond in JSON format with structured analysis.'
          },
          {
            role: 'user', 
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      throw new Error(`XAI API error: ${response.status}`);
    }

    const data = await response.json();
    return this.parseXAIResponse(data.choices[0].message.content);
  }

  private buildMoralAnalysisPrompt(request: MoralAnalysisRequest): string {
    return `
You are an advanced AI ethics advisor with deep psychological insight and predictive capabilities.

Analyze this moral situation with sophisticated psychological understanding:

SITUATION: "${request.situation}"

CONTEXT:
- Emotional state: ${JSON.stringify(request.context.emotional)}
- Environment: ${request.context.environmental.join(', ')}
- Social factors: ${JSON.stringify(request.context.social)}

ADVANCED ANALYSIS REQUIRED:
1. Deep psychological factors underlying the situation
2. Unconscious biases or motivations that might be at play
3. Long-term character development implications
4. Systemic and cultural context affecting moral reasoning
5. Potential for personal growth through this challenge
6. Risk assessment for various decision paths
7. Alignment with universal ethical principles and personal values integration

Provide a comprehensive moral analysis including:
1. Ethical alignment score (0-1) with psychological reasoning
2. Deep conflicting values or dilemmas (including unconscious ones)
3. Multi-layered short-term and long-term consequences (psychological, social, spiritual)
4. Sophisticated recommended actions with implementation strategies
5. Relevant moral principles with personal relevance weighting
6. Advanced reasoning incorporating psychological depth
7. Character development opportunities embedded in this situation
8. Predictive insights about how different choices might unfold

Respond in JSON format with these exact fields:
{
  "ethicalAlignment": number,
  "conflictingValues": ["deep psychological conflicts"],
  "potentialConsequences": {
    "shortTerm": ["immediate psychological/social impacts"],
    "longTerm": ["character development/life trajectory impacts"]
  },
  "recommendedActions": ["psychologically-informed actions"],
  "moralPrinciples": [{"principle": string, "relevance": number, "personalRelevance": string}],
  "reasoning": "deep psychological and ethical analysis",
  "characterDevelopment": ["growth opportunities"],
  "riskFactors": ["psychological risks"],
  "predictiveInsights": ["likely outcomes based on psychological patterns"]
}
    `;
  }

  private parseGeminiResponse(text: string): AIResponse {
    try {
      // Try to extract JSON from the response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        // Clean the JSON string before parsing
        let cleanedJson = jsonMatch[0];
        
        // Remove comments (// and /* */)
        cleanedJson = cleanedJson.replace(/\/\*[\s\S]*?\*\//g, '');
        cleanedJson = cleanedJson.replace(/\/\/.*$/gm, '');
        
        // Remove trailing commas before closing brackets/braces
        cleanedJson = cleanedJson.replace(/,(\s*[}\]])/g, '$1');
        
        // Remove any remaining whitespace issues
        cleanedJson = cleanedJson.replace(/\n/g, ' ').replace(/\s+/g, ' ');
        
        return JSON.parse(cleanedJson);
      }
    } catch (error) {
      console.error('Failed to parse Gemini response as JSON:', error);
    }
    
    // Fallback to text parsing
    return this.parseTextResponse(text);
  }

  private parseXAIResponse(text: string): AIResponse {
    try {
      // Clean the JSON string before parsing
      let cleanedJson = text;
      
      // Remove comments (// and /* */)
      cleanedJson = cleanedJson.replace(/\/\*[\s\S]*?\*\//g, '');
      cleanedJson = cleanedJson.replace(/\/\/.*$/gm, '');
      
      // Remove trailing commas before closing brackets/braces
      cleanedJson = cleanedJson.replace(/,(\s*[}\]])/g, '$1');
      
      // Remove any remaining whitespace issues
      cleanedJson = cleanedJson.replace(/\n/g, ' ').replace(/\s+/g, ' ');
      
      return JSON.parse(cleanedJson);
    } catch (error) {
      console.error('Failed to parse XAI response as JSON:', error);
      return this.parseTextResponse(text);
    }
  }

  private parseTextResponse(text: string): AIResponse {
    // Intelligent text parsing fallback
    return {
      ethicalAlignment: this.extractEthicalScore(text),
      conflictingValues: this.extractConflicts(text),
      potentialConsequences: {
        shortTerm: this.extractConsequences(text, 'short'),
        longTerm: this.extractConsequences(text, 'long')
      },
      recommendedActions: this.extractRecommendations(text),
      moralPrinciples: this.extractPrinciples(text),
      reasoning: text
    };
  }

  private extractEthicalScore(text: string): number {
    const scoreMatch = text.match(/(?:score|alignment|rating).*?(\d+(?:\.\d+)?)/i);
    if (scoreMatch) {
      const score = parseFloat(scoreMatch[1]);
      return score > 1 ? score / 100 : score; // Convert percentage to decimal
    }
    return 0.75; // Default moderate score
  }

  private extractConflicts(text: string): string[] {
    const conflicts = [];
    if (text.toLowerCase().includes('autonomy') && text.toLowerCase().includes('beneficence')) {
      conflicts.push('autonomy_vs_beneficence');
    }
    if (text.toLowerCase().includes('individual') && text.toLowerCase().includes('collective')) {
      conflicts.push('individual_vs_collective_good');
    }
    return conflicts.length ? conflicts : ['competing_moral_values'];
  }

  private extractConsequences(text: string, timeframe: 'short' | 'long'): string[] {
    const keywords = timeframe === 'short' 
      ? ['immediate', 'short-term', 'instant', 'direct']
      : ['long-term', 'future', 'lasting', 'eventual'];
    
    const consequences = [];
    if (keywords.some(kw => text.toLowerCase().includes(kw))) {
      consequences.push(`${timeframe}_term_impact_identified`);
    }
    return consequences.length ? consequences : [`${timeframe}_term_considerations`];
  }

  private extractRecommendations(text: string): string[] {
    const recommendations = [];
    if (text.toLowerCase().includes('consider')) {
      recommendations.push('Consider all stakeholder perspectives');
    }
    if (text.toLowerCase().includes('communicate') || text.toLowerCase().includes('discuss')) {
      recommendations.push('Engage in open communication');
    }
    if (text.toLowerCase().includes('reflect') || text.toLowerCase().includes('think')) {
      recommendations.push('Take time for reflection');
    }
    return recommendations.length ? recommendations : ['Seek additional ethical guidance'];
  }

  private extractPrinciples(text: string): Array<{ principle: string; relevance: number }> {
    const principles = [];
    const ethicalTerms = [
      'autonomy', 'beneficence', 'justice', 'care', 'virtue', 'utility', 'fidelity', 'non_maleficence'
    ];

    ethicalTerms.forEach(term => {
      if (text.toLowerCase().includes(term)) {
        principles.push({
          principle: term,
          relevance: Math.random() * 0.3 + 0.7 // 0.7-1.0
        });
      }
    });

    return principles.length ? principles : [
      { principle: 'beneficence', relevance: 0.8 },
      { principle: 'autonomy', relevance: 0.75 }
    ];
  }

  private getFallbackResponse(request: MoralAnalysisRequest): AIResponse {
    return {
      ethicalAlignment: 0.78,
      conflictingValues: ['individual_autonomy_vs_social_expectations'],
      potentialConsequences: {
        shortTerm: ['immediate_relationship_dynamics', 'emotional_responses'],
        longTerm: ['trust_and_credibility_development', 'personal_growth']
      },
      recommendedActions: [
        'Consider the perspectives of all affected parties',
        'Evaluate both immediate and long-term consequences',
        'Maintain transparency while showing empathy',
        'Seek additional input if the situation remains unclear'
      ],
      moralPrinciples: [
        { principle: 'autonomy', relevance: 0.85 },
        { principle: 'beneficence', relevance: 0.78 },
        { principle: 'justice', relevance: 0.72 },
        { principle: 'care', relevance: 0.81 }
      ],
      reasoning: 'This analysis uses ethical frameworks to evaluate the situation and provide balanced guidance.'
    };
  }
}

export const aiService = AIService.getInstance();