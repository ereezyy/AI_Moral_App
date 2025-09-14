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
    const userMessages = messages.filter(msg => msg.type === 'user');
    const allText = userMessages.map(msg => msg.content || '').join(' ');

    return {
      emotionalPatterns: this.analyzeEmotionalPatterns(allText),
      valuePatterns: this.analyzeValuePatterns(allText),
      behavioralPatterns: this.analyzeBehavioralPatterns(allText, userMessages),
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

  private static analyzeBehavioralPatterns(text: string, messages: any[]): string[] {
    const patterns = [];
    
    // Response length patterns
    const avgMessageLength = messages.reduce((acc, msg) => acc + (msg.content?.length || 0), 0) / messages.length;
    if (avgMessageLength > 100) {
      patterns.push('detailed_communicator');
    } else if (avgMessageLength < 30) {
      patterns.push('concise_communicator');
    }

    // Question asking pattern
    const questionCount = messages.filter(msg => msg.content?.includes('?')).length;
    if (questionCount > messages.length * 0.3) {
      patterns.push('question_oriented');
    }

    // Help seeking pattern
    const helpWords = ['help', 'advice', 'guidance', 'support'];
    if (helpWords.some(word => text.toLowerCase().includes(word))) {
      patterns.push('help_seeking');
    }

    return patterns;
  }

  private static analyzeConcernPatterns(text: string): string[] {
    const concernKeywords = ['worried', 'concerned', 'anxious', 'stressed', 'overwhelmed', 'scared'];
    return concernKeywords.filter(concern => 
      text.toLowerCase().includes(concern)
    );
  }

  private static analyzeGoalPatterns(text: string): string[] {
    const goalIndicators = [];
    
    if (text.toLowerCase().includes('want to') || text.toLowerCase().includes('goal')) {
      goalIndicators.push('goal_oriented');
    }
    if (text.toLowerCase().includes('improve') || text.toLowerCase().includes('better')) {
      goalIndicators.push('improvement_focused');
    }
    if (text.toLowerCase().includes('learn') || text.toLowerCase().includes('grow')) {
      goalIndicators.push('growth_minded');
    }
    
    return goalIndicators;
  }

  static extractUserProfile(patterns: ConversationPatterns) {
    const dominantEmotions = Object.entries(patterns.emotionalPatterns)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([emotion]) => emotion);

    const communicationStyle = this.determineCommunicationStyle(patterns);

    return {
      primaryEmotions: dominantEmotions,
      coreValues: patterns.valuePatterns.slice(0, 5),
      mainConcerns: patterns.concernPatterns.slice(0, 3),
      activeGoals: patterns.goalPatterns.slice(0, 3),
      communicationStyle,
      interactionPreferences: this.determineInteractionPreferences(patterns)
    };
  }

  private static determineCommunicationStyle(patterns: ConversationPatterns): string {
    const hasDetailedCommunication = patterns.behavioralPatterns.includes('detailed_communicator');
    const isQuestionOriented = patterns.behavioralPatterns.includes('question_oriented');
    const isHelpSeeking = patterns.behavioralPatterns.includes('help_seeking');
    
    if (hasDetailedCommunication && isQuestionOriented) return 'analytical_explorer';
    if (isHelpSeeking && hasDetailedCommunication) return 'collaborative_detailed';
    if (isQuestionOriented) return 'curious_investigator';
    if (hasDetailedCommunication) return 'thoughtful_explainer';
    
    return 'balanced_communicator';
  }

  private static determineInteractionPreferences(patterns: ConversationPatterns): string[] {
    const preferences = [];
    
    if (patterns.goalPatterns.includes('goal_oriented')) {
      preferences.push('action_oriented_guidance');
    }
    if (patterns.concernPatterns.length > 2) {
      preferences.push('emotional_support_focus');
    }
    if (patterns.behavioralPatterns.includes('question_oriented')) {
      preferences.push('exploratory_dialogue');
    }
    
    return preferences;
  }
}