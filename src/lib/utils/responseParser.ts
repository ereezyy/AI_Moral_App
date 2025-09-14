export interface ParsedResponse {
  text: string;
  emotion: string;
  priority: string;
  suggestions: string[];
  followUpQuestions: string[];
  predictions?: string[];
  riskFactors?: string[];
  growthOpportunities?: string[];
}

export class ResponseParser {
  static parseAIResponse(rawResponse: string): ParsedResponse {
    try {
      const cleanedJson = this.cleanJsonString(rawResponse);
      const parsed = JSON.parse(cleanedJson);
      
      if (this.isValidResponse(parsed)) {
        return parsed;
      }
    } catch (error) {
      console.warn('JSON parsing failed, using text analysis:', error);
    }
    
    return this.parseTextResponse(rawResponse);
  }

  private static cleanJsonString(jsonString: string): string {
    let cleaned = jsonString;
    
    // Extract JSON block if embedded in text
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      cleaned = jsonMatch[0];
    }
    
    // Remove comments
    cleaned = cleaned.replace(/\/\*[\s\S]*?\*\//g, '');
    cleaned = cleaned.replace(/\/\/.*$/gm, '');
    
    // Fix trailing commas
    cleaned = cleaned.replace(/,(\s*[}\]])/g, '$1');
    
    // Normalize whitespace
    cleaned = cleaned.replace(/\n/g, ' ').replace(/\s+/g, ' ');
    
    return cleaned;
  }

  private static isValidResponse(obj: any): boolean {
    return obj && 
           typeof obj.text === 'string' && 
           typeof obj.emotion === 'string' && 
           Array.isArray(obj.suggestions);
  }

  private static parseTextResponse(text: string): ParsedResponse {
    const emotion = this.extractEmotion(text);
    const priority = this.extractPriority(text);
    const suggestions = this.extractSuggestions(text);
    const followUpQuestions = this.extractQuestions(text);
    
    return {
      text: text.substring(0, 500),
      emotion,
      priority,
      suggestions,
      followUpQuestions,
      predictions: this.extractPredictions(text),
      growthOpportunities: this.extractGrowthOpportunities(text)
    };
  }

  private static extractEmotion(text: string): string {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('concern') || lowerText.includes('worry')) return 'concerned';
    if (lowerText.includes('excited') || lowerText.includes('amazing')) return 'excited';
    if (lowerText.includes('encourage') || lowerText.includes('you can')) return 'encouraging';
    if (lowerText.includes('think') || lowerText.includes('consider')) return 'thoughtful';
    
    return 'supportive';
  }

  private static extractPriority(text: string): string {
    const lowerText = text.toLowerCase();
    
    if (lowerText.includes('urgent') || lowerText.includes('critical')) return 'urgent';
    if (lowerText.includes('important') || lowerText.includes('significant')) return 'high';
    
    return 'medium';
  }

  private static extractSuggestions(text: string): string[] {
    const suggestions = [];
    const sentences = text.split(/[.!?]+/);
    
    for (const sentence of sentences) {
      const trimmed = sentence.trim();
      if (trimmed && (
        trimmed.includes('try') || 
        trimmed.includes('consider') || 
        trimmed.includes('might')
      )) {
        suggestions.push(trimmed);
      }
    }
    
    return suggestions.slice(0, 3);
  }

  private static extractQuestions(text: string): string[] {
    const questions = text.split(/[.!]+/).filter(sentence => 
      sentence.trim().endsWith('?')
    );
    
    return questions.length > 0 ? questions.slice(0, 2) : [
      "How are you feeling about this approach?",
      "What patterns do you notice in yourself?"
    ];
  }

  private static extractPredictions(text: string): string[] {
    const predictions = [];
    
    if (text.toLowerCase().includes('likely')) {
      predictions.push('Positive outcome likely with current approach');
    }
    if (text.toLowerCase().includes('growth')) {
      predictions.push('Personal growth opportunities identified');
    }
    
    return predictions;
  }

  private static extractGrowthOpportunities(text: string): string[] {
    const opportunities = [];
    
    if (text.toLowerCase().includes('develop')) {
      opportunities.push('Skill development opportunity');
    }
    if (text.toLowerCase().includes('learn')) {
      opportunities.push('Learning and growth potential');
    }
    
    return opportunities;
  }
}