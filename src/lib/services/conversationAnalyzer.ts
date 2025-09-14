import { TextAnalyzer } from '../utils/textAnalysis';

export interface ConversationPatterns {
  emotionalPatterns: Record<string, number>;
  valuePatterns: string[];
  behavioralPatterns: string[];
  concernPatterns: string[];
  goalPatterns: string[];
}

export class ConversationAnalyzer {
  static analyzeConversationHistory(messages: any[]): ConversationPatterns {
    const allText = messages
      .filter(msg => msg.type === 'user')
      .map(msg => msg.content || '')
      .join(' ');

    return {
      emotionalPatterns: this.analyzeEmotionalPatterns(allText),
      valuePatterns: this.analyzeValuePatterns(allText),
      behavioralPatterns: this.analyzeBehavioralPatterns(allText),
      concernPatterns: this.analyzeConcernPatterns(allText),
      goalPatterns: this.analyzeGoalPatterns(allText)
    };
  }

  private static analyzeEmotionalPatterns(text: string): Record<string, number> {
    const emotionalWords = TextAnalyzer.extractEmotionalWords(text);
    const patterns: Record<string, number> = {};
    
    emotionalWords.forEach(word => {
      patterns[word] = (patterns[word] || 0) + 1;
    });
    
    return patterns;
  }

  private static analyzeValuePatterns(text: string): string[] {
    return TextAnalyzer.extractValueWords(text);
  }

  private static analyzeBehavioralPatterns(text: string): string[] {
    const behaviorKeywords = ['always', 'usually', 'tend to', 'often', 'habit'];
    const patterns = [];
    
    for (const keyword of behaviorKeywords) {
      if (text.toLowerCase().includes(keyword)) {
        patterns.push(`behavioral_pattern_${keyword.replace(' ', '_')}`);
      }
    }
    
    return patterns;
  }

  private static analyzeConcernPatterns(text: string): string[] {
    const concernKeywords = ['worried', 'concerned', 'anxious', 'stressed', 'overwhelmed'];
    return concernKeywords.filter(concern => 
      text.toLowerCase().includes(concern)
    );
  }

  private static analyzeGoalPatterns(text: string): string[] {
    const goalKeywords = ['want to', 'goal', 'achieve', 'improve', 'develop'];
    const patterns = [];
    
    for (const keyword of goalKeywords) {
      if (text.toLowerCase().includes(keyword)) {
        patterns.push(`goal_oriented_${keyword.replace(' ', '_')}`);
      }
    }
    
    return patterns;
  }

  static extractUserProfile(patterns: ConversationPatterns) {
    const dominantEmotions = Object.entries(patterns.emotionalPatterns)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([emotion]) => emotion);

    return {
      primaryEmotions: dominantEmotions,
      coreValues: patterns.valuePatterns.slice(0, 5),
      mainConcerns: patterns.concernPatterns.slice(0, 3),
      activeGoals: patterns.goalPatterns.slice(0, 3),
      communicationStyle: this.determineCommunicationStyle(patterns)
    };
  }

  private static determineCommunicationStyle(patterns: ConversationPatterns): string {
    const hasEmotionalWords = patterns.emotionalPatterns && Object.keys(patterns.emotionalPatterns).length > 3;
    const hasAnalyticalWords = patterns.behavioralPatterns.some(pattern => 
      pattern.includes('analyze') || pattern.includes('think')
    );
    
    if (hasEmotionalWords && hasAnalyticalWords) return 'balanced';
    if (hasEmotionalWords) return 'emotional';
    if (hasAnalyticalWords) return 'analytical';
    return 'developing';
  }
}