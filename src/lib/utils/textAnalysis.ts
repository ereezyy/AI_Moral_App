export class TextAnalyzer {
  static countKeywords(text: string, keywords: string[]): number {
    const normalizedText = text.toLowerCase();
    return keywords.filter(keyword => 
      normalizedText.includes(keyword.toLowerCase())
    ).length;
  }

  static extractEmotionalWords(text: string): string[] {
    const emotionalVocabulary = [
      // Positive emotions
      'happy', 'joy', 'excited', 'grateful', 'hopeful', 'confident', 'peaceful', 'content',
      'proud', 'satisfied', 'optimistic', 'enthusiastic', 'cheerful', 'delighted',
      
      // Negative emotions  
      'sad', 'angry', 'worried', 'anxious', 'frustrated', 'disappointed', 'overwhelmed',
      'stressed', 'fearful', 'concerned', 'upset', 'irritated', 'depressed', 'lonely',
      
      // Neutral/complex emotions
      'confused', 'uncertain', 'thoughtful', 'reflective', 'curious', 'surprised',
      'mixed', 'conflicted', 'ambivalent', 'contemplative'
    ];
    
    return emotionalVocabulary.filter(word => 
      text.toLowerCase().includes(word)
    );
  }

  static extractValueWords(text: string): string[] {
    const valueWords = [
      'honesty', 'integrity', 'freedom', 'security', 'growth', 'family', 'success',
      'justice', 'compassion', 'trust', 'respect', 'loyalty', 'fairness', 'kindness',
      'authenticity', 'creativity', 'achievement', 'connection', 'independence',
      'responsibility', 'excellence', 'balance', 'wisdom', 'courage', 'love'
    ];
    
    return valueWords.filter(word => 
      text.toLowerCase().includes(word)
    );
  }

  static calculateWordComplexity(text: string): number {
    const words = text.split(/\s+/).filter(word => word.length > 0);
    if (words.length === 0) return 0;
    
    const complexWords = words.filter(word => word.length > 6);
    return complexWords.length / words.length;
  }

  static calculateSentiment(text: string): number {
    const positiveWords = [
      'good', 'great', 'happy', 'love', 'wonderful', 'amazing', 'excellent',
      'fantastic', 'awesome', 'brilliant', 'perfect', 'outstanding', 'superb',
      'delightful', 'magnificent', 'remarkable', 'incredible', 'marvelous'
    ];
    
    const negativeWords = [
      'bad', 'terrible', 'hate', 'awful', 'horrible', 'worst', 'dreadful',
      'disgusting', 'disappointing', 'frustrating', 'annoying', 'pathetic',
      'miserable', 'devastating', 'tragic', 'depressing', 'hopeless'
    ];
    
    const positiveCount = this.countKeywords(text, positiveWords);
    const negativeCount = this.countKeywords(text, negativeWords);
    
    // Sentiment score: 0 = very negative, 0.5 = neutral, 1 = very positive
    const rawScore = 0.5 + (positiveCount - negativeCount) * 0.1;
    return Math.max(0, Math.min(1, rawScore));
  }

  static extractCertaintyLevel(text: string): number {
    const highCertaintyWords = [
      'definitely', 'absolutely', 'certainly', 'sure', 'confident', 'positive',
      'convinced', 'undoubtedly', 'clearly', 'obviously', 'without doubt'
    ];
    
    const lowCertaintyWords = [
      'maybe', 'perhaps', 'possibly', 'might', 'unsure', 'uncertain',
      'probably', 'likely', 'seems', 'appears', 'guess', 'think'
    ];
    
    const highCount = this.countKeywords(text, highCertaintyWords);
    const lowCount = this.countKeywords(text, lowCertaintyWords);
    
    // Certainty score: 0 = very uncertain, 0.5 = neutral, 1 = very certain
    const rawScore = 0.5 + (highCount - lowCount) * 0.15;
    return Math.max(0, Math.min(1, rawScore));
  }

  static identifyTopics(text: string): string[] {
    const topicKeywords = {
      relationships: ['relationship', 'partner', 'friend', 'family', 'love', 'marriage', 'dating'],
      work: ['work', 'job', 'career', 'professional', 'business', 'colleague', 'boss'],
      health: ['health', 'fitness', 'exercise', 'wellness', 'medical', 'doctor', 'sick'],
      money: ['money', 'financial', 'budget', 'income', 'salary', 'debt', 'savings'],
      education: ['school', 'study', 'learn', 'education', 'university', 'course', 'degree'],
      personal_growth: ['growth', 'develop', 'improve', 'change', 'transform', 'evolve'],
      spirituality: ['spiritual', 'religion', 'faith', 'meditation', 'prayer', 'meaning'],
      creativity: ['creative', 'art', 'music', 'write', 'design', 'express', 'imagination']
    };

    const identifiedTopics = [];
    
    for (const [topic, keywords] of Object.entries(topicKeywords)) {
      if (keywords.some(keyword => text.toLowerCase().includes(keyword))) {
        identifiedTopics.push(topic);
      }
    }

    return identifiedTopics;
  }

  static analyzeUrgency(text: string): number {
    const urgentWords = [
      'urgent', 'emergency', 'immediate', 'crisis', 'asap', 'right now',
      'desperately', 'critical', 'serious', 'important', 'pressing'
    ];
    
    const urgentCount = this.countKeywords(text, urgentWords);
    return Math.min(1, urgentCount * 0.3);
  }

  static extractQuestions(text: string): string[] {
    return text.split(/[.!]+/).filter(sentence => 
      sentence.trim().endsWith('?')
    ).map(question => question.trim());
  }

  static analyzeFormality(text: string): number {
    const formalWords = [
      'please', 'thank you', 'appreciate', 'grateful', 'respect',
      'professional', 'formal', 'official', 'appropriate'
    ];
    
    const informalWords = [
      'hey', 'yeah', 'ok', 'cool', 'awesome', 'guys', 'stuff', 'things'
    ];
    
    const formalCount = this.countKeywords(text, formalWords);
    const informalCount = this.countKeywords(text, informalWords);
    
    const rawScore = 0.5 + (formalCount - informalCount) * 0.2;
    return Math.max(0, Math.min(1, rawScore));
  }
}